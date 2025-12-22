# ============================================================
# byLLM Configuration for Gemini
# ============================================================
# Using byLLM with LiteLLM for Gemini integration
# Requires GEMINI_API_KEY environment variable to be set
import from byllm.lib { Model }

# Initialize global LLM instance for Gemini
# Model name format: "gemini/model-name" for LiteLLM
glob llm = Model(model_name="gemini/gemini-2.5-flash");

# ============================================================
# byLLM Function Definitions (Generative & Analytical)
# ============================================================

# Generative AI: Quiz Content Generation
# Role: Content Generator - Creates quiz questions from lesson content
def generate_quiz_content(prompt: str) -> str by llm();

# Analytical AI: Answer Evaluation  
# Role: Answer Analyzer - Evaluates correctness and provides feedback
def evaluate_answer_content(prompt: str) -> str by llm();

node user {
    has user_id: str;
    has email: str;
    has name: str;
    has total_lessons_completed: int = 0;
    has average_quiz_score: float = 0.0;
    has level: int = 1;
}

node concept {
    has concept_id: str;
    has name: str;
    has description: str = "";
    has difficulty_level: int = 1;
    has category: str = "";
}

node lesson {
    has lesson_id: str;
    has title: str;
    has content: str = "";
    has order: int = 0;
    has estimated_time: int = 0;
    has lesson_type: str = "theory";
}

node mastery {
    has mastery_id: str;
    has user_id: str;
    has concept_id: str;
    has last_updated: str = "";
    has proficiency_score: float = 0.0;
    has attempts_count: int = 0;
    has streak: int = 0;
}

node quiz {
    has quiz_id: str;
    has lesson_id: str;
    has difficulty: int = 1;
    has questions: list = [];
    has created_at: str = "";
}

walker learning_planner {
    has user_id: str;
    has action: str = "plan_next_lesson";

    can entry with entry {
        if (self.action == "plan_next_lesson") {
            # Query Supabase for user's completed lessons using Python helper
            # Note: HTTP calls temporarily disabled - using placeholders
            # TODO: Implement Python helper module integration
            progress_response = None;
            
            completed_lesson_ids = [];
            if (progress_response != None && progress_response.get("status_code") == 200) {
                progress_data = progress_response.get("body");
                if (progress_data != None && hasattr(progress_data, "__iter__")) {
                    for progress in progress_data {
                        if (hasattr(progress, "get")) {
                            lesson_id_val = progress.get("lesson_id", "");
                            if (lesson_id_val) {
                                completed_lesson_ids += lesson_id_val;
                            }
                        }
                    }
                }
            }
            
            # Get all lessons ordered by order_index
            # TODO: HTTP calls disabled - using placeholder
            lessons_response = None;
            
            # Adaptive learning logic: Check prerequisites and mastery
            # In production, this would:
            # 1. Traverse OSP graph: user -> mastery -> concept
            # 2. Check prerequisite edges: concept -> concept
            # 3. Find lessons covering concepts with met prerequisites
            # 4. Use byLLM to recommend personalized next lesson
            
            # For now, use intelligent defaults based on completed lessons
            user_id_val = self.user_id if hasattr(self, "user_id") else "";
            
            # Determine next lesson based on progress
            if (len(completed_lesson_ids) == 0) {
                # First lesson - no prerequisites
                next_lesson_id = "lesson-1";
                next_title = "Introduction to Jaseci & Jac";
                next_estimated_time = 15;
                reason = "Starting your learning journey";
            } elif (len(completed_lesson_ids) < 5) {
                # Early lessons - continue sequence
                next_lesson_id = "lesson-" + str(len(completed_lesson_ids) + 1);
                next_title = "Jaseci Core Concepts";
                next_estimated_time = 20;
                reason = "Building on your progress";
            } else {
                # Advanced - suggest based on mastery
                next_lesson_id = "lesson-" + str(len(completed_lesson_ids) + 1);
                next_title = "Advanced Jaseci Topics";
                next_estimated_time = 30;
                reason = "Ready for advanced concepts";
            }
            
            # Use byLLM to generate personalized recommendation message
            recommendation_prompt = f"User has completed {len(completed_lesson_ids)} lessons. Suggest what they should learn next in Jaseci programming (1 sentence).";
            try {
                ai_recommendation = evaluate_answer_content(recommendation_prompt);
                if (ai_recommendation) {
                    reason = str(ai_recommendation).strip();
                    # Clean up if wrapped in quotes or JSON
                    if (reason.startswith('"') and reason.endswith('"')) {
                        reason = reason[1:-1];
                    }
                }
            } catch {
                # Fallback to default reason if byLLM fails
            }
            
            report {
                "success": True,
                "lesson_id": next_lesson_id if next_lesson_id else "lesson-1",
                "title": next_title,
                "reason": reason,
                "estimated_time": next_estimated_time,
                "completed_count": len(completed_lesson_ids)
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + self.action
            };
        }
    }
}

