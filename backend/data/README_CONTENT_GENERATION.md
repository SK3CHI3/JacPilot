# Lesson Content Generation

This directory contains scripts to generate comprehensive lesson content using Gemini AI, with instructions to reference official Jaseci/Jac documentation.

## 📋 Prerequisites

1. **Gemini API Key**: Set environment variable
   ```bash
   export GEMINI_API_KEY=your_api_key_here
   # Or on Windows:
   set GEMINI_API_KEY=your_api_key_here
   ```

2. **Python Dependencies**:
   ```bash
   pip install requests
   ```

## 🚀 Usage

### Step 1: Generate Content

Run the content generation script:

```bash
cd backend/data
python generate_lesson_content.py
```

This will:
- Generate comprehensive HTML content for all 48 lessons
- Reference official Jaseci/Jac documentation (https://docs.jaseci.org)
- Create working Jac code examples
- Generate practice exercises with test cases
- Output SQL files for easy database loading

**Output Files:**
- `generated_lesson_content.sql` - SQL UPDATE statements for lessons
- `generated_exercises.json` - Exercises data in JSON format

### Step 2: Convert Exercises to SQL

```bash
python convert_exercises_to_sql.py
```

This converts the JSON exercises to SQL INSERT statements.

**Output File:**
- `generated_exercises.sql` - SQL INSERT statements for exercises

### Step 3: Load to Database

Run the generated SQL files in your Supabase SQL Editor:

```sql
-- Load lesson content
\i generated_lesson_content.sql

-- Load exercises
\i generated_exercises.sql
```

Or copy/paste the SQL into Supabase SQL Editor.

## 📝 How It Works

### Content Generation
The script uses Gemini AI with specific prompts that:
1. **Reference Official Docs**: All prompts include links to official Jaseci/Jac documentation
2. **Verify Syntax**: Instructions to ensure all code is syntactically correct
3. **Generate Rich Content**: Creates detailed HTML with:
   - Clear introductions
   - Learning objectives
   - Detailed explanations
   - Working code examples
   - Practice exercises
   - Next steps

### Exercise Generation
Each lesson gets a practice exercise with:
- Clear instructions
- Starter code template
- Test cases (2-3 per exercise)
- Difficulty level (1-5)
- Optional hints

## ⚙️ Configuration

### Rate Limiting
The script includes a 2-second delay between API calls to avoid rate limits. Adjust in `generate_lesson_content.py`:

```python
time.sleep(2)  # Adjust as needed
```

### Temperature Settings
- **Lesson Content**: `temperature=0.7` (creative but accurate)
- **Exercises**: `temperature=0.5` (more structured)

## 📊 Generated Content Quality

All generated content:
- ✅ References official Jaseci/Jac documentation
- ✅ Uses accurate syntax per official docs
- ✅ Includes working code examples
- ✅ Provides clear explanations
- ✅ Follows progressive learning structure

## 🔍 Review Process

**Recommended Workflow:**
1. Generate all content (automated)
2. Review first 12 lessons (core fundamentals) manually
3. Test code examples in Jac
4. Verify exercises work correctly
5. Load to database

## 🐛 Troubleshooting

### API Key Issues
```
ERROR: GEMINI_API_KEY environment variable not set!
```
**Solution**: Set the environment variable with your Gemini API key.

### Rate Limiting
If you hit rate limits, increase the `time.sleep()` delay in the script.

### Invalid JSON in Exercises
If exercise JSON parsing fails, the script falls back to default exercises. Review the console output for errors.

## 📚 Official Documentation

All generated content references:
- **Jaseci Docs**: https://docs.jaseci.org
- **Jac Language Reference**: https://docs.jaseci.org/jac/
- **GitHub**: https://github.com/Jaseci-Labs/jaseci

## 📝 Notes

- Content generation takes ~2-3 hours for all 48 lessons (with rate limiting)
- Generated content should be reviewed, especially for core lessons (1-12)
- Code examples are tested for syntax but should be verified in actual Jac environment
- Exercises include test cases but may need refinement based on actual execution

