import { useState } from 'react'
import type { Quiz } from '../../types'

interface QuizViewerProps {
  quiz: Quiz
  onSubmit: (answers: Record<string, string>) => void
  loading?: boolean
}

export function QuizViewer({ quiz, onSubmit, loading }: QuizViewerProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    onSubmit(answers)
  }

  const questions = Array.isArray(quiz.questions) ? quiz.questions : []
  
  // If no questions at all, show error
  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">No Questions Available</h2>
          <p className="text-gray-600 mb-6">
            The quiz could not be generated. Please try again or contact support.
          </p>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  // Only show "Quiz Complete" if we've gone through all questions
  if (!question && currentQuestion >= questions.length) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">Review your answers and submit when ready.</p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-600">
            Question {currentQuestion + 1} of {questions.length || 0}
          </span>
          <span className="text-sm text-gray-500">
            Difficulty: {quiz.difficulty || 'N/A'}/5
          </span>
        </div>
        <ProgressBar
          value={questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{question.question || 'Question'}</h2>

        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id || `q${currentQuestion}`, String(index))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[question.id || `q${currentQuestion}`] === String(index)
                    ? 'border-[#FF6B35] bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-[#FF6B35] hover:bg-gray-50'
                }`}
              >
                <span className="font-medium text-gray-900">{option}</span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'free_text' && (
          <textarea
            value={answers[question.id || `q${currentQuestion}`] || ''}
            onChange={(e) => handleAnswer(question.id || `q${currentQuestion}`, e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-xl border-2 border-gray-200 focus:border-[#FF6B35] focus:outline-none text-gray-900"
            rows={6}
            placeholder="Type your answer here..."
          />
        )}

        {question.type === 'coding' && (
          <div className="space-y-4">
            <textarea
              value={answers[question.id || `q${currentQuestion}`] || ''}
              onChange={(e) => handleAnswer(question.id || `q${currentQuestion}`, e.target.value)}
              className="w-full p-4 bg-gray-900 rounded-xl border-2 border-gray-200 focus:border-[#FF6B35] focus:outline-none font-mono text-gray-100"
              rows={12}
              placeholder="Write your code here..."
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-xl font-semibold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            borderColor: currentQuestion === 0 ? '#E5E7EB' : '#FF6B35',
            color: currentQuestion === 0 ? '#9CA3AF' : '#FF6B35'
          }}
        >
          Previous
        </button>
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))
            }
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
            }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300 rounded-full"
        style={{ 
          width: `${value}%`,
          background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
        }}
      />
    </div>
  )
}

