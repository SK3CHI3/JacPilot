import { useEffect, useState } from 'react'
import { Terminal } from 'lucide-react'

function AnimatedCodeSection() {
  const [displayedCode, setDisplayedCode] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const codeExamples = [
    {
      title: 'Define a Walker',
      lines: [
        'walker learn {',
        '  has mastery: float = 0.0;',
        '  ',
        '  can start with entry {',
        '    visit [-->](`?Concept);',
        '  }',
        '}'
      ]
    },
    {
      title: 'Use byLLM',
      lines: [
        'walker quiz_generator {',
        '  can generate with `llm(model="gpt-4") {',
        '    "Generate a quiz question";',
        '  }',
        '  ',
        '  return quiz_data;',
        '}'
      ]
    },
    {
      title: 'Object-Spatial Programming',
      lines: [
        'node Concept {',
        '  has name: str;',
        '  has difficulty: int;',
        '}',
        '',
        'edge prerequisite;',
        'edge mastered;'
      ]
    }
  ]

  const [currentExample, setCurrentExample] = useState(0)
  const currentCode = codeExamples[currentExample]

  useEffect(() => {
    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    // Typing effect
    const typingSpeed = 50 // ms per character
    const lineDelay = 300 // ms between lines
    const exampleDelay = 2000 // ms before switching to next example

    const timer = setTimeout(() => {
      const lines = currentCode.lines
      
      if (currentLineIndex < lines.length) {
        const currentLine = lines[currentLineIndex]
        
        if (currentCharIndex < currentLine.length) {
          // Type next character
          setDisplayedCode(prev => prev + currentLine[currentCharIndex])
          setCurrentCharIndex(prev => prev + 1)
        } else {
          // Move to next line
          setDisplayedCode(prev => prev + '\n')
          setCurrentLineIndex(prev => prev + 1)
          setCurrentCharIndex(0)
        }
      } else {
        // Finished typing all lines, wait then switch to next example
        setTimeout(() => {
          setDisplayedCode('')
          setCurrentLineIndex(0)
          setCurrentCharIndex(0)
          setCurrentExample(prev => (prev + 1) % codeExamples.length)
        }, exampleDelay)
      }
    }, currentCharIndex === 0 && currentLineIndex > 0 ? lineDelay : typingSpeed)

    return () => clearTimeout(timer)
  }, [currentCharIndex, currentLineIndex, currentExample, currentCode])

  return (
    <section 
      className="container mx-auto px-6 py-16"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(255, 210, 63, 0.02) 100%)'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div 
          className="rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)',
            aspectRatio: '16/9'
          }}
        >
          <div className="p-12 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Terminal className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">
                  {currentCode.title}
                </h3>
                <p className="text-white/80 text-base">
                  See Jaseci in action
                </p>
              </div>
            </div>

            {/* Code Editor Window */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-inner flex-1 font-mono text-base">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-400 text-sm">example.jac</span>
              </div>
              
              <pre className="text-gray-100 whitespace-pre-wrap h-full flex items-start">
                <code className="text-lg">
                  {displayedCode}
                  <span 
                    className="inline-block w-3 h-5 bg-white ml-1 align-middle"
                    style={{ opacity: showCursor ? 1 : 0 }}
                  ></span>
                </code>
              </pre>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {codeExamples.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === currentExample ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedCodeSection

