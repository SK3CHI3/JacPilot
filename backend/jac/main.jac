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
            # For now, return first lesson (will query Supabase when proxy is running)
            # TODO: Query Supabase via proxy for lessons and user progress
            report {
                "success": True,
                "lesson_id": "lesson-1",
                "title": "Introduction to Jaseci & Jac",
                "reason": "Next lesson in sequence",
                "estimated_time": 15
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
        # At runtime, concepts should be a list if provided
        if (concepts != None && concepts != [] && hasattr(concepts, "__iter__")) {
            for concept in concepts {
                topics_list += concept;
            }
        }
        
        # Use Gemini API via HTTP proxy to generate quiz
        # TODO: Implement HTTP call when proxy is ready
        # For now, return placeholder
        questions = [];
        
        report {
            "success": True,
            "quiz_id": "quiz-" + lesson_id + "-" + user_id,
            "difficulty": difficulty,
            "questions": questions,
            "note": "Gemini proxy integration pending - run start_gemini_proxy.bat first"
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
            # TODO: Implement HTTP call when proxy is ready
            # For now, return placeholder
            report {
                "success": True,
                "score": 0.5,
                "correct": False,
                "feedback": "Evaluation completed - Gemini proxy integration pending",
                "strengths": [],
                "improvements": ["Run start_gemini_proxy.bat to enable AI evaluation"]
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
            report {
                "success": True,
                "lessons_completed": 0,
                "average_quiz_score": 0.0,
                "mastered_concepts": 0,
                "total_hours": 0,
                "current_streak": 0
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
            # Return placeholder for now
            # TODO: Query Supabase via proxy when implemented
            report {
                "success": True,
                "nodes": [],
                "edges": [],
                "summary": {
                    "total_concepts": 58,
                    "mastered": 0,
                    "in_progress": 0,
                    "not_started": 58
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
        # For now, return placeholder
        # TODO: Query Supabase or OSP graph when implemented
        # Use lesson_id directly - it should be available at runtime
        report {
            "success": True,
            "lesson_id": lesson_id if lesson_id else "",
            "title": "Lesson",
            "content": "",
            "order": 0,
            "estimated_time": 15,
            "lesson_type": "theory"
        };
    }
}

walker init {
    with entry {
        report "JacPilot backend initialized! All models and walkers loaded.";
    }
}
