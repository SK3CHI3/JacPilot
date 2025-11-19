/**
 * Skill Analyzer Agent
 * Analyzes OSP graph to generate skill map data and identify weak areas
 */

walker skill_analyzer {
    has user_id;
    has action = "generate_skill_map";
    
    can analyze_mastery_graph {
        user_node = spawn here --> node::user[user_id == user_id];
        
        if (!user_node) {
            return {
                "success": False,
                "error": "User not found"
            };
        }
        
        masteries = spawn user_node --> node::mastery;
        skill_scores = {};
        
        for mastery in masteries {
            concept = spawn mastery --> node::concept;
            skill_scores[concept.concept_id] = {
                "name": concept.name,
                "proficiency": mastery.proficiency_score,
                "category": concept.category,
                "attempts": mastery.attempts_count,
                "streak": mastery.streak
            };
        }
        
        return {
            "success": True,
            "skill_scores": skill_scores
        };
    }
    
    can generate_skill_map {
        skill_scores_result = analyze_mastery_graph();
        
        if (!skill_scores_result.success) {
            return skill_scores_result;
        }
        
        skill_scores = skill_scores_result.skill_scores;
        nodes = [];
        edges = [];
        
        // Build nodes
        for concept_id, score_data in skill_scores {
            // Determine color based on proficiency
            if (score_data.proficiency >= 0.8) {
                color = "#10B981"; // Green
            } else if (score_data.proficiency >= 0.5) {
                color = "#FFD23F"; // Yellow
            } else if (score_data.proficiency > 0) {
                color = "#FF6B35"; // Orange
            } else {
                color = "#9CA3AF"; // Gray
            }
            
            nodes += {
                "id": concept_id,
                "label": score_data.name,
                "proficiency": score_data.proficiency,
                "category": score_data.category,
                "color": color,
                "attempts": score_data.attempts,
                "streak": score_data.streak
            };
            
            // Add prerequisite edges
            concept = spawn here --> node::concept[concept_id == concept_id];
            prereqs = spawn concept <-- node::concept;
            for prereq in prereqs {
                edges += {
                    "from": prereq.concept_id,
                    "to": concept_id,
                    "type": "prerequisite"
                };
            }
        }
        
        // Count status
        mastered = 0;
        in_progress = 0;
        not_started = 0;
        
        for node in nodes {
            if (node.proficiency >= 0.8) {
                mastered += 1;
            } else if (node.proficiency > 0.3) {
                in_progress += 1;
            } else {
                not_started += 1;
            }
        }
        
        return {
            "success": True,
            "nodes": nodes,
            "edges": edges,
            "summary": {
                "total_concepts": nodes.length,
                "mastered": mastered,
                "in_progress": in_progress,
                "not_started": not_started
            }
        };
    }
    
    can identify_weak_areas {
        skill_scores_result = analyze_mastery_graph();
        
        if (!skill_scores_result.success) {
            return skill_scores_result;
        }
        
        skill_scores = skill_scores_result.skill_scores;
        weak_concepts = [];
        
        for concept_id, score_data in skill_scores {
            if (score_data.proficiency < 0.6) {
                // Check prerequisites
                concept = spawn here --> node::concept[concept_id == concept_id];
                prereqs = spawn concept <-- node::concept;
                
                prereq_avg = 0.0;
                prereq_count = 0;
                
                for prereq in prereqs {
                    if (skill_scores.has(prereq.concept_id)) {
                        prereq_avg += skill_scores[prereq.concept_id].proficiency;
                        prereq_count += 1;
                    }
                }
                
                if (prereq_count > 0) {
                    prereq_avg = prereq_avg / prereq_count;
                    
                    if (prereq_avg > 0.7) {
                        weak_concepts += {
                            "concept_id": concept_id,
                            "concept_name": score_data.name,
                            "proficiency": score_data.proficiency,
                            "prereq_avg": prereq_avg,
                            "gap": prereq_avg - score_data.proficiency,
                            "recommendation": "Focus on this concept - prerequisites suggest readiness"
                        };
                    }
                }
            }
        }
        
        // Sort by gap (largest first)
        weak_concepts = weak_concepts.sort("gap", reverse=True);
        
        return {
            "success": True,
            "weak_areas": weak_concepts,
            "priority": weak_concepts
        };
    }
    
    root {
        if (action == "analyze_mastery_graph") {
            report = analyze_mastery_graph();
        } else if (action == "generate_skill_map") {
            report = generate_skill_map();
        } else if (action == "identify_weak_areas") {
            report = identify_weak_areas();
        } else {
            report = {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}


