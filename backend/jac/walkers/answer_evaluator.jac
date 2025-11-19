/**
 * Answer Evaluator Agent
 * Evaluates user answers using byLLM and updates mastery graph
 */

walker answer_evaluator {
    has question_id = "";
    has user_answer = "";
    has correct_answer = "";
    has question_context = {};
    has user_id = "";
    has quiz_id = "";
    has answers = {};
    has action = "evaluate_answer";
    
    can evaluate_answer {
        // Evaluate using byLLM
        prompt = "Evaluate this answer for correctness and quality:
                User Answer: '" + user_answer + "'
                Correct Answer: '" + correct_answer + "'
                Question Context: " + question_context.dump() + "
                
                Provide:
                1. Score (0.0 to 1.0)
                2. Correctness (true/false)
                3. Detailed feedback
                4. Strengths identified
                5. Areas for improvement
                
                Format as JSON:
                {
                    \"score\": 0.85,
                    \"correct\": true,
                    \"feedback\": \"...\",
                    \"strengths\": [\"...\"],
                    \"improvements\": [\"...\"]
                }";
        
        evaluation = byllm.analyze(
            prompt=prompt,
            model="gemini-pro"
        );
        
        return {
            "success": True,
            "score": evaluation.score,
            "correct": evaluation.correct,
            "feedback": evaluation.feedback,
            "strengths": evaluation.strengths,
            "improvements": evaluation.improvements
        };
    }
    
    can update_mastery {
        user_node = spawn here --> node::user[user_id == user_id];
        concept_node = spawn here --> node::concept[concept_id == concept_id];
        
        if (!user_node || !concept_node) {
            return {"success": False, "error": "User or concept not found"};
        }
        
        // Find or create mastery node
        masteries = spawn user_node --> node::mastery;
        mastery = null;
        
        for m in masteries {
            m_concept = spawn m --> node::concept;
            if (m_concept.concept_id == concept_id) {
                mastery = m;
                break;
            }
        }
        
        if (!mastery) {
            mastery = spawn here --> node::mastery;
            mastery.mastery_id = std.uuid();
            mastery.user_id = user_id;
            mastery.concept_id = concept_id;
            mastery.proficiency_score = 0.0;
            mastery.attempts_count = 0;
            mastery.streak = 0;
            
            // Create edges
            spawn user_node --> mastery;
            spawn mastery --> concept_node;
        }
        
        // Update mastery
        mastery.attempts_count += 1;
        old_score = mastery.proficiency_score;
        mastery.proficiency_score = (old_score * 0.7) + (score * 0.3);
        
        // Update streak
        if (score >= 0.7) {
            mastery.streak += 1;
        } else {
            mastery.streak = 0;
        }
        
        mastery.last_updated = std.time_now();
        
        return {"success": True};
    }
    
    can evaluate_quiz {
        quiz = spawn here --> node::quiz[quiz_id == quiz_id];
        user_node = spawn here --> node::user[user_id == user_id];
        
        if (!quiz || !user_node) {
            return {
                "success": False,
                "error": "Quiz or user not found"
            };
        }
        
        total_score = 0.0;
        max_score = 0.0;
        feedback_items = [];
        
        for question in quiz.questions {
            user_answer = answers[question.id];
            max_score += question.max_score;
            
            if (question.type == "multiple_choice") {
                if (user_answer == question.correct_answer) {
                    total_score += question.max_score;
                    feedback_items += {
                        "question_id": question.id,
                        "correct": True,
                        "score": question.max_score
                    };
                } else {
                    feedback_items += {
                        "question_id": question.id,
                        "correct": False,
                        "score": 0
                    };
                }
            } else if (question.type == "free_text") {
                evaluation = spawn here walker::answer_evaluator::evaluate_answer(
                    question_id=question.id,
                    user_answer=user_answer,
                    correct_answer=question.correct_answer,
                    question_context=question
                );
                question_score = evaluation.score * question.max_score;
                total_score += question_score;
                feedback_items += evaluation;
            } else if (question.type == "coding") {
                // Evaluate code (simplified - would need actual code execution)
                code_score = 0.7; // Placeholder
                total_score += code_score * question.max_score;
                feedback_items += {
                    "question_id": question.id,
                    "correct": code_score >= 0.7,
                    "score": code_score,
                    "feedback": "Code evaluation placeholder"
                };
            }
            
            // Update mastery for related concepts
            // (This would need concept-question mapping)
        }
        
        final_score = total_score / max_score if max_score > 0 else 0.0;
        
        return {
            "success": True,
            "score": final_score,
            "total_questions": quiz.questions.length,
            "feedback": feedback_items
        };
    }
    
    root {
        if (action == "evaluate_answer") {
            report = evaluate_answer();
        } else if (action == "evaluate_quiz") {
            report = evaluate_quiz();
        } else if (action == "update_mastery") {
            report = update_mastery();
        } else {
            report = {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}

