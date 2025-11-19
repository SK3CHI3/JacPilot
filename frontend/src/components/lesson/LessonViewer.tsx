import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Lesson } from '../../types'
import { getLesson, recordLessonCompletion } from '../../services/jacClient'
import { lessons, supabase } from '../../services/supabase'
import { useUser } from '../../contexts/UserContext'
import { LessonCard } from './LessonCard'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

interface LessonSection {
  id: string
  title: string
  content: string
  codeExample?: string
  practiceExercise?: {
    description: string
    starterCode: string
    expectedOutput?: string
  }
}

export function LessonViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, refreshProgress } = useUser()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [sections, setSections] = useState<LessonSection[]>([])
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    loadLesson()
  }, [id])

  const loadLesson = async () => {
    if (!id) return

    setLoading(true)
    try {
      // Try Supabase first
      const { data, error } = await lessons.getById(id)
      if (!error && data) {
        const lessonData = data as any
        setLesson(lessonData)

        // Parse lesson content into sections
        const parsedSections = parseLessonContent(lessonData)
        setSections(parsedSections)
      } else {
        // Fallback to Jaseci
        const response = await getLesson(id)
        if (response.success && response.data) {
          setLesson(response.data as Lesson)
          const parsedSections = parseLessonContent(response.data as any)
          setSections(parsedSections)
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const parseLessonContent = (lessonData: any): LessonSection[] => {
    // If lesson has structured sections, use them
    if (lessonData.sections && Array.isArray(lessonData.sections)) {
      return lessonData.sections
    }

    // Otherwise, parse HTML content into sections
    const content = lessonData.content || ''
    
    // Try to split by h2/h3 headings
    const headingRegex = /<(h2|h3)[^>]*>(.*?)<\/(h2|h3)>/gi
    const matches = Array.from(content.matchAll(headingRegex)) as RegExpMatchArray[]
    
    if (matches.length > 0) {
      const sections: LessonSection[] = []
      let lastIndex = 0

      matches.forEach((match, index) => {
        const headingText = match[2] || ''
        const matchIndex = match.index || 0
        
        // Extract content before this heading
        if (matchIndex > lastIndex) {
          const sectionContent = content.substring(lastIndex, matchIndex)
          if (sectionContent.trim()) {
            sections.push({
              id: `section-${index}`,
              title: headingText,
              content: sectionContent,
            })
          }
        }

        // Extract content after this heading
        const nextMatch = matches[index + 1] as RegExpMatchArray | undefined
        const endIndex = nextMatch ? (nextMatch.index || content.length) : content.length
        const sectionContent = content.substring(matchIndex, endIndex)
        
        sections.push({
          id: `section-${index + 1}`,
          title: headingText,
          content: sectionContent,
          codeExample: extractCodeExample(sectionContent),
          practiceExercise: extractPracticeExercise(sectionContent, headingText),
        })

        lastIndex = endIndex
      })

      return sections.length > 0 ? sections : [{
        id: 'section-1',
        title: lessonData.title,
        content: content,
      }]
    }

    // Fallback: single section
    return [{
      id: 'section-1',
      title: lessonData.title,
      content: content,
      codeExample: extractCodeExample(content),
      practiceExercise: extractPracticeExercise(content, lessonData.title),
    }]
  }

  const extractCodeExample = (content: string): string | undefined => {
    const codeRegex = /<pre><code[^>]*>(.*?)<\/code><\/pre>/is
    const match = content.match(codeRegex)
    if (match) {
      return match[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    }
    return undefined
  }

  const extractPracticeExercise = (content: string, _title: string): any | undefined => {
    // Look for practice exercise markers
    if (content.toLowerCase().includes('practice') || content.toLowerCase().includes('exercise')) {
      const codeExample = extractCodeExample(content)
      if (codeExample) {
        return {
          description: `Complete the code to achieve the expected behavior.`,
          starterCode: codeExample,
          expectedOutput: 'Code should execute without errors',
        }
      }
    }
    return undefined
  }

  const handleSectionComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]))
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    if (!user || !lesson) return

    setCompleting(true)
    try {
      // Record in Supabase
      const { error: supabaseError } = await supabase
        .from('user_lesson_progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed_at: new Date().toISOString(),
          score: 1.0,
        })

      if (supabaseError) {
        console.error('Error saving to Supabase:', supabaseError)
      }

      // Also record in Jaseci for mastery tracking
      try {
        await recordLessonCompletion(user.id, lesson.id, 1.0)
      } catch (jaseciError) {
        console.error('Error recording in Jaseci:', jaseciError)
      }

      await refreshProgress()
      navigate('/dashboard')
    } catch (error) {
      console.error('Error completing lesson:', error)
    } finally {
      setCompleting(false)
    }
  }

  const allSectionsCompleted = sections.length > 0 && completedSections.size === sections.length

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6B35] border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson || sections.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Lesson not found</h2>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FF6B35] mb-4 transition-colors"
          >
            <span>←</span> Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span 
                  className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)', color: 'white' }}
                >
                  {lesson.lesson_type || 'Lesson'}
                </span>
                <span className="text-sm text-gray-500">
                  {lesson.estimated_time || 'N/A'} min
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{lesson.title}</h1>
            </div>
            {allSectionsCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">All Sections Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Progress: {completedSections.size} / {sections.length} sections
            </span>
            <span className="text-sm text-gray-500">
              Section {currentSection + 1} of {sections.length}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{ 
                width: `${(completedSections.size / sections.length) * 100}%`,
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
              }}
            />
          </div>
        </div>

        {/* Current Section Card */}
        <LessonCard
          section={sections[currentSection]}
          sectionIndex={currentSection}
          totalSections={sections.length}
          onComplete={handleSectionComplete}
          isCompleted={completedSections.has(sections[currentSection].id)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              borderColor: currentSection === 0 ? '#E5E7EB' : '#FF6B35',
              color: currentSection === 0 ? '#9CA3AF' : '#FF6B35'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
              }}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={completing || !allSectionsCompleted}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)'
              }}
            >
              {completing ? 'Completing...' : 'Complete Lesson'}
            </button>
          )}
        </div>

        {/* Section Navigation Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSection(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSection
                  ? 'bg-[#FF6B35] w-8'
                  : completedSections.has(sections[index].id)
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
