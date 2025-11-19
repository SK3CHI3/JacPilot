import { useState } from 'react'
import Editor from '@monaco-editor/react'
import type { CodeExercise, TestCase } from '../../types'
import { executeCode } from '../../services/jacClient'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

interface CodeEditorProps {
  exercise: CodeExercise
  onSubmit?: (code: string, results: TestResult[]) => void
}

interface TestResult {
  testCase: TestCase
  passed: boolean
  output?: string
  error?: string
}

export function CodeEditor({ exercise, onSubmit }: CodeEditorProps) {
  const [code, setCode] = useState(exercise.starter_code)
  const [running, setRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [output, setOutput] = useState<string>('')

  const handleRun = async () => {
    if (!code) return

    setRunning(true)
    setOutput('')
    setTestResults([])

    try {
      // Execute code via Jaseci backend
      const response = await executeCode(code, exercise.id)

      if (response.success && response.data) {
        const results = response.data as any
        
        // Process test results
        const processedResults: TestResult[] = exercise.test_cases.map((testCase, index) => {
          const result = results.test_results?.[index] || results
          return {
            testCase,
            passed: result.passed || result.output === testCase.expected_output,
            output: result.output,
            error: result.error,
          }
        })

        setTestResults(processedResults)
        setOutput(results.output || '')
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(code || '', testResults)
    }
  }

  const passedCount = testResults.filter((r) => r.passed).length
  const allPassed = testResults.length > 0 && passedCount === testResults.length

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
        <p className="text-gray-400 mb-4">{exercise.instructions}</p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Difficulty: {exercise.difficulty}/5</span>
          <span>•</span>
          <span>{exercise.test_cases.length} test cases</span>
        </div>
      </Card>

      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Code Editor</h3>
          <div className="border border-dark-border rounded-lg overflow-hidden">
            <Editor
              height="400px"
              defaultLanguage="javascript"
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

        <div className="flex gap-4">
          <Button onClick={handleRun} disabled={running || !code}>
            {running ? 'Running...' : 'Run Code'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={!allPassed || running}
          >
            Submit Solution
          </Button>
        </div>
      </Card>

      {output && (
        <Card>
          <h3 className="text-lg font-semibold mb-2">Output</h3>
          <pre className="bg-dark-border p-4 rounded-lg text-sm font-mono overflow-x-auto">
            {output}
          </pre>
        </Card>
      )}

      {testResults.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            Test Results ({passedCount}/{testResults.length} passed)
          </h3>
          <div className="space-y-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.passed
                    ? 'border-green-primary bg-green-primary/10'
                    : 'border-red-500 bg-red-500/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={result.passed ? 'text-green-primary' : 'text-red-500'}>
                    {result.passed ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold">
                    Test Case {index + 1}
                  </span>
                </div>
                {result.testCase.description && (
                  <p className="text-sm text-gray-400 mb-2">
                    {result.testCase.description}
                  </p>
                )}
                {result.output && (
                  <div className="text-sm">
                    <span className="text-gray-400">Output: </span>
                    <code className="text-white">{result.output}</code>
                  </div>
                )}
                {result.error && (
                  <div className="text-sm text-red-400 mt-2">
                    Error: {result.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