# Quiz generator walker uses generate_quiz_content() defined above

walker quiz_generator {
    has lesson_id: str = "";
    has user_id: str = "";
    has lesson_content: str = "";
    has lesson_title: str = "";
    has concepts: list = [];

    can entry with entry {
        # Pull instance fields with safe fallbacks
        lesson_id_val = self.lesson_id if hasattr(self, "lesson_id") else "";
        user_id_val = self.user_id if hasattr(self, "user_id") else "";
        lesson_title_val = self.lesson_title if hasattr(self, "lesson_title") else "";
        lesson_content_val = self.lesson_content if hasattr(self, "lesson_content") else "";
        
        # Use instance concepts safely
        concepts_list = self.concepts if hasattr(self, "concepts") else [];
        
        # Calculate adaptive difficulty based on user mastery
        # Default to medium difficulty
        difficulty = 2;
        avg_proficiency = 0.5;
        
        # Try to calculate average proficiency for lesson concepts
        # In production, this would query mastery nodes from OSP graph
        # For now, we use a simplified approach that can be enhanced
        if (user_id_val != "" && concepts_list != None && len(concepts_list) > 0) {
            # Count concepts to determine base difficulty
            concept_count = len(concepts_list);
            # More concepts = slightly harder
            if (concept_count > 5) {
                difficulty = 3;
            } elif (concept_count > 3) {
                difficulty = 2;
            } else {
                difficulty = 1;
            }
        }
        
        # Build topics list for byLLM
        topics_list = [];
        # Handle concepts safely - check if it's a valid list before iterating
        if (concepts_list != None && concepts_list != [] && hasattr(concepts_list, "__iter__")) {
            for concept in concepts_list {
                if (hasattr(concept, "get")) {
                    topics_list += concept.get("name", "");
                } else {
                    topics_list += str(concept);
                }
            }
        }
        
        # ============================================================
        # byLLM PROMPT DOCUMENTATION - Quiz Generation (Generative)
        # ============================================================
        # Role: Content Generator
        # Model: gemini/gemini-2.5-flash (via byLLM)
        # Type: Generative AI - Creates quiz questions from lesson content
        #
        # Prompt Structure:
        # 1. Context: Lesson title, content, topics
        # 2. Difficulty: Adaptive based on user mastery (1-4)
        # 3. Requirements: Question types and count
        # 4. Format: JSON structure specification
        #
        # Expected Output: JSON with questions array containing:
        #   - Multiple choice: id, type, question, options[], correct_answer_index, explanation
        # ============================================================
        
        # Build prompt for byLLM
        topics_str = ", ".join(topics_list) if topics_list else "Jaseci programming concepts";
        lesson_title_str = lesson_title_val if lesson_title_val else "Jaseci Concepts";
        lesson_content_str = lesson_content_val if lesson_content_val else "Jaseci programming concepts";
        
        prompt = "Generate a difficulty level " + str(difficulty) + " quiz about Jaseci and Jac programming. Lesson Title: " + lesson_title_str + ". Topics: " + topics_str + ". Create 5 multiple choice questions. Return valid JSON with questions array where each has id, type, question, options array, correct_answer_index number, and explanation.";
        
        # Use byLLM to generate quiz (generative use - Hackathon requirement)
        quiz_response = generate_quiz_content(prompt);
        
        # Return quiz data with byLLM response (frontend will parse questions from raw_response)
        report {
            "success": True,
            "quiz_id": "quiz-" + lesson_id_val + "-" + user_id_val,
            "difficulty": difficulty,
            "raw_response": str(quiz_response) if quiz_response else "{}"
        };
    }
}

