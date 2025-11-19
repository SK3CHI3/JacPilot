# Architecture Decisions

## 🎯 Core Design Philosophy

**JacPilot** follows a hybrid architecture where:
- **OSP Graph** handles reasoning and mastery modeling
- **Supabase** handles persistent data storage
- **byLLM** provides AI capabilities for generation and analysis
- **Jac Client** enables seamless frontend-backend communication

## 🔑 Key Decisions

### 1. Why OSP Graph for Mastery?

**Decision**: Use OSP graph to model user mastery as a knowledge graph rather than flat database records.

**Rationale**:
- Enables graph-based reasoning (prerequisites, recommendations)
- Natural representation of concept relationships
- Efficient traversal for learning path generation
- Demonstrates non-trivial OSP usage (requirement)

**Alternatives Considered**:
- Pure relational database (rejected - doesn't meet OSP requirement)
- Hybrid with graph only for relationships (chosen - best of both worlds)

### 2. Dual Database Strategy

**Decision**: Use both OSP graph (Jaseci) and Supabase (PostgreSQL).

**Rationale**:
- OSP for reasoning and graph operations
- Supabase for reliable persistence, auth, and complex queries
- Separation of concerns: graph = intelligence, DB = storage

**Data Flow**:
- User actions → Supabase (persistent)
- Reasoning operations → OSP graph (in-memory, synced)
- Periodic sync between systems

### 3. Multi-Agent Architecture

**Decision**: Implement 5 distinct agents with clear responsibilities.

**Rationale**:
- Meets requirement of 2-3+ agents
- Separation of concerns (planner, generator, evaluator, tracker, analyzer)
- Each agent has distinct byLLM usage pattern
- Enables independent testing and scaling

**Agent Responsibilities**:
- **Learning Planner**: Strategic decisions (what to learn next)
- **Quiz Generator**: Content creation (generative byLLM)
- **Answer Evaluator**: Assessment (analytical byLLM)
- **Progress Tracker**: Data aggregation (no byLLM)
- **Skill Analyzer**: Graph analysis (analytical byLLM)

### 4. byLLM Integration Strategy

**Decision**: Use byLLM for both generative AND analytical tasks.

**Rationale**:
- Meets requirement of both use cases
- Generative: Quiz questions, explanations, exercises
- Analytical: Answer evaluation, classification, pattern detection
- Demonstrates full byLLM capabilities

**Prompt Strategy**:
- Centralized prompt library in `docs/PROMPTS.md`
- Consistent prompt templates
- Version control for prompt iterations

### 5. Frontend Architecture

**Decision**: React + TypeScript + Vite with Jac Client for backend communication.

**Rationale**:
- Modern, fast development (Vite)
- Type safety (TypeScript)
- Direct walker calls via Jac Client (Spawn())
- No REST API layer needed (simpler architecture)

**Component Strategy**:
- Feature-based component organization
- Custom hooks for Jac Client integration
- Context API for global state (user, mastery)

### 6. Code Editor Choice

**Decision**: Monaco Editor (VS Code editor in browser).

**Rationale**:
- Industry standard (VS Code)
- Excellent Jac syntax support potential
- Rich features (autocomplete, error highlighting)
- Good user experience

### 7. Graph Visualization

**Decision**: D3.js or vis.js for skill map visualization.

**Rationale**:
- Interactive graph visualization
- Customizable styling
- Good performance for medium-sized graphs
- Clear visual representation of mastery

### 8. Adaptive Learning Logic

**Decision**: Combine OSP graph traversal with byLLM analysis.

**Rationale**:
- Graph provides structure (prerequisites, relationships)
- byLLM provides intelligence (recommendations, difficulty adjustment)
- Hybrid approach leverages both strengths

**Implementation**:
- Graph traversal finds eligible concepts
- byLLM analyzes user patterns to prioritize
- Mastery scores guide difficulty adjustment

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                         │
│  React + Vite + Jac Client                               │
│  • Lesson Viewer    • Quiz Interface                     │
│  • Code Editor      • Skill Map                          │
│  • Progress Dashboard                                    │
└────────────────────┬──────────────────────────────────────┘
                     │ Spawn() calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Jaseci Backend Layer                     │
│  • Walker Agents (5 agents)                              │
│  • OSP Graph (in-memory knowledge graph)                 │
│  • byLLM Integration                                     │
└────────────┬──────────────────────┬──────────────────────┘
             │                      │
             │ Graph Operations     │ Data Persistence
             ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│    OSP Graph         │  │    Supabase          │
│  (Reasoning Layer)   │  │  (Storage Layer)     │
│                      │  │  • Users             │
│  • Mastery nodes     │  │  • Lessons           │
│  • Concept nodes     │  │  • Quiz results      │
│  • Relationships     │  │  • Progress          │
└──────────────────────┘  └──────────────────────┘
```

## 🔄 Data Synchronization Strategy

**Challenge**: Keep OSP graph and Supabase in sync.

**Solution**:
1. **Write Path**: 
   - User actions → Supabase (immediate)
   - Async sync to OSP graph (background job)
   
2. **Read Path**:
   - Reasoning queries → OSP graph (fast)
   - Historical data → Supabase (reliable)

3. **Sync Frequency**:
   - Real-time for critical updates (quiz scores)
   - Periodic batch sync for less critical data

## 🎨 UI/UX Decisions

### Component Library
**Decision**: Tailwind CSS + shadcn/ui (or similar)

**Rationale**:
- Modern, accessible components
- Fast development
- Customizable
- Good TypeScript support

### State Management
**Decision**: React Context API (or Zustand if needed)

**Rationale**:
- Simple for this scope
- No need for Redux complexity
- Easy to understand and maintain

### Routing
**Decision**: React Router

**Rationale**:
- Standard solution
- Good TypeScript support
- Easy to implement

## 🔒 Security Considerations

1. **Authentication**: Supabase Auth
2. **Authorization**: User-scoped queries in walkers
3. **Input Validation**: Both frontend and backend
4. **Code Execution**: Sandboxed backend execution for user code

## 📈 Scalability Considerations

1. **OSP Graph**: In-memory, may need partitioning for large user base
2. **byLLM Calls**: Rate limiting and caching
3. **Database**: Supabase handles scaling
4. **Frontend**: Static assets via CDN

## 🧪 Testing Strategy

1. **Unit Tests**: Individual walkers
2. **Integration Tests**: Agent interactions
3. **E2E Tests**: Critical user flows
4. **Manual Testing**: byLLM output quality

## 📝 Documentation Strategy

1. **README.md**: Setup and quick start
2. **PROJECT_PLAN.md**: This comprehensive plan
3. **ARCHITECTURE_DECISIONS.md**: This document
4. **API.md**: Walker API documentation
5. **PROMPTS.md**: byLLM prompt library
6. **AGENT_DESIGN.md**: Detailed agent specifications

## 🚀 Deployment Strategy

1. **Backend**: Jaseci server (Railway/Vercel/self-hosted)
2. **Frontend**: Vercel/Netlify (static hosting)
3. **Database**: Supabase (managed)
4. **Environment Variables**: Secure secret management

## 🔄 Future Enhancements (Post-Hackathon)

1. Real-time collaboration
2. Social features (leaderboards, sharing)
3. Advanced analytics
4. Mobile app
5. Offline support
6. More language support

