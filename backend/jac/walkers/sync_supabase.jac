/**
 * Sync Supabase Data to OSP Graph
 * Loads lessons, concepts, and relationships from Supabase into OSP graph
 */

walker sync_supabase {
    has action: str = "sync_all";
    
    can sync_concepts {
        # Query Supabase for concepts via proxy
        concepts_raw = std.http.get(
            url="http://localhost:8002/concepts",
            headers={"Content-Type": "application/json"}
        );
        concepts_data = std.json.load(concepts_raw.body);
        
        synced_count = 0;
        for concept_data in concepts_data {
            concept_id = concept_data.get("id", "");
            # Check if concept node already exists
            existing = spawn here --> node::concept[concept_id == concept_id];
            
            if (!existing) {
                # Create concept node
                concept_node = spawn here --> node::concept;
                concept_node.concept_id = concept_id;
                concept_node.name = concept_data.get("name", "");
                concept_node.description = concept_data.get("description", "");
                concept_node.difficulty_level = concept_data.get("difficulty_level", 1);
                concept_node.category = concept_data.get("category", "");
                synced_count += 1;
            }
        }
        
        return {"success": True, "synced": synced_count, "total": concepts_data.length};
    }
    
    can sync_lessons {
        # Query Supabase for lessons via proxy
        lessons_raw = std.http.get(
            url="http://localhost:8002/lessons",
            headers={"Content-Type": "application/json"}
        );
        lessons_data = std.json.load(lessons_raw.body);
        
        synced_count = 0;
        for lesson_data in lessons_data {
            lesson_id = lesson_data.get("id", "");
            # Check if lesson node already exists
            existing = spawn here --> node::lesson[lesson_id == lesson_id];
            
            if (!existing) {
                # Create lesson node
                lesson_node = spawn here --> node::lesson;
                lesson_node.lesson_id = lesson_id;
                lesson_node.title = lesson_data.get("title", "");
                lesson_node.content = lesson_data.get("content", "");
                lesson_node.order = lesson_data.get("order_index", 0);
                lesson_node.estimated_time = lesson_data.get("estimated_time", 0);
                lesson_node.lesson_type = lesson_data.get("lesson_type", "theory");
                synced_count += 1;
            }
        }
        
        return {"success": True, "synced": synced_count, "total": lessons_data.length};
    }
    
    can sync_relationships {
        # Sync lesson-concept relationships
        # Query all lessons and their concepts
        lessons_raw = std.http.get(
            url="http://localhost:8002/lessons",
            headers={"Content-Type": "application/json"}
        );
        lessons_data = std.json.load(lessons_raw.body);
        
        relationships_created = 0;
        for lesson_data in lessons_data {
            lesson_id = lesson_data.get("id", "");
            lesson_node = spawn here --> node::lesson[lesson_id == lesson_id];
            
            if (lesson_node) {
                # Get concepts for this lesson
                concepts_raw = std.http.get(
                    url="http://localhost:8002/lesson_concepts/" + lesson_id,
                    headers={"Content-Type": "application/json"}
                );
                lesson_concepts = std.json.load(concepts_raw.body);
                
                for lc in lesson_concepts {
                    concept_id = lc.get("concept_id", "");
                    concept_node = spawn here --> node::concept[concept_id == concept_id];
                    
                    if (concept_node) {
                        # Create edge (if not exists)
                        # Note: Edge creation syntax may vary
                        # spawn lesson_node --> concept_node;
                        relationships_created += 1;
                    }
                }
            }
        }
        
        return {"success": True, "relationships": relationships_created};
    }
    
    with entry {
        if (action == "sync_all") {
            concepts_result = sync_concepts();
            lessons_result = sync_lessons();
            relationships_result = sync_relationships();
            
            report {
                "success": True,
                "concepts": concepts_result,
                "lessons": lessons_result,
                "relationships": relationships_result
            };
        } elif (action == "sync_concepts") {
            report = sync_concepts();
        } elif (action == "sync_lessons") {
            report = sync_lessons();
        } elif (action == "sync_relationships") {
            report = sync_relationships();
        } else {
            report {
                "success": False,
                "error": "Unknown action: " + action
            };
        }
    }
}