# Answer evaluator walker uses evaluate_answer_content() defined above

walker answer_evaluator {
    has question_id: str = "";
    has user_answer: str = "";
    has correct_answer: str = "";
    has user_id: str = "";
    has quiz_id: str = "";
    has answers: dict = {};
    has questions: list = [];
    has question_context: dict = {};
    has question_type: str = "free_text";
    has action: str = "evaluate_answer";

    can entry with entry {
        if (self.action == "evaluate_answer") {
            # ============================================================
            # byLLM PROMPT DOCUMENTATION - Answer Evaluation (Analytical)
            # ============================================================
            # Role: Answer Analyzer & Feedback Generator
            # Model: gemini/gemini-2.5-flash (via byLLM)
            # Type: Analytical AI - Evaluates correctness and provides feedback
            # ============================================================
            
            # Build prompt for byLLM (analytical use - Hackathon requirement)
            context_str = str(self.question_context) if hasattr(self, "question_context") else "{}";
            prompt = "Evaluate this answer. User Answer: " + self.user_answer + ". Correct Answer: " + self.correct_answer + ". Return valid JSON with score 0 to 1, correct boolean, feedback string, strengths array, and improvements array.";
            
            # Use byLLM to evaluate answer (analytical use - Hackathon requirement)
            evaluation_response = evaluate_answer_content(prompt);
            
            # Return raw response - frontend will parse JSON
            report {
                "success": True,
                "score": 0.5,
                "correct": False,
                "feedback": "Evaluation completed via byLLM",
                "strengths": [],
                "improvements": [],
                "raw_response": str(evaluation_response) if evaluation_response else "{}"
            };
        } elif (self.action == "evaluate_quiz") {
            # Evaluate entire quiz - check each answer
            user_answers = self.answers if hasattr(self, "answers") else {};
            quiz_questions = self.questions if hasattr(self, "questions") else [];
            
            total_questions = len(quiz_questions);
            correct_count = 0;
            results = [];
            
            # Evaluate each question
            for q in quiz_questions {
                question_id = str(q.get("id", ""));
                user_ans = user_answers.get(question_id, "");
                correct_ans = q.get("correct_answer", 0);
                
                # Check if answer is correct
                is_correct = False;
                if (str(user_ans) == str(correct_ans)) {
                    is_correct = True;
                    correct_count += 1;
                }
                
                results.append({
                    "question_id": question_id,
                    "user_answer": user_ans,
                    "correct_answer": correct_ans,
                    "is_correct": is_correct,
                    "question": q.get("question", "")
                });
            }
            
            # Calculate final score
            final_score = correct_count / total_questions if total_questions > 0 else 0;
            
            # Detect if revision is needed (score < 70%)
            needs_revision = final_score < 0.7;
            weak_concepts = [];
            
            # Generate detailed AI feedback based on performance
            wrong_questions = [];
            for result in results {
                if (not result.get("is_correct", False)) {
                    wrong_questions.append(result.get("question", ""));
                    # Extract concept from question if available
                    question_text = result.get("question", "");
                    if (question_text != "") {
                        weak_concepts.append(question_text);
                    }
                }
            }
            
            # Build detailed prompt for AI feedback
            if (len(wrong_questions) > 0) {
                questions_str = ", ".join(wrong_questions);
                feedback_prompt = f"The student scored {correct_count}/{total_questions} on a Jaseci programming quiz. They got these questions wrong: {questions_str}. Provide specific, actionable feedback (2-3 sentences) on what concepts they should review and how to improve. Be encouraging but specific.";
            } else {
                feedback_prompt = f"The student scored perfectly {correct_count}/{total_questions} on a Jaseci programming quiz! Provide enthusiastic congratulations and suggest what advanced topic they should explore next (2 sentences).";
            }
            
            ai_feedback = evaluate_answer_content(feedback_prompt);
            feedback_text = str(ai_feedback) if ai_feedback else "Great effort! Keep learning!";
            
            # Clean up feedback if it has markdown or JSON wrapper
            if ("```" in feedback_text) {
                feedback_text = feedback_text.replace("```json", "").replace("```", "").strip();
            }
            # Remove quotes if AI wrapped response in JSON
            if (feedback_text.startswith('"') and feedback_text.endswith('"')) {
                feedback_text = feedback_text[1:-1];
            }
            
            report {
                "success": True,
                "score": final_score,
                "total_questions": total_questions,
                "correct_answers": correct_count,
                "results": results,
                "feedback": feedback_text,
                "needs_revision": needs_revision,
                "weak_concepts": weak_concepts
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + self.action
            };
        }
    }
}

