import { lazy, Suspense } from 'react'
import { Loader } from 'lucide-react'

// Lazy load Monaco Editor to avoid hook conflicts
const MonacoEditor = lazy(() => 
  import('@monaco-editor/react').then(module => ({
    default: module.default
  }))
) as any

interface MonacoEditorWrapperProps {
  height?: string
  value: string
  onChange?: (value: string | undefined) => void
  language?: string
  readOnly?: boolean
  options?: any
}

export function MonacoEditorWrapper({
  height = '300px',
  value,
  onChange,
  language = 'jac',
  readOnly = false,
  options = {},
}: MonacoEditorWrapperProps) {
  return (
    <Suspense
      fallback={
        <div 
          className="flex items-center justify-center bg-gray-900 text-gray-400"
          style={{ height }}
        >
          <Loader className="w-6 h-6 animate-spin" />
          <span className="ml-3">Loading editor...</span>
        </div>
      }
    >
      <MonacoEditor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly,
          ...options,
        }}
      />
    </Suspense>
  )
}

