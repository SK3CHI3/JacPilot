# Agent Specifications

## Detailed Agent Design and Implementation Guide

---

## 🤖 Agent 1: Learning Planner Agent

### Purpose
Analyzes user's mastery graph and determines optimal learning path based on prerequisites, proficiency scores, and learning patterns.

### Walker: `learning_planner`

### Responsibilities
1. Check prerequisites for target lessons
2. Recommend next lesson based on mastery
3. Calculate personalized learning path
4. Unlock content when prerequisites met
5. Adjust recommendations based on performance

### OSP Graph Usage
- **Traverses**: `prerequisite` edges from concepts
- **Queries**: `mastery` nodes for proficiency scores
- **Updates**: `recommends` edges (AI-generated suggestions)

### byLLM Integration
**Type**: Analytical

**Use Cases**:
1. Analyze learning patterns to suggest optimal pace
2. Generate personalized study recommendations
3. Identify learning gaps from mastery data

### Methods

#### `plan_next_lesson(user_id: string) -> Lesson`
```jac
walker plan_next_lesson {
    has user_id;
    
    // Traverse user's mastery nodes
    user_node = spawn here --> node::user[user_id];
    
    // Find concepts with low mastery
    weak_concepts = spawn user_node --> node::mastery[proficiency_score < 0.7] 
                                         --> node::concept;
    
    // Check prerequisites for each weak concept
    eligible_concepts = [];
    for concept in weak_concepts {
        prereqs = spawn concept <-- node::concept[prerequisite];
        all_met = true;
        for prereq in prereqs {
            mastery = spawn user_node --> node::mastery[concept_id == prereq.id] 
                                        --> node::mastery;
            if (mastery.proficiency_score < 0.7) {
                all_met = false;
                break;
            }
        }
        if (all_met) {
            eligible_concepts += concept;
        }
    }
    
    // Use byLLM to prioritize
    recommendation = byllm.analyze(
        prompt="Given user's mastery: {user_mastery_data}, 
                recommend next concept from: {eligible_concepts}",
        model="gpt-4"
    );
    
    // Find lesson covering recommended concept
    lesson = spawn recommendation.concept --> node::lesson[covers];
    
    return lesson;
}
```

#### `check_prerequisites(user_id: string, lesson_id: string) -> bool`
```jac
walker check_prerequisites {
    has user_id, lesson_id;
    
    lesson = spawn here --> node::lesson[lesson_id];
    concepts = spawn lesson --> node::concept[covers];
    
    user = spawn here --> node::user[user_id];
    
    for concept in concepts {
        prereqs = spawn concept <-- node::concept[prerequisite];
        for prereq in prereqs {
            mastery = spawn user --> node::mastery[concept_id == prereq.id];
            if (mastery.proficiency_score < 0.7) {
                return false;
            }
        }
    }
    
    return true;
}
```

#### `calculate_learning_path(user_id: string) -> List[Concept]`
```jac
walker calculate_learning_path {
    has user_id;
    
    // Get all concepts
    all_concepts = spawn here --> node::concept;
    
    // Build dependency graph
    path = topological_sort(all_concepts, prerequisite_edges);
    
    // Filter by user mastery
    filtered_path = [];
    for concept in path {
        mastery = get_user_mastery(user_id, concept.id);
        if (mastery.proficiency_score < 0.8) {
            filtered_path += concept;
        }
    }
    
    return filtered_path;
}
```

### Input/Output Examples

**Input**:
```json
{
  "user_id": "user_123",
  "action": "plan_next_lesson"
}
```

**Output**:
```json
{
  "lesson_id": "lesson_456",
  "title": "Introduction to Walkers",
  "reason": "Prerequisites met, mastery score suggests readiness",
  "estimated_time": 15
}
```

---

## 🤖 Agent 2: Quiz Generator Agent

### Purpose
Creates adaptive quizzes using byLLM based on lesson content, user's mastery level, and learning objectives.

### Walker: `quiz_generator`

### Responsibilities
1. Generate quiz questions from lesson material
2. Adjust difficulty based on user mastery
3. Create multiple question types (MCQ, coding, free-text)
4. Ensure alignment with learning objectives

### OSP Graph Usage
- **Reads**: `lesson` nodes for content
- **Reads**: `mastery` nodes for difficulty adjustment
- **Creates**: `quiz` nodes

