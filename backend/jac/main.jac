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
    
    with entry {
        if (action == "plan_next_lesson") {
            # Query Supabase for user's completed lessons
            progress_response = std.http.get(
                url="http://localhost:8002/user_progress/" + user_id,
                headers={"Content-Type": "application/json"}
            );
            
            completed_lesson_ids = [];
            if (progress_response.status_code == 200) {
                progress_data = std.json.load(progress_response.body);
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
            lessons_response = std.http.get(
                url="http://localhost:8002/lessons",
                headers={"Content-Type": "application/json"}
            );
            
            # Default to first lesson
            next_lesson_id = "";
            next_title = "Introduction to Jaseci & Jac";
            next_estimated_time = 15;
            
            if (lessons_response.status_code == 200) {
                lessons_data = std.json.load(lessons_response.body);
                if (lessons_data != None && hasattr(lessons_data, "__iter__")) {
                    # Find first lesson not completed
                    for lesson in lessons_data {
                        lesson_id_val = "";
                        if (hasattr(lesson, "get")) {
                            lesson_id_val = lesson.get("id", "");
                            if (lesson_id_val && lesson_id_val not in completed_lesson_ids) {
                                next_lesson_id = lesson_id_val;
                                next_title = lesson.get("title", "Next Lesson");
                                next_estimated_time = lesson.get("estimated_time", 15);
                                break;
                            }
                        }
                    }
                }
            }
            
            report {
                "success": True,
                "lesson_id": next_lesson_id if next_lesson_id else "lesson-1",
                "title": next_title,
                "reason": "Next lesson in sequence",
                "estimated_time": next_estimated_time
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}

walker quiz_generator {
    has lesson_id: str = "";
    has user_id: str = "";
    has lesson_content: str = "";
    has lesson_title: str = "";
    has concepts: list = [];
    
    with entry {
        # Calculate difficulty based on user mastery (placeholder for now)
        difficulty = 2;
        
        # Build topics list for Gemini
        topics_list = [];
        # Handle concepts safely - check if it's a valid list before iterating
        if (concepts != None && concepts != [] && hasattr(concepts, "__iter__")) {
            for concept in concepts {
                if (hasattr(concept, "get")) {
                    topics_list += concept.get("name", "");
                } else {
                    topics_list += str(concept);
                }
            }
        }
        
        # Use Gemini API via HTTP proxy to generate quiz
        quiz_data = {
            "lesson_content": lesson_content if lesson_content else "Jaseci programming concepts",
            "difficulty": difficulty,
            "num_questions": 5,
            "topics": topics_list
        };
        
        # Call Gemini proxy
        questions = [];
        try {
            gemini_response = std.http.post(
                url="http://localhost:8001/generate_quiz_questions",
                headers={"Content-Type": "application/json"},
                body=std.json.dump(quiz_data)
            );
            
            if (gemini_response.status_code == 200) {
                response_data = std.json.load(gemini_response.body);
                if (response_data != None) {
                    questions = response_data.questions if hasattr(response_data, "questions") else [];
                }
            }
        } catch {
            # Fallback if Gemini proxy is not available
            questions = [];
        }
        
        report {
            "success": True,
            "quiz_id": "quiz-" + lesson_id + "-" + user_id,
            "difficulty": difficulty,
            "questions": questions
        };
    }
}

walker answer_evaluator {
    has question_id: str = "";
    has user_answer: str = "";
    has correct_answer: str = "";
    has user_id: str = "";
    has question_context: dict = {};
    has question_type: str = "free_text";
    has action: str = "evaluate_answer";
    
    with entry {
        if (action == "evaluate_answer") {
            # Use Gemini API via HTTP proxy
            eval_data = {
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "context": question_context if question_context else {}
            };
            
            # Default values
            score = 0.5;
            correct = False;
            feedback = "Evaluation completed";
            strengths = [];
            improvements = [];
            
            # Call Gemini proxy
            try {
                gemini_response = std.http.post(
                    url="http://localhost:8001/evaluate_answer",
                    headers={"Content-Type": "application/json"},
                    body=std.json.dump(eval_data)
                );
                
                if (gemini_response.status_code == 200) {
                    response_data = std.json.load(gemini_response.body);
                    if (response_data != None) {
                        score = response_data.score if hasattr(response_data, "score") else 0.5;
                        correct = response_data.correct if hasattr(response_data, "correct") else False;
                        feedback = response_data.feedback if hasattr(response_data, "feedback") else "Evaluation completed";
                        strengths = response_data.strengths if hasattr(response_data, "strengths") else [];
                        improvements = response_data.improvements if hasattr(response_data, "improvements") else [];
                    }
                }
            } catch {
                # Fallback if Gemini proxy is not available
                score = 0.5;
                correct = False;
                feedback = "Gemini proxy not available";
                strengths = [];
                improvements = [];
            }
            
            report {
                "success": True,
                "score": score,
                "correct": correct,
                "feedback": feedback,
                "strengths": strengths if strengths else [],
                "improvements": improvements if improvements else []
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}

walker progress_tracker {
    has user_id: str;
    has action: str = "get_progress_summary";
    
    with entry {
        if (action == "get_progress_summary") {
            # Query Supabase for real progress data
            lessons_completed = 0;
            average_quiz_score = 0.0;
            mastered_concepts = 0;
            total_hours = 0;
            current_streak = 0;
            
            # Get lesson progress from Supabase
            progress_response = std.http.get(
                url="http://localhost:8002/user_progress/" + user_id,
                headers={"Content-Type": "application/json"}
            );
            
            try {
                if (progress_response.status_code == 200) {
                    progress_data = std.json.load(progress_response.body);
                    if (progress_data != None && hasattr(progress_data, "__len__") && len(progress_data) > 0) {
                        lessons_completed = len(progress_data);
                        # Calculate average score
                        total_score = 0.0;
                        for progress in progress_data {
                            if (hasattr(progress, "score")) {
                                total_score += progress.score;
                            }
                        }
                        if (lessons_completed > 0) {
                            average_quiz_score = total_score / lessons_completed;
                        }
                    }
                }
            } catch {
                # If query fails, keep defaults
                lessons_completed = 0;
                average_quiz_score = 0.0;
            }
            
            # Get quiz attempts
            try {
                quiz_response = std.http.get(
                    url="http://localhost:8002/quiz_attempts/" + user_id,
                    headers={"Content-Type": "application/json"}
                );
                
                if (quiz_response.status_code == 200) {
                    quiz_data = std.json.load(quiz_response.body);
                    if (quiz_data != None && hasattr(quiz_data, "__len__") && len(quiz_data) > 0) {
                        quiz_total = 0.0;
                        quiz_count = 0;
                        for attempt in quiz_data {
                            if (hasattr(attempt, "score")) {
                                quiz_total += attempt.score;
                                quiz_count += 1;
                            }
                        }
                        if (quiz_count > 0) {
                            quiz_avg = quiz_total / quiz_count;
                            # Average between lesson and quiz scores
                            if (average_quiz_score > 0) {
                                average_quiz_score = (average_quiz_score + quiz_avg) / 2.0;
                            } else {
                                average_quiz_score = quiz_avg;
                            }
                        }
                    }
                }
            } catch {
                # If quiz query fails, keep current average_quiz_score
            }
            
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
                "error": "Unknown action: " + action
            };
        }
    }
}

walker skill_analyzer {
    has user_id: str;
    has action: str = "generate_skill_map";
    
    with entry {
        if (action == "generate_skill_map") {
            # Query Supabase for concepts
            concepts_response = std.http.get(
                url="http://localhost:8002/concepts",
                headers={"Content-Type": "application/json"}
            );
            
            # Query user mastery
            mastery_response = std.http.get(
                url="http://localhost:8002/mastery/" + user_id,
                headers={"Content-Type": "application/json"}
            );
            
            nodes = [];
            edges = [];
            mastered = 0;
            in_progress = 0;
            not_started = 0;
            total_concepts = 0;
            
            # Build mastery map from user data
            mastery_map = {};
            try {
                if (mastery_response.status_code == 200) {
                    mastery_data = std.json.load(mastery_response.body);
                    if (mastery_data != None && hasattr(mastery_data, "__iter__")) {
                        for mastery_item in mastery_data {
                            if (hasattr(mastery_item, "concept_id") && hasattr(mastery_item, "proficiency_score")) {
                                mastery_map[mastery_item.concept_id] = mastery_item.proficiency_score;
                            }
                        }
                    }
                }
            } catch {
                # If mastery query fails, mastery_map stays empty
                mastery_map = {};
            }
            
            # Build nodes from concepts
            try {
                if (concepts_response.status_code == 200) {
                    concepts_data = std.json.load(concepts_response.body);
                    if (concepts_data != None && hasattr(concepts_data, "__iter__")) {
                        total_concepts = len(concepts_data) if hasattr(concepts_data, "__len__") else 0;
                        for concept in concepts_data {
                            if (hasattr(concept, "id") && hasattr(concept, "name")) {
                                concept_id = concept.id;
                                name = concept.name;
                                category = concept.category if hasattr(concept, "category") else "";
                                proficiency = mastery_map.get(concept_id, 0.0) if hasattr(mastery_map, "get") else 0.0;
                                
                                # Determine status
                                if (proficiency >= 0.8) {
                                    mastered += 1;
                                } elif (proficiency > 0.3) {
                                    in_progress += 1;
                                } else {
                                    not_started += 1;
                                }
                                
                                # Determine color based on proficiency
                                color = "#FF6B35";  # Default (not started)
                                if (proficiency >= 0.8) {
                                    color = "#10B981";  # Green (mastered)
                                } elif (proficiency > 0.3) {
                                    color = "#F59E0B";  # Yellow (in progress)
                                }
                                
                                nodes += {
                                    "id": concept_id,
                                    "label": name,
                                    "proficiency": proficiency,
                                    "category": category,
                                    "color": color
                                };
                            }
                        }
                    }
                }
            } catch {
                # If concepts query fails, nodes stays empty
                nodes = [];
            }
            
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
        } elif (action == "identify_weak_areas") {
            report {
                "success": True,
                "weak_areas": []
            };
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}

walker get_lesson {
    has lesson_id: str = "";
    
    with entry {
        # Query Supabase for lesson data
        lesson_data_response = std.http.get(
            url="http://localhost:8002/lesson/" + lesson_id,
            headers={"Content-Type": "application/json"}
        );
        
        # Default values
        title = "Lesson";
        content = "";
        order = 0;
        estimated_time = 15;
        lesson_type = "theory";
        
        try {
            if (lesson_data_response.status_code == 200) {
                lesson_data = std.json.load(lesson_data_response.body);
                if (lesson_data != None) {
                    title = lesson_data.title if hasattr(lesson_data, "title") else "Lesson";
                    content = lesson_data.content if hasattr(lesson_data, "content") else "";
                    order = lesson_data.order_index if hasattr(lesson_data, "order_index") else 0;
                    estimated_time = lesson_data.estimated_time if hasattr(lesson_data, "estimated_time") else 15;
                    lesson_type = lesson_data.lesson_type if hasattr(lesson_data, "lesson_type") else "theory";
                }
            }
        } catch {
            # If query fails, keep defaults
            title = "Lesson";
            content = "";
            order = 0;
            estimated_time = 15;
            lesson_type = "theory";
        }
        
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
    with entry {
        report "JacPilot backend initialized! All models and walkers loaded.";
    }
}
