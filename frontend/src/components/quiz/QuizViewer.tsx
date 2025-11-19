import { useState } from 'react'
import type { Quiz } from '../../types'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

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

  const question = quiz.questions[currentQuestion]

  if (!question) {
    return (
      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-400">
            Difficulty: {quiz.difficulty}/5
          </span>
        </div>
        <ProgressBar
          value={((currentQuestion + 1) / quiz.questions.length) * 100}
          color="purple"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">{question.question}</h2>

        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === option
                    ? 'border-purple-primary bg-purple-primary/10'
                    : 'border-dark-border hover:border-purple-primary/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === 'free_text' && (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-4 bg-dark-border rounded-lg border border-dark-border focus:border-purple-primary focus:outline-none text-white"
            rows={6}
            placeholder="Type your answer here..."
          />
        )}

        {question.type === 'coding' && (
          <div className="space-y-4">
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-full p-4 bg-dark-border rounded-lg border border-dark-border focus:border-purple-primary focus:outline-none font-mono text-white"
              rows={12}
              placeholder="Write your code here..."
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))
            }
          >
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>
    </Card>
  )
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-2 bg-dark-border rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-${color} transition-all duration-300`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

