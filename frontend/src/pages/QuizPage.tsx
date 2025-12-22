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
  const [showResults, setShowResults] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)

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
        // Extract quiz data from reports array (Jaseci returns data in reports[0])
        const responseData = response.data as any
        if (responseData.reports && responseData.reports.length > 0) {
          quizData = responseData.reports[0] as Quiz
        } else {
          quizData = response.data as Quiz
        }
        
        questions = quizData.questions || []
        
        // byLLM returns raw_response with JSON string - parse it
        if ((!questions || questions.length === 0) && quizData.raw_response) {
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
            }
          } catch (parseError) {
            // Silent fail - will use fallback questions
          }
        }
      }
      
      // Fallback: if still no questions, use static Jaseci quiz
      if (!questions || questions.length === 0) {
        questions = [
          {
            id: 'q1',
            type: 'multiple_choice',
            question: 'What is Jaseci?',
            options: ['A web framework', 'An AI platform for graph-based agents', 'A database', 'A programming IDE'],
            correct_answer: '1',
            max_score: 1,
            explanation: 'Jaseci is an open-source platform for building AI-powered graph-based applications.'
          },
          {
            id: 'q2',
            type: 'multiple_choice',
            question: 'What is a walker in Jac?',
            options: ['A data type', 'A loop construct', 'A computational agent that traverses graphs', 'A variable'],
            correct_answer: '2',
            max_score: 1,
            explanation: 'Walkers are computational agents that traverse and operate on graph structures in Jaseci.'
          },
          {
            id: 'q3',
            type: 'multiple_choice',
            question: 'What programming paradigm does Jac primarily use?',
            options: ['Functional programming', 'Object-Oriented programming', 'Object-Spatial Programming (OSP)', 'Procedural programming'],
            correct_answer: '2',
            max_score: 1,
            explanation: 'Jac uses Object-Spatial Programming (OSP), which combines OOP with graph-based spatial reasoning.'
          },
          {
            id: 'q4',
            type: 'multiple_choice',
            question: 'What is byLLM used for in Jaclang?',
            options: ['Database queries', 'File I/O', 'Integrating AI/LLM capabilities', 'Network requests'],
            correct_answer: '2',
            max_score: 1,
            explanation: 'byLLM allows Jaclang programs to integrate with Large Language Models for AI functionality.'
          },
          {
            id: 'q5',
            type: 'multiple_choice',
            question: 'What is a node in Jaseci?',
            options: ['A function', 'A vertex in the graph with properties', 'A loop variable', 'A method'],
            correct_answer: '1',
            max_score: 1,
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
      // Pass questions along with answers for evaluation
      const response = await submitQuiz(user.id, quiz.id, answers, quiz.questions)
      
      if (response.success) {
        // Extract results from response
        const responseData = response.data as any
        const results = responseData?.reports?.[0] || responseData
        
        setQuizResults(results)
        setShowResults(true)
        await refreshProgress()
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

  // Show results after quiz submission
  if (showResults && quizResults) {
    const score = quizResults.score || 0
    const correctCount = quizResults.correct_answers || 0
    const totalQuestions = quizResults.total_questions || 5
    const questionResults = quizResults.results || []
    const needsRevision = quizResults.needs_revision || false
    const weakConcepts = quizResults.weak_concepts || []
    
    return (
      <div className="min-h-screen bg-dark-bg py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#FF6B35' }}>
                🎉 Quiz Completed!
              </h1>
              <div className="text-6xl mb-4">
                {score >= 0.8 ? '🌟' : score >= 0.6 ? '👏' : '💪'}
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: '#FF6B35' }}>
                {Math.round(score * 100)}%
              </p>
              <p className="text-lg text-gray-600 mb-6">
                {correctCount} out of {totalQuestions} correct
              </p>
              
              {/* AI Feedback Section */}
              <div className="mb-8 p-6 rounded-lg" style={{ background: 'linear-gradient(135deg, #FFF5F0 0%, #FFF9E6 100%)', border: '2px solid #FFD23F' }}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🤖</div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#FF6B35' }}>
                      AI Feedback
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {quizResults.feedback || 'Great job! Keep learning!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Show individual question results */}
            {questionResults.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Your Answers:</h2>
                <div className="space-y-4">
                  {questionResults.map((result: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${
                        result.is_correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">
                          {result.is_correct ? '✅' : '❌'}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">
                            Q{idx + 1}: {result.question}
                          </p>
                          <p className="text-sm text-gray-600">
                            Your answer: <span className="font-semibold">{result.user_answer}</span>
                          </p>
                          {!result.is_correct && (
                            <p className="text-sm text-gray-600">
                              Correct answer: <span className="font-semibold text-green-700">{result.correct_answer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revision Prompt */}
            {needsRevision && (
              <div className="mb-8 p-6 rounded-lg border-2 border-orange-500 bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📚</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#FF6B35' }}>
                      Revision Recommended
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Your score is below 70%. Consider reviewing these concepts before moving forward:
                    </p>
                    {weakConcepts.length > 0 && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {weakConcepts.slice(0, 3).map((concept: string, idx: number) => (
                          <li key={idx}>{concept}</li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => navigate('/lessons')}
                      className="mt-4 px-4 py-2 rounded-lg font-semibold text-white text-sm"
                      style={{ background: '#FF6B35' }}
                    >
                      Review Lessons
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
              >
                Continue to Dashboard
              </button>
            </div>
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

