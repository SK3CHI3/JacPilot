# byLLM Configuration Guide

## Overview

This document explains how byLLM is properly configured in JacPilot according to the official jaclang documentation.

## Official Configuration (from jac-lang.org)

According to the official jaclang documentation, byLLM should be configured as follows:

### 1. Import byLLM Model

```jac
import from byllm.lib { Model }
```

### 2. Initialize Global LLM Instance

```jac
# Model name format: "gemini/model-name" for LiteLLM
glob llm = Model(model_name="gemini/gemini-2.5-flash");
```

### 3. Define Functions Using byLLM

Functions that use byLLM should use the `by llm()` syntax:

```jac
def generate_quiz_content(prompt: str) -> str by llm();
def evaluate_answer_content(prompt: str) -> str by llm();
```

### 4. Call the Functions

```jac
quiz_response = generate_quiz_content(prompt=prompt);
evaluation_response = evaluate_answer_content(prompt=prompt);
```

## Current Implementation

### Location: `backend/jac/main.jac`

1. **Import and Initialization** (lines 1-10):
   ```jac
   import from byllm.lib { Model }
   glob llm = Model(model_name="gemini/gemini-2.5-flash");
   ```

2. **Function Definitions** (before walkers):
   ```jac
   def generate_quiz_content(prompt: str) -> str by llm();
   def evaluate_answer_content(prompt: str) -> str by llm();
   ```

3. **Usage in Walkers**:
   - `quiz_generator` walker calls `generate_quiz_content()`
   - `answer_evaluator` walker calls `evaluate_answer_content()`

## Environment Variables

byLLM uses environment variables for API keys:

- **Gemini API Key**: Set `GEMINI_API_KEY` environment variable
- The Model will automatically use the API key from the environment

## API Key Setup

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set it as an environment variable:
   ```bash
   # Windows
   set GEMINI_API_KEY=your_api_key_here
   
   # Linux/Mac
   export GEMINI_API_KEY=your_api_key_here
   ```

## Response Format

byLLM functions return strings. You need to parse JSON responses:

```jac
# Example parsing (requires JSON module)
quiz_data = json.loads(quiz_response);
questions = quiz_data.get("questions", []);
```

## Response Handling

byLLM returns strings that may be wrapped in markdown code blocks. The frontend parses these:

```typescript
// Remove markdown code block wrappers if present
if (rawResponse.includes('```json')) {
  rawResponse = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '')
}
const parsed = JSON.parse(rawResponse.trim())
```

## Troubleshooting

1. **Import Error**: Make sure `byllm` is installed: `pip install byllm`
2. **API Key Error**: Set `GEMINI_API_KEY` environment variable
3. **Model Not Found**: Check that `gemini-pro` is a valid model name for your API key
4. **Response Parsing**: byLLM returns strings, so you need to parse JSON manually

## References

- [Official jaclang byLLM Documentation](https://www.jac-lang.org/learn/jac-mtllm/usage/)
- [Creating Custom LLM Models](https://www.jac-lang.org/learn/jac-mtllm/create_own_lm/)

