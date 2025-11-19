/**
 * JacPilot Main Entry Point
 * Initializes the knowledge graph and loads all models and walkers
 */

walker init {
    root {
        spawn here --> graph::knowledge_graph;
        std.out("JacPilot backend initialized!");
    }
}