walker progress_tracker {
    has user_id: str;
    has action: str = "get_progress_summary";

    can entry with entry {
        if (self.action == "get_progress_summary") {
            # Query Supabase for real progress data
            lessons_completed = 0;
            average_quiz_score = 0.0;
            mastered_concepts = 0;
            total_hours = 0;
            current_streak = 0;
            
            # Get lesson progress from Supabase
            # TODO: HTTP calls disabled - need Python requests
            # progress_response = requests.get(...)
            progress_response = None;
            progress_data = None;
            # if (progress_response != None && progress_response.status_code == 200) {
            #     progress_data = progress_response.json();
            #     if (progress_data != None && hasattr(progress_data, "__len__") && len(progress_data) > 0) {
            #         lessons_completed = len(progress_data);
            #         # Calculate average score
            #         total_score = 0.0;
            #         for progress in progress_data {
            #             if (hasattr(progress, "score")) {
            #                 total_score += progress.score;
            #             }
            #         }
            #         if (lessons_completed > 0) {
            #             average_quiz_score = total_score / lessons_completed;
            #         }
            #     }
            # }
            
            # Get quiz attempts
            # TODO: HTTP calls disabled - need Python requests
            # quiz_response = requests.get(...)
            # quiz_data = None;
            # if (quiz_response != None && quiz_response.status_code == 200) {
            #     quiz_data = quiz_response.json();
            #     if (quiz_data != None && hasattr(quiz_data, "__len__") && len(quiz_data) > 0) {
            #         quiz_total = 0.0;
            #         quiz_count = 0;
            #         for attempt in quiz_data {
            #             if (hasattr(attempt, "score")) {
            #                 quiz_total += attempt.score;
            #                 quiz_count += 1;
            #             }
            #         }
            #         if (quiz_count > 0) {
            #             quiz_avg = quiz_total / quiz_count;
            #             # Average between lesson and quiz scores
            #             if (average_quiz_score > 0) {
            #                 average_quiz_score = (average_quiz_score + quiz_avg) / 2.0;
            #             } else {
            #                 average_quiz_score = quiz_avg;
            #             }
            #         }
            #     }
            # }
            
            # Estimate total hours (15 min per lesson average)
            total_hours = (lessons_completed * 15) / 60.0;
            
            report {
                "success": True,
                "lessons_completed": lessons_completed,
                "average_quiz_score": average_quiz_score,
                "mastered_concepts": mastered_concepts,
                "total_hours": total_hours,
                "current_streak": current_streak
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + self.action
            };
        }
    }
}

