import { useState, lazy, Suspense } from 'react'
import { Play, CheckCircle2, XCircle, Loader, Code2, BookOpen, Sparkles } from 'lucide-react'
import { evaluateCode } from '../../services/gemini'

// Lazy load Monaco Editor to avoid hook issues
const Editor = lazy(() => import('@monaco-editor/react')) as any

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
    <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-200 mb-8 hover:shadow-3xl transition-shadow duration-300">
      {/* Section Header - Professional Design */}
      <div className="mb-8 pb-6 border-b-2 border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl shadow-lg"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                {isCompleted && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">Done</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4" />
                <span>Section {sectionIndex + 1} of {totalSections}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Professional formatted */}
      <div className="mb-8">
        <div 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif'
          }}
          dangerouslySetInnerHTML={{ 
            __html: (section.content || '')
              .replace(/<h2[^>]*>/gi, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-3 border-b-2 border-gray-200">')
              .replace(/<\/h2>/gi, '</h2>')
              .replace(/<h3[^>]*>/gi, '<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-3 flex items-center gap-2"><span class="w-2 h-2 bg-[#FF6B35] rounded-full"></span>')
              .replace(/<\/h3>/gi, '</h3>')
              .replace(/<p[^>]*>/gi, '<p class="mb-4 text-gray-700 leading-7 text-base">')
              .replace(/<\/p>/gi, '</p>')
              .replace(/<ul[^>]*>/gi, '<ul class="list-disc list-inside mb-4 space-y-2 text-gray-700 ml-4">')
              .replace(/<\/ul>/gi, '</ul>')
              .replace(/<ol[^>]*>/gi, '<ol class="list-decimal list-inside mb-4 space-y-2 text-gray-700 ml-4">')
              .replace(/<\/ol>/gi, '</ol>')
              .replace(/<li[^>]*>/gi, '<li class="leading-7 mb-1">')
              .replace(/<\/li>/gi, '</li>')
              .replace(/<code[^>]*>/gi, '<code class="bg-gray-100 text-[#FF6B35] px-2 py-1 rounded text-sm font-mono border border-gray-200">')
              .replace(/<\/code>/gi, '</code>')
              .replace(/<pre[^>]*>/gi, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 border-2 border-gray-800 shadow-inner"><code class="text-gray-100">')
              .replace(/<\/pre>/gi, '</code></pre>')
              .replace(/<strong[^>]*>/gi, '<strong class="font-bold text-gray-900">')
              .replace(/<\/strong>/gi, '</strong>')
              .replace(/<em[^>]*>/gi, '<em class="italic text-gray-800">')
              .replace(/<\/em>/gi, '</em>')
          }}
        />
      </div>

      {/* Code Example */}
      {section.codeExample && (
        <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#FF6B35] rounded-lg">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Code Example</h3>
              <p className="text-sm text-gray-600">Try running this code to see how it works</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-800 shadow-xl">
            <Suspense fallback={
              <div className="h-[250px] flex items-center justify-center bg-gray-900 text-gray-400">
                <Loader className="w-6 h-6 animate-spin" />
              </div>
            }>
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
                } as any}
              />
            </Suspense>
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
            <div className="bg-gray-900 rounded-xl overflow-hidden border-2 border-gray-800 shadow-xl">
              <Suspense fallback={
                <div className="h-[300px] flex items-center justify-center bg-gray-900 text-gray-400">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              }>
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
                  } as any}
                />
              </Suspense>
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