### byLLM Integration
**Type**: Generative

**Use Cases**:
1. Generate quiz questions from lesson content
2. Create explanations for concepts
3. Generate coding exercises

### Methods

#### `generate_quiz(lesson_id: string, user_id: string) -> Quiz`
```jac
walker generate_quiz {
    has lesson_id, user_id;
    
    // Get lesson content
    lesson = spawn here --> node::lesson[lesson_id];
    
    // Get user's mastery for related concepts
    concepts = spawn lesson --> node::concept[covers];
    user = spawn here --> node::user[user_id];
    
    avg_mastery = 0.0;
    for concept in concepts {
        mastery = spawn user --> node::mastery[concept_id == concept.id];
        avg_mastery += mastery.proficiency_score;
    }
    avg_mastery /= concepts.length;
    
    // Determine difficulty
    if (avg_mastery < 0.3) {
        difficulty = 1; // Beginner
    } else if (avg_mastery < 0.6) {
        difficulty = 2; // Intermediate
    } else {
        difficulty = 3; // Advanced
    }
    
    // Generate questions using byLLM
    quiz_data = byllm.generate(
        prompt="Generate a {difficulty} level quiz about: {lesson.content}
                Topics: {concepts.names}
                Include: 5 multiple choice, 2 free-text, 1 coding exercise
                Format: JSON with questions, options, correct answers, explanations",
        model="gpt-4",
        temperature=0.7
    );
    
    // Create quiz node
    quiz = spawn here --> node::quiz;
    quiz.lesson_id = lesson_id;
    quiz.difficulty = difficulty;
    quiz.questions = quiz_data.questions;
    quiz.created_at = now();
    
    return quiz;
}
```

#### `generate_explanation(concept_id: string, user_level: string) -> string`
```jac
walker generate_explanation {
    has concept_id, user_level;
    
    concept = spawn here --> node::concept[concept_id];
    
    explanation = byllm.generate(
        prompt="Explain '{concept.name}' in Jaseci for a {user_level} level learner.
                Include: definition, examples, common use cases, code snippets.
                Make it clear and engaging.",
        model="gpt-4"
    );
    
    return explanation;
}
```

#### `create_coding_exercise(topic: string, difficulty: int) -> Exercise`
```jac
walker create_coding_exercise {
    has topic, difficulty;
    
    exercise = byllm.generate(
        prompt="Create a {difficulty} level Jaseci coding exercise on '{topic}'.
                Include: problem description, starter code template, 
                test cases (input/output), hints.
                Format: JSON",
        model="gpt-4"
    );
    
    return exercise;
}
```

### Input/Output Examples

**Input**:
```json
{
  "lesson_id": "lesson_456",
  "user_id": "user_123"
}
```

**Output**:
```json
{
  "quiz_id": "quiz_789",
  "difficulty": 2,
  "questions": [
    {
      "type": "multiple_choice",
      "question": "What is a walker in Jaseci?",
      "options": ["A node type", "A traversal mechanism", "A data structure", "An API"],
      "correct": 1,
      "explanation": "Walkers are used to traverse and manipulate the graph..."
    },
    {
      "type": "free_text",
      "question": "Explain the difference between nodes and walkers.",
      "max_score": 10
    },
    {
      "type": "coding",
      "question": "Write a walker that counts all nodes in a graph.",
      "starter_code": "walker count_nodes {\n    // Your code here\n}",
      "test_cases": [...]
    }
  ]
}
```

---

## 🤖 Agent 3: Answer Evaluator Agent

### Purpose
Evaluates user answers (especially free-text and coding) using byLLM and updates mastery graph accordingly.

### Walker: `answer_evaluator`

### Responsibilities
1. Evaluate free-text answers
2. Score coding exercises
3. Update mastery nodes in OSP graph
4. Generate detailed feedback
5. Trigger revision recommendations

### OSP Graph Usage
- **Updates**: `mastery` nodes (proficiency_score, attempts_count, streak)
- **Creates**: `attempted` edges (user → quiz)

### byLLM Integration
**Type**: Analytical

**Use Cases**:
1. Evaluate free-text answers for correctness and quality
2. Score coding exercises
3. Generate personalized feedback

### Methods