walker skill_analyzer {
    has user_id: str;
    has action: str = "generate_skill_map";

    can entry with entry {
        if (self.action == "generate_skill_map") {
            # Query Supabase for concepts
            # TODO: HTTP calls disabled - need Python requests
            # concepts_response = requests.get(...)
            # mastery_response = requests.get(...)
            concepts_response = None;
            mastery_response = None;
            
            nodes = [];
            edges = [];
            mastered = 0;
            in_progress = 0;
            not_started = 0;
            total_concepts = 0;
            
            # Build mastery map from user data
            mastery_map = {};
            mastery_data = None;
            # if (mastery_response != None && mastery_response.status_code == 200) {
            #     mastery_data = mastery_response.json();
            #     if (mastery_data != None && hasattr(mastery_data, "__iter__")) {
            #         for mastery_item in mastery_data {
            #             if (hasattr(mastery_item, "concept_id") && hasattr(mastery_item, "proficiency_score")) {
            #                 mastery_map[mastery_item.concept_id] = mastery_item.proficiency_score;
            #             }
            #         }
            #     }
            # }
            
            # Build nodes from concepts
            concepts_data = None;
            # if (concepts_response != None && concepts_response.status_code == 200) {
            #     concepts_data = concepts_response.json();
            #     if (concepts_data != None && hasattr(concepts_data, "__iter__")) {
            #         total_concepts = len(concepts_data) if hasattr(concepts_data, "__len__") else 0;
            #         for concept in concepts_data {
            #             if (hasattr(concept, "id") && hasattr(concept, "name")) {
            #                 concept_id = concept.id;
            #                 name = concept.name;
            #                 category = concept.category if hasattr(concept, "category") else "";
            #                 proficiency = mastery_map.get(concept_id, 0.0) if hasattr(mastery_map, "get") else 0.0;
            #                 
            #                 # Determine status
            #                 if (proficiency >= 0.8) {
            #                     mastered += 1;
            #                 } elif (proficiency > 0.3) {
            #                     in_progress += 1;
            #                 } else {
            #                     not_started += 1;
            #                 }
            #                 
            #                 # Determine color based on proficiency
            #                 color = "#FF6B35";  # Default (not started)
            #                 if (proficiency >= 0.8) {
            #                     color = "#10B981";  # Green (mastered)
            #                 } elif (proficiency > 0.3) {
            #                     color = "#F59E0B";  # Yellow (in progress)
            #                 }
            #                 
            #                 nodes += {
            #                     "id": concept_id,
            #                     "label": name,
            #                     "proficiency": proficiency,
            #                     "category": category,
            #                     "color": color
            #                 };
            #             }
            #         }
            #     }
            # }
            
            # Build edges (prerequisites - simplified for now)
            # TODO: Query concept_prerequisites table for real edges
            
            report {
                "success": True,
                "nodes": nodes if nodes else [],
                "edges": edges if edges else [],
                "summary": {
                    "total_concepts": total_concepts,
                    "mastered": mastered,
                    "in_progress": in_progress,
                    "not_started": not_started
                }
            };
        } elif (self.action == "identify_weak_areas") {
            report {
                "success": True,
                "weak_areas": []
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + self.action
            };
        }
    }
}

walker get_lesson {
    has lesson_id: str = "";

    can entry with entry {
        # Query Supabase for lesson data
        # TODO: HTTP calls disabled - need Python requests
        # lesson_data_response = requests.get(...)
        lesson_data_response = None;
        
        # Default values
        title = "Lesson";
        content = "";
        order = 0;
        estimated_time = 15;
        lesson_type = "theory";
        
        lesson_data = None;
        # if (lesson_data_response != None && lesson_data_response.status_code == 200) {
        #     lesson_data = lesson_data_response.json();
        #     if (lesson_data != None) {
        #         title = lesson_data.title if hasattr(lesson_data, "title") else "Lesson";
        #         content = lesson_data.content if hasattr(lesson_data, "content") else "";
        #         order = lesson_data.order_index if hasattr(lesson_data, "order_index") else 0;
        #         estimated_time = lesson_data.estimated_time if hasattr(lesson_data, "estimated_time") else 15;
        #         lesson_type = lesson_data.lesson_type if hasattr(lesson_data, "lesson_type") else "theory";
        #     }
        # }
        
        report {
            "success": True,
            "lesson_id": lesson_id if lesson_id else "",
            "title": title,
            "content": content,
            "order": order,
            "estimated_time": estimated_time,
            "lesson_type": lesson_type
        };
    }
}

walker init {
    can entry with entry {
        report "JacPilot backend initialized! All models and walkers loaded.";
    }
}

# Diagnostic walker to verify reports are returned
walker ping {
    can entry with entry {
        report "pong";
    }
}
