/**
 * Quiz Generator Agent
 * Creates adaptive quizzes using byLLM based on lesson content
 */

walker quiz_generator {
    has lesson_id;
    has user_id;
    
    can generate_quiz {
        // Get lesson
        lesson = spawn here --> node::lesson[lesson_id == lesson_id];
        
        if (!lesson) {
            return {
                "success": False,
                "error": "Lesson not found"
            };
        }
        
        // Get concepts covered by lesson
        concepts = spawn lesson --> node::concept;
        concept_names = [];
        for concept in concepts {
            concept_names += concept.name;
        }
        
        // Get user's mastery for related concepts
        user_node = spawn here --> node::user[user_id == user_id];
        avg_mastery = 0.0;
        mastery_count = 0;
        
        if (user_node) {
            masteries = spawn user_node --> node::mastery;
            for concept in concepts {
                for mastery in masteries {
                    mastery_concept = spawn mastery --> node::concept;
                    if (mastery_concept.concept_id == concept.concept_id) {
                        avg_mastery += mastery.proficiency_score;
                        mastery_count += 1;
                        break;
                    }
                }
            }
        }
        
        if (mastery_count > 0) {
            avg_mastery = avg_mastery / mastery_count;
        }
        
        // Determine difficulty (1-5)
        if (avg_mastery < 0.3) {
            difficulty = 1;
        } else if (avg_mastery < 0.6) {
            difficulty = 2;
        } else if (avg_mastery < 0.8) {
            difficulty = 3;
        } else {
            difficulty = 4;
        }
        
        /**
         * ============================================================
         * byLLM PROMPT DOCUMENTATION - Quiz Generation (Generative)
         * ============================================================
         * Role: Content Generator
         * Model: gemini-pro
         * Temperature: 0.7 (balanced creativity/consistency)
         * Type: Generative AI - Creates quiz questions from lesson content
         * 
         * Prompt Structure:
         * 1. Context: Lesson title, content, topics covered
         * 2. Difficulty: Adaptive based on user mastery (1-4 scale)
         *    - Level 1: Beginner (mastery < 0.3)
         *    - Level 2: Intermediate (mastery 0.3-0.6)
         *    - Level 3: Advanced (mastery 0.6-0.8)
         *    - Level 4: Expert (mastery >= 0.8)
         * 3. Requirements: Question types and count
         *    - 5 multiple choice questions
         *    - 2 free-text questions
         *    - 1 coding exercise
         * 4. Format: JSON structure specification
         * 
         * Expected Output: JSON with questions array containing:
         *   - Multiple choice: id, type, question, options[], correct_answer, explanation
         *   - Free text: id, type, question, max_score, explanation
         *   - Coding: id, type, question, starter_code, test_cases[]
         * 
         * Use Case: Adaptive quiz generation based on user's current mastery level
         * ============================================================
         */
        
        // Generate quiz using byLLM
        prompt = "Generate a " + difficulty + " level quiz about Jaseci/Jac programming.
                Lesson Title: " + lesson.title + "
                Lesson Content: " + lesson.content + "
                Topics: " + concept_names.join(", ") + "
                
                Include:
                - 5 multiple choice questions
                - 2 free-text questions
                - 1 coding exercise
                
                Format as JSON with this structure:
                {
                    \"questions\": [
                        {
                            \"id\": \"q1\",
                            \"type\": \"multiple_choice\",
                            \"question\": \"...\",
                            \"options\": [\"...\", \"...\", \"...\", \"...\"],
                            \"correct_answer\": 0,
                            \"explanation\": \"...\"
                        },
                        {
                            \"id\": \"q2\",
                            \"type\": \"free_text\",
                            \"question\": \"...\",
                            \"max_score\": 10,
                            \"explanation\": \"...\"
                        },
                        {
                            \"id\": \"q3\",
                            \"type\": \"coding\",
                            \"question\": \"...\",
                            \"starter_code\": \"...\",
                            \"test_cases\": [...]
                        }
                    ]
                }";
        
        // Use byLLM to generate quiz (using Gemini)
        quiz_data = byllm.generate(
            prompt=prompt,
            model="gemini-pro",
            temperature=0.7
        );
        
        // Create quiz node
        quiz = spawn here --> node::quiz;
        quiz.quiz_id = std.uuid();
        quiz.lesson_id = lesson_id;
        quiz.difficulty = difficulty;
        quiz.questions = quiz_data.questions;
        quiz.created_at = std.time_now();
        
        return {
            "success": True,
            "quiz_id": quiz.quiz_id,
            "difficulty": difficulty,
            "questions": quiz_data.questions
        };
    }
    
    root {
        report = generate_quiz();
    }
}

