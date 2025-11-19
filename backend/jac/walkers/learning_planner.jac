/**
 * Learning Planner Agent
 * Analyzes user's mastery graph and determines optimal learning path
 */

walker learning_planner {
    has user_id;
    has action = "plan_next_lesson";
    has lesson_id = "";
    
    can plan_next_lesson {
        // Find user node
        user_node = spawn here --> node::user[user_id == user_id];
        
        if (!user_node) {
            return {
                "success": False,
                "error": "User not found"
            };
        }
        
        // Get user's mastery nodes
        masteries = spawn user_node --> node::mastery;
        
        // Find concepts with low mastery (< 0.7)
        weak_concepts = [];
        for mastery in masteries {
            if (mastery.proficiency_score < 0.7) {
                concept = spawn mastery --> node::concept;
                weak_concepts += concept;
            }
        }
        
        // If no weak concepts, find concepts not yet started
        if (weak_concepts.length == 0) {
            all_concepts = spawn here --> node::concept;
            for concept in all_concepts {
                has_mastery = False;
                for mastery in masteries {
                    mastery_concept = spawn mastery --> node::concept;
                    if (mastery_concept.concept_id == concept.concept_id) {
                        has_mastery = True;
                        break;
                    }
                }
                if (!has_mastery) {
                    weak_concepts += concept;
                }
            }
        }
        
        // Check prerequisites for each weak concept
        eligible_concepts = [];
        for concept in weak_concepts {
            prereqs_met = True;
            // Get prerequisites (concepts that this concept depends on)
            prereqs = spawn concept <-- node::concept;
            
            if (prereqs.length > 0) {
                for prereq in prereqs {
                    // Check if user has mastery for prerequisite
                    prereq_mastery = null;
                    for mastery in masteries {
                        mastery_concept = spawn mastery --> node::concept;
                        if (mastery_concept.concept_id == prereq.concept_id) {
                            prereq_mastery = mastery;
                            break;
                        }
                    }
                    
                    if (!prereq_mastery || prereq_mastery.proficiency_score < 0.7) {
                        prereqs_met = False;
                        break;
                    }
                }
            }
            
            if (prereqs_met) {
                eligible_concepts += concept;
            }
        }
        
        // If no eligible concepts, return first available lesson
        if (eligible_concepts.length == 0) {
            all_lessons = spawn here --> node::lesson;
            if (all_lessons.length > 0) {
                next_lesson = all_lessons[0];
                return {
                    "success": True,
                    "lesson_id": next_lesson.lesson_id,
                    "title": next_lesson.title,
                    "reason": "No prerequisites needed",
                    "estimated_time": next_lesson.estimated_time
                };
            }
        }
        
        // Select first eligible concept and find lesson
        if (eligible_concepts.length > 0) {
            target_concept = eligible_concepts[0];
            
            // Find lesson covering this concept
            lessons = spawn here --> node::lesson;
            for lesson in lessons {
                // Check if lesson covers this concept
                concepts = spawn lesson --> node::concept;
                for lesson_concept in concepts {
                    if (lesson_concept.concept_id == target_concept.concept_id) {
                        return {
                            "success": True,
                            "lesson_id": lesson.lesson_id,
                            "title": lesson.title,
                            "reason": "Prerequisites met for concept: " + target_concept.name,
                            "estimated_time": lesson.estimated_time
                        };
                    }
                }
            }
        }
        
        return {
            "success": False,
            "error": "No suitable lesson found"
        };
    }
    
    can check_prerequisites {
        user_node = spawn here --> node::user[user_id == user_id];
        lesson_node = spawn here --> node::lesson[lesson_id == lesson_id];
        
        if (!user_node || !lesson_node) {
            return {"success": False, "prerequisites_met": False};
        }
        
        // Get concepts covered by lesson
        lesson_concepts = spawn lesson_node --> node::concept;
        
        // Get user's masteries
        masteries = spawn user_node --> node::mastery;
        
        // Check prerequisites for each concept
        for concept in lesson_concepts {
            prereqs = spawn concept <-- node::concept;
            for prereq in prereqs {
                prereq_mastery = null;
                for mastery in masteries {
                    mastery_concept = spawn mastery --> node::concept;
                    if (mastery_concept.concept_id == prereq.concept_id) {
                        prereq_mastery = mastery;
                        break;
                    }
                }
                
                if (!prereq_mastery || prereq_mastery.proficiency_score < 0.7) {
                    return {
                        "success": True,
                        "prerequisites_met": False,
                        "missing_prerequisite": prereq.name
                    };
                }
            }
        }
        
        return {
                        "success": True,
            "prerequisites_met": True
        };
    }
    
    root {
        if (action == "plan_next_lesson") {
            report = plan_next_lesson();
        } else if (action == "check_prerequisites") {
            report = check_prerequisites();
        } else {
            report = {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}


