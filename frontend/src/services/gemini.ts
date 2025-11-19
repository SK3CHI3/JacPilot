/**
 * Gemini API Service for byLLM Integration
 * Handles AI-powered content generation and code evaluation
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAxHPVZfU8SaHEtN8fpBi7h8uoRNc8ukrg'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

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
      throw new Error(`Gemini API error: ${response.statusText}`)
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
  const prompt = `Generate ${numQuestions} quiz questions about Jaseci/Jac programming based on this lesson content.

Lesson Content:
${lessonContent}

Difficulty Level: ${difficulty}/5

Generate questions in JSON format:
[
  {
    "id": "q1",
    "type": "multiple_choice",
    "question": "What is a walker?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correct_answer": 0,
    "explanation": "Explanation here"
  },
  {
    "id": "q2",
    "type": "free_text",
    "question": "Explain the concept of OSP",
    "max_score": 10,
    "explanation": "Expected answer explanation"
  }
]

Include a mix of multiple choice, free text, and coding questions.`

  try {
    const response = await generateContent(prompt)
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
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


