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
        report {
            "success": True,
            "lesson_id": "lesson-1",
            "title": "Introduction to Jac Language",
            "reason": "Next lesson",
            "estimated_time": 15
        };
    }
}

walker quiz_generator {
    has lesson_id: str = "";
    has user_id: str = "";
    
    with entry {
        report {
            "success": True,
            "quiz_id": "quiz-" + lesson_id + "-" + user_id,
            "difficulty": 2,
            "questions": []
        };
    }
}

walker answer_evaluator {
    has question_id: str = "";
    has user_answer: str = "";
    has correct_answer: str = "";
    has user_id: str = "";
    has action: str = "evaluate_answer";
    
    with entry {
        if (action == "evaluate_answer") {
            report {
                "success": True,
                "score": 0.5,
                "correct": False,
                "feedback": "Evaluation completed"
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
            report {
                "success": True,
                "nodes": [],
                "edges": [],
                "summary": {
                    "total_concepts": 0,
                    "mastered": 0,
                    "in_progress": 0,
                    "not_started": 0
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

walker init {
    with entry {
        report "JacPilot backend initialized! All models and walkers loaded.";
    }
}
