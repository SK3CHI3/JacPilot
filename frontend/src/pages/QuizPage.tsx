import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Quiz } from '../types'
import { generateQuiz, submitQuiz } from '../services/jacClient'
import { quizzes } from '../services/supabase'
import { useUser } from '../contexts/UserContext'
import { QuizViewer } from '../components/quiz/QuizViewer'
import { Button } from '../components/common/Button'

export default function QuizPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, refreshProgress } = useUser()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadQuiz()
  }, [id])

  const loadQuiz = async () => {
    if (!id || !user) return

    setLoading(true)
    try {
      // Try to get existing quiz from Supabase first
      const { data, error } = await quizzes.getByLesson(id)
      if (!error && data) {
        setQuiz(data as Quiz)
        return
      }
      
      // If no quiz found, generate via Jaseci walker
      // Hackathon requirement: Frontend MUST use spawnWalker(), not direct API calls
      const response = await generateQuiz(id, user.id)
      let questions: Quiz['questions'] = []
      let quizData: Partial<Quiz> = {}
      
      if (response.success && response.data) {
        quizData = response.data as Quiz
        questions = quizData.questions || []
        
        // byLLM returns raw_response with JSON string - parse it
        if ((!questions || questions.length === 0) && quizData.raw_response) {
          console.log('Parsing byLLM raw_response for quiz questions')
          try {
            // byLLM often wraps JSON in markdown code blocks
            let rawResponse = quizData.raw_response as string
            
            // Remove markdown code block wrappers if present
            if (rawResponse.includes('```json')) {
              rawResponse = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
            } else if (rawResponse.includes('```')) {
              rawResponse = rawResponse.replace(/```\n?/g, '')
            }
            
            const parsed = JSON.parse(rawResponse.trim())
            if (parsed.questions && Array.isArray(parsed.questions)) {
              questions = parsed.questions.map((q: Record<string, unknown>, idx: number) => ({
                id: q.id || `q${idx + 1}`,
                type: q.type || 'multiple_choice',
                question: q.question,
                options: q.options,
                correct_answer: q.correct_answer ?? q.correct_answer_index ?? 0,
                explanation: q.explanation || ''
              }))
              console.log('Parsed', questions.length, 'questions from byLLM response')
            }
          } catch (parseError) {
            console.error('Failed to parse byLLM response:', parseError)
          }
        }
      }
      
      // Fallback: if still no questions, use static Jaseci quiz
      if (!questions || questions.length === 0) {
        console.log('Using fallback quiz questions')
        questions = [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'What is Jaseci?',
            options: ['A web framework', 'An AI platform for graph-based agents', 'A database', 'A programming IDE'],
            correct_answer: 1,
            explanation: 'Jaseci is an open-source platform for building AI-powered graph-based applications.'
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            question: 'What is a walker in Jac?',
            options: ['A data type', 'A loop construct', 'A computational agent that traverses graphs', 'A variable'],
            correct_answer: 2,
            explanation: 'Walkers are computational agents that traverse and operate on graph structures in Jaseci.'
          },
          {
            id: 'q3',
            type: 'multiple_choice',
            question: 'What programming paradigm does Jac primarily use?',
            options: ['Functional programming', 'Object-Oriented programming', 'Object-Spatial Programming (OSP)', 'Procedural programming'],
            correct_answer: 2,
            explanation: 'Jac uses Object-Spatial Programming (OSP), which combines OOP with graph-based spatial reasoning.'
          },
          {
            id: 'q4',
            type: 'multiple_choice',
            question: 'What is byLLM used for in Jaclang?',
            options: ['Database queries', 'File I/O', 'Integrating AI/LLM capabilities', 'Network requests'],
            correct_answer: 2,
            explanation: 'byLLM allows Jaclang programs to integrate with Large Language Models for AI functionality.'
          },
          {
            id: 'q5',
            type: 'multiple_choice',
            question: 'What is a node in Jaseci?',
            options: ['A function', 'A vertex in the graph with properties', 'A loop variable', 'A method'],
            correct_answer: 1,
            explanation: 'Nodes are vertices in the Jaseci graph that can hold data and be connected by edges.'
          }
        ]
      }
      
      setQuiz({
        ...quizData,
        questions,
        id: quizData.id || quizData.quiz_id || `quiz-${id}`
      } as Quiz)
    } catch (error) {
      console.error('Error loading quiz:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (answers: Record<string, string>) => {
    if (!user || !quiz) return

    setSubmitting(true)
    try {
      const response = await submitQuiz(user.id, quiz.id, answers)
      if (response.success) {
        await refreshProgress()
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading quiz...</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Quiz Not Available</h2>
          <p className="text-gray-600 mb-4">
            The quiz for this lesson could not be generated. This may be because:
          </p>
          <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
            <li>• Jaseci server is not running (required for quiz generation)</li>
            <li>• Quiz generation walker is unavailable</li>
            <li>• No quiz exists for this lesson yet</li>
          </ul>
          <p className="text-sm text-gray-500 mb-6">
            <strong>Note:</strong> According to hackathon guidelines, all quiz generation must go through Jaseci walkers using <code>spawnWalker()</code>. Please ensure the Jaseci server is running.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => loadQuiz()}
              className="px-6 py-3 rounded-xl font-semibold border-2"
              style={{ 
                borderColor: '#FF6B35',
                color: '#FF6B35'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          ← Back to Dashboard
        </Button>

        <QuizViewer quiz={quiz} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  )
}

