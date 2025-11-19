/**
 * Knowledge Graph Initialization
 * Sets up the OSP graph structure for the learning platform
 */

graph knowledge_graph {
    has anchor knowledge_root;
    
    spawn {
        knowledge_root = spawn node::user;
        knowledge_root.user_id = "root";
        knowledge_root.email = "system@jacpilot.com";
        knowledge_root.name = "System";
    }
}

