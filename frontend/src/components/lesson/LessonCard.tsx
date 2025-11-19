import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { Play, CheckCircle2, XCircle, Loader, Code2, BookOpen } from 'lucide-react'
import { evaluateCode } from '../../services/gemini'

interface LessonSection {
  id: string
  title: string
  content: string
  codeExample?: string
  practiceExercise?: {
    description: string
    starterCode: string
    expectedOutput?: string
    testCases?: Array<{
      input: string
      expected: string
    }>
  }
}

interface LessonCardProps {
  section: LessonSection
  sectionIndex: number
  totalSections: number
  onComplete: (sectionId: string) => void
  isCompleted: boolean
}

export function LessonCard({ section, sectionIndex, totalSections, onComplete, isCompleted }: LessonCardProps) {
  const [code, setCode] = useState(section.practiceExercise?.starterCode || section.codeExample || '')
  const [running, setRunning] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [result, setResult] = useState<{
    correct: boolean
    score: number
    feedback: string
    suggestions?: string[]
  } | null>(null)
  const [output, setOutput] = useState<string>('')

  const handleRun = async () => {
    if (!code) return

    setRunning(true)
    setOutput('')
    setResult(null)

    try {
      // Simulate code execution (would connect to Jaseci backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For now, just show a placeholder output
      setOutput('Code executed successfully!')
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setRunning(false)
    }
  }

  const handleCheck = async () => {
    if (!code || !section.practiceExercise) return

    setEvaluating(true)
    setResult(null)

    try {
      const evaluation = await evaluateCode(
        code,
        section.practiceExercise.expectedOutput || 'Code should execute without errors',
        section.practiceExercise.description
      )

      setResult(evaluation)

      if (evaluation.correct && evaluation.score >= 0.7) {
        onComplete(section.id)
      }
    } catch (error) {
      setResult({
        correct: false,
        score: 0,
        feedback: 'Error evaluating code. Please try again.',
        suggestions: [],
      })
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-6">
      {/* Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-sm text-gray-500">
                Section {sectionIndex + 1} of {totalSections}
              </p>
            </div>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold">Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none mb-6 text-gray-700"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />

      {/* Code Example */}
      {section.codeExample && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="text-lg font-semibold text-gray-900">Code Example</h3>
          </div>
          <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-200">
            <Editor
              height="250px"
              defaultLanguage="jac"
              value={section.codeExample}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      )}

      {/* Practice Exercise */}
      {section.practiceExercise && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="text-lg font-semibold text-gray-900">Practice Exercise</h3>
          </div>
          
          <p className="text-gray-700 mb-4">{section.practiceExercise.description}</p>

          {/* Code Editor */}
          <div className="mb-4">
            <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-200">
              <Editor
                height="300px"
                defaultLanguage="jac"
                value={code}
                onChange={(value: string | undefined) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleRun}
              disabled={running || !code}
              className="px-6 py-3 rounded-xl font-semibold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ 
                borderColor: '#FF6B35',
                color: '#FF6B35'
              }}
            >
              {running ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Code
                </>
              )}
            </button>
            <button
              onClick={handleCheck}
              disabled={evaluating || !code}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
              }}
            >
              {evaluating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Check Answer
                </>
              )}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Output:</h4>
              <pre className="text-sm text-gray-900 font-mono whitespace-pre-wrap">{output}</pre>
            </div>
          )}

          {/* Evaluation Result */}
          {result && (
            <div className={`p-4 rounded-xl border-2 ${
              result.correct 
                ? 'bg-green-50 border-green-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.correct ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-orange-600" />
                )}
                <h4 className={`font-semibold ${
                  result.correct ? 'text-green-900' : 'text-orange-900'
                }`}>
                  {result.correct ? 'Correct!' : 'Needs Improvement'}
                </h4>
                <span className="ml-auto text-sm font-semibold text-gray-700">
                  Score: {Math.round(result.score * 100)}%
                </span>
              </div>
              <p className="text-gray-700 mb-2">{result.feedback}</p>
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Suggestions:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {result.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