#### `evaluate_answer(question_id: string, user_answer: string, correct_answer: string) -> Evaluation`
```jac
walker evaluate_answer {
    has question_id, user_answer, correct_answer;
    
    // Get question context
    question = get_question(question_id);
    
    // Evaluate using byLLM
    evaluation = byllm.analyze(
        prompt="Evaluate this answer for correctness and quality:
                User Answer: '{user_answer}'
                Correct Answer: '{correct_answer}'
                Question: '{question.text}'
                Context: '{question.context}'
                
                Provide:
                1. Score (0.0 to 1.0)
                2. Correctness (true/false)
                3. Detailed feedback
                4. Strengths identified
                5. Areas for improvement
                
                Format: JSON",
        model="gpt-4"
    );
    
    return {
        "score": evaluation.score,
        "correct": evaluation.correct,
        "feedback": evaluation.feedback,
        "strengths": evaluation.strengths,
        "improvements": evaluation.improvements
    };
}
```

#### `update_mastery(user_id: string, concept_id: string, score: float) -> void`
```jac
walker update_mastery {
    has user_id, concept_id, score;
    
    user = spawn here --> node::user[user_id];
    concept = spawn here --> node::concept[concept_id];
    
    // Find or create mastery node
    mastery = spawn user --> node::mastery[concept_id == concept_id];
    
    if (!mastery) {
        mastery = spawn here --> node::mastery;
        mastery.user_id = user_id;
        mastery.concept_id = concept_id;
        mastery.proficiency_score = 0.0;
        mastery.attempts_count = 0;
        mastery.streak = 0;
        
        // Create edges
        spawn user --> node::mastery[mastery];
        spawn mastery --> node::concept[concept];
    }
    
    // Update mastery
    mastery.attempts_count += 1;
    
    // Update proficiency (weighted average)
    old_score = mastery.proficiency_score;
    mastery.proficiency_score = (old_score * 0.7) + (score * 0.3);
    
    // Update streak
    if (score >= 0.7) {
        mastery.streak += 1;
    } else {
        mastery.streak = 0;
    }
    
    mastery.last_updated = now();
}
```

#### `evaluate_quiz(quiz_id: string, user_id: string, answers: dict) -> QuizResult`
```jac
walker evaluate_quiz {
    has quiz_id, user_id, answers;
    
    quiz = spawn here --> node::quiz[quiz_id];
    user = spawn here --> node::user[user_id];
    
    total_score = 0.0;
    max_score = 0.0;
    feedback_items = [];
    
    for question in quiz.questions {
        user_answer = answers[question.id];
        max_score += question.max_score;
        
        if (question.type == "multiple_choice") {
            if (user_answer == question.correct_answer) {
                total_score += question.max_score;
            }
        } else if (question.type == "free_text") {
            evaluation = spawn here walker::answer_evaluator::evaluate_answer(
                question_id=question.id,
                user_answer=user_answer,
                correct_answer=question.correct_answer
            );
            total_score += evaluation.score * question.max_score;
            feedback_items += evaluation;
        } else if (question.type == "coding") {
            code_score = evaluate_code(user_answer, question.test_cases);
            total_score += code_score * question.max_score;
        }
        
        // Update mastery for related concepts
        concepts = get_question_concepts(question.id);
        for concept in concepts {
            spawn here walker::answer_evaluator::update_mastery(
                user_id=user_id,
                concept_id=concept.id,
                score=evaluation.score
            );
        }
    }
    
    final_score = total_score / max_score;
    
    // Create attempted edge
    spawn user --> node::quiz[quiz_id] with edge::attempted;
    edge.score = final_score;
    edge.attempted_at = now();
    
    return {
        "score": final_score,
        "total_questions": quiz.questions.length,
        "feedback": feedback_items
    };
}
```

### Input/Output Examples

**Input**:
```json
{
  "quiz_id": "quiz_789",
  "user_id": "user_123",
  "answers": {
    "q1": 1,
    "q2": "Walkers traverse graphs, nodes are data structures...",
    "q3": "walker count_nodes {\n    has count = 0;\n    ...\n}"
  }
}
```

