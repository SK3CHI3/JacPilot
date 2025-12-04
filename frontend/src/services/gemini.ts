/**
 * Gemini API Service for byLLM Integration
 * Handles AI-powered content generation and code evaluation
 */

// Get Gemini API key from environment variables
// Set VITE_GEMINI_API_KEY in your .env file
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
// Use v1beta API with gemini-2.5-flash model
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
// Use gemini_proxy for quiz generation (handles the correct model and API version)
const GEMINI_PROXY_URL = 'http://localhost:8001'

if (!GEMINI_API_KEY) {
  console.warn('⚠️  VITE_GEMINI_API_KEY not set in .env file. Gemini features will not work.')
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string
    }>
  }>
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

/**
 * Generate content using Gemini
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Gemini API error (${response.status}): ${errorText}`)
    }

    const data: GeminiResponse = await response.json()
    return data.candidates[0]?.content?.parts[0]?.text || ''
  } catch (error) {
    console.error('Error calling Gemini API:', error)
    throw error
  }
}

/**
 * Evaluate code correctness using Gemini
 */
export async function evaluateCode(
  userCode: string,
  expectedBehavior: string,
  context?: string
): Promise<{
  correct: boolean
  score: number
  feedback: string
  suggestions?: string[]
}> {
  const prompt = `You are a code evaluator for Jaseci/Jac programming language.

${context ? `Context: ${context}\n\n` : ''}
Expected Behavior: ${expectedBehavior}

User's Code:
\`\`\`jac
${userCode}
\`\`\`

Evaluate this code and provide:
1. Is the code correct? (true/false)
2. Score (0.0 to 1.0)
3. Detailed feedback
4. Suggestions for improvement (if any)

Respond in JSON format:
{
  "correct": true/false,
  "score": 0.0-1.0,
  "feedback": "detailed feedback",
  "suggestions": ["suggestion1", "suggestion2"]
}`

  try {
    const response = await generateContent(prompt)
    
    // Try to parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        correct: parsed.correct || false,
        score: parsed.score || 0,
        feedback: parsed.feedback || 'No feedback provided',
        suggestions: parsed.suggestions || [],
      }
    }

    // Fallback if JSON parsing fails
    return {
      correct: response.toLowerCase().includes('correct') || response.toLowerCase().includes('true'),
      score: 0.5,
      feedback: response,
      suggestions: [],
    }
  } catch (error) {
    console.error('Error evaluating code:', error)
    return {
      correct: false,
      score: 0,
      feedback: 'Error evaluating code. Please try again.',
      suggestions: [],
    }
  }
}

/**
 * Generate quiz questions using Gemini
 */
export async function generateQuizQuestions(
  lessonContent: string,
  difficulty: number,
  numQuestions: number = 5
): Promise<any[]> {
  // Quiz generation is handled by gemini_proxy which uses byLLM
  try {
    // Call gemini_proxy instead of Gemini API directly
    const response = await fetch(`${GEMINI_PROXY_URL}/generate_quiz_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lesson_content: lessonContent,
        difficulty: difficulty || 2,
        num_questions: numQuestions || 8,
        topics: []
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini proxy error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.questions || []
  } catch (error) {
    console.error('Error generating quiz:', error)
    return []
  }
}

/**
 * Generate code explanation using Gemini
 */
export async function explainCode(code: string, language: string = 'jac'): Promise<string> {
  const prompt = `Explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide a clear, educational explanation suitable for learners.`

  try {
    return await generateContent(prompt)
  } catch (error) {
    console.error('Error explaining code:', error)
    return 'Unable to generate explanation.'
  }
}