**Output**:
```json
{
  "score": 0.85,
  "total_questions": 3,
  "feedback": [
    {
      "question_id": "q1",
      "correct": true,
      "score": 1.0
    },
    {
      "question_id": "q2",
      "correct": true,
      "score": 0.9,
      "feedback": "Excellent explanation! You correctly identified...",
      "strengths": ["Clear understanding", "Good examples"],
      "improvements": ["Could mention edge traversal"]
    },
    {
      "question_id": "q3",
      "correct": true,
      "score": 0.7,
      "feedback": "Code works but could be optimized...",
      "test_results": {"passed": 3, "total": 4}
    }
  ],
  "mastery_updated": ["concept_walkers", "concept_nodes"]
}
```

---

## 🤖 Agent 4: Progress Tracker Agent

### Purpose
Records and aggregates user progress data. No byLLM usage - pure data aggregation.

### Walker: `progress_tracker`

### Responsibilities
1. Record lesson completions
2. Track quiz attempts and scores
3. Update user statistics
4. Maintain progress history

### OSP Graph Usage
- **Creates**: `completed` edges (user → lesson)
- **Creates**: `attempted` edges (user → quiz)
- **Updates**: `user` node statistics

### Methods

#### `record_lesson_completion(user_id: string, lesson_id: string, score: float) -> void`
```jac
walker record_lesson_completion {
    has user_id, lesson_id, score;
    
    user = spawn here --> node::user[user_id];
    lesson = spawn here --> node::lesson[lesson_id];
    
    // Create completed edge
    spawn user --> node::lesson[lesson_id] with edge::completed;
    edge.completed_at = now();
    edge.score = score;
    
    // Update user stats
    user.total_lessons_completed += 1;
    user.average_lesson_score = calculate_average(user);
}
```

#### `record_quiz_attempt(user_id: string, quiz_id: string, score: float, time_taken: int) -> void`
```jac
walker record_quiz_attempt {
    has user_id, quiz_id, score, time_taken;
    
    user = spawn here --> node::user[user_id];
    quiz = spawn here --> node::quiz[quiz_id];
    
    // Create attempted edge
    spawn user --> node::quiz[quiz_id] with edge::attempted;
    edge.score = score;
    edge.time_taken = time_taken;
    edge.attempted_at = now();
}
```

#### `get_progress_summary(user_id: string) -> ProgressSummary`
```jac
walker get_progress_summary {
    has user_id;
    
    user = spawn here --> node::user[user_id];
    
    // Count completed lessons
    completed_lessons = spawn user --> node::lesson[completed];
    lessons_count = completed_lessons.length;
    
    // Get quiz attempts
    quiz_attempts = spawn user --> node::quiz[attempted];
    avg_quiz_score = calculate_average(quiz_attempts);
    
    // Get mastery stats
    masteries = spawn user --> node::mastery;
    mastered_concepts = masteries[proficiency_score >= 0.8].length;
    total_concepts = spawn here --> node::concept.length;
    
    return {
        "lessons_completed": lessons_count,
        "average_quiz_score": avg_quiz_score,
        "mastered_concepts": mastered_concepts,
        "total_concepts": total_concepts,
        "mastery_percentage": (mastered_concepts / total_concepts) * 100,
        "current_streak": calculate_streak(user)
    };
}
```

---

## 🤖 Agent 5: Skill Analyzer Agent

### Purpose
Analyzes OSP graph to generate skill map data and identify weak areas for visualization.

### Walker: `skill_analyzer`

### Responsibilities
1. Traverse mastery graph to calculate skill scores
2. Identify clusters of strong/weak concepts
3. Generate skill map data for visualization
4. Detect learning patterns

### OSP Graph Usage
- **Traverses**: Entire mastery graph
- **Analyzes**: Concept relationships and clusters
- **Calculates**: Proficiency scores and patterns

### byLLM Integration
**Type**: Analytical

**Use Cases**:
1. Analyze graph patterns to identify learning gaps
2. Generate insights from mastery data
3. Detect unusual learning patterns

### Methods

#### `analyze_mastery_graph(user_id: string) -> SkillScores`
```jac
walker analyze_mastery_graph {
    has user_id;
    
    user = spawn here --> node::user[user_id];
    masteries = spawn user --> node::mastery;
    
    skill_scores = {};
    
    for mastery in masteries {
        concept = spawn mastery --> node::concept;
        skill_scores[concept.id] = {
            "name": concept.name,
            "proficiency": mastery.proficiency_score,
            "category": concept.category,
            "attempts": mastery.attempts_count,
            "streak": mastery.streak
        };
    }
    
    return skill_scores;
}
```

#### `generate_skill_map(user_id: string) -> SkillMapData`
```jac
walker generate_skill_map {
    has user_id;
    
    skill_scores = spawn here walker::skill_analyzer::analyze_mastery_graph(user_id);
    
    // Build graph structure for visualization
    nodes = [];
    edges = [];
    
    for concept_id, score_data in skill_scores {
        nodes += {
            "id": concept_id,
            "label": score_data.name,
            "proficiency": score_data.proficiency,
            "category": score_data.category,
            "color": get_color_by_proficiency(score_data.proficiency)
        };
        
        // Add prerequisite edges
        prereqs = spawn here --> node::concept[concept_id] <-- node::concept[prerequisite];
        for prereq in prereqs {
            edges += {
                "from": prereq.id,
                "to": concept_id,
                "type": "prerequisite"
            };
        }
        
        // Add recommendation edges
        recommendations = spawn here --> node::concept[concept_id] --> node::concept[recommends];
        for rec in recommendations {
            edges += {
                "from": concept_id,
                "to": rec.id,
                "type": "recommendation"
            };
        }
    }
    
    return {
        "nodes": nodes,
        "edges": edges,
        "summary": {
            "total_concepts": nodes.length,
            "mastered": count(nodes[proficiency >= 0.8]),
            "in_progress": count(nodes[0.3 < proficiency < 0.8]),
            "not_started": count(nodes[proficiency <= 0.3])
        }
    };
}
```

#### `identify_weak_areas(user_id: string) -> WeakAreas`
```jac
walker identify_weak_areas {
    has user_id;
    
    skill_scores = spawn here walker::skill_analyzer::analyze_mastery_graph(user_id);
    
    weak_concepts = [];
    for concept_id, score_data in skill_scores {
        if (score_data.proficiency < 0.6) {
            // Check if prerequisites are strong (should be doing better)
            prereqs = get_prerequisites(concept_id);
            prereq_scores = [];
            for prereq in prereqs {
                prereq_scores += skill_scores[prereq.id].proficiency;
            }
            
            if (average(prereq_scores) > 0.7) {
                // Prerequisites are strong but this concept is weak
                weak_concepts += {
                    "concept": concept_id,
                    "proficiency": score_data.proficiency,
                    "prereq_avg": average(prereq_scores),
                    "gap": average(prereq_scores) - score_data.proficiency,
                    "recommendation": "Focus on this concept - prerequisites suggest readiness"
                };
            }
        }
    }
    
    // Use byLLM to analyze patterns
    insights = byllm.analyze(
        prompt="Analyze these weak areas: {weak_concepts}
                Identify patterns, suggest learning strategies.
                Format: JSON with insights and recommendations",
        model="gpt-4"
    );
    
    return {
        "weak_areas": weak_concepts,
        "insights": insights,
        "priority": sort_by(weak_concepts, "gap", desc=true)
    };
}
```

---

## 🔄 Agent Interaction Patterns

### Pattern 1: Lesson Completion Flow
```
User completes lesson
  ↓
Progress Tracker records completion
  ↓
Learning Planner checks if new content unlocked
  ↓
Skill Analyzer updates skill map
  ↓
Learning Planner recommends next lesson
```

### Pattern 2: Quiz Flow
```
User requests quiz
  ↓
Quiz Generator creates quiz (uses byLLM)
  ↓
User submits answers
  ↓
Answer Evaluator evaluates (uses byLLM)
  ↓
Answer Evaluator updates mastery graph
  ↓
Progress Tracker records attempt
  ↓
Skill Analyzer recalculates skills
  ↓
Learning Planner adjusts recommendations
```

### Pattern 3: Skill Map View
```
User views skill map
  ↓
Skill Analyzer traverses mastery graph
  ↓
Skill Analyzer generates visualization data
  ↓
Skill Analyzer identifies weak areas (uses byLLM)
  ↓
Learning Planner generates recommendations
  ↓
Frontend displays interactive map
```

---

## 📝 Implementation Notes

1. **Error Handling**: All walkers should handle missing nodes gracefully
2. **Performance**: Cache frequently accessed graph data
3. **Logging**: Log all agent decisions for debugging
4. **Testing**: Unit test each walker independently
5. **Documentation**: Document all walker parameters and return types

