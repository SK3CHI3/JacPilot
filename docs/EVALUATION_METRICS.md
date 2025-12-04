# Evaluation Metrics & Measurement Plan

## Overview

This document outlines the evaluation metrics and measurement methods for JacPilot, as required by the hackathon guidelines. The metrics focus on recommendation relevance, user satisfaction, and precision of identified weak areas.

## 1. Recommendation Relevance

### Metric Definition
**Percentage of recommended lessons that users actually complete**

This measures how well the `learning_planner` agent recommends lessons that users find relevant and complete.

### Measurement Method

#### Data Collection
- Track all `learning_planner` recommendations via `user_lesson_progress` table
- Record: `recommended_lesson_id`, `recommended_at`, `user_id`
- Track completion: `completed_at` timestamp

#### Calculation
```sql
-- Recommendation Relevance Rate
SELECT 
    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as relevance_rate
FROM learning_recommendations
WHERE recommended_at >= NOW() - INTERVAL '30 days';
```

#### Target Metrics
- **Excellent**: > 70% of recommendations completed
- **Good**: 50-70% of recommendations completed
- **Needs Improvement**: < 50% of recommendations completed

#### Implementation
Add tracking to `learning_planner` walker:
```jac
// In learning_planner walker
can record_recommendation {
    // Log recommendation to Supabase
    recommendation = {
        "user_id": user_id,
        "recommended_lesson_id": next_lesson_id,
        "recommended_at": std.time_now(),
        "reason": reason
    };
    // Store in learning_recommendations table
}
```

### Qualitative Evaluation
- **User Feedback**: Survey users on recommendation relevance (1-5 scale)
- **Completion Time**: Measure time between recommendation and completion
- **Skip Rate**: Track how often users skip recommended lessons

---

## 2. User Satisfaction

### Metric Definition
**Overall user satisfaction with the learning experience**

Measured through multiple indicators: quiz scores, lesson completion rates, and user engagement.

### Measurement Methods

#### 2.1 Average Quiz Scores
**Metric**: Mean quiz score across all attempts

**Data Source**: `quiz_attempts` table
```sql
SELECT 
    AVG(score) as avg_quiz_score,
    COUNT(*) as total_attempts,
    COUNT(DISTINCT user_id) as active_users
FROM quiz_attempts
WHERE attempted_at >= NOW() - INTERVAL '30 days';
```

**Target**: 
- **Excellent**: > 0.75 (75% average score)
- **Good**: 0.60-0.75
- **Needs Improvement**: < 0.60

#### 2.2 Lesson Completion Rate
**Metric**: Percentage of started lessons that are completed

**Data Source**: `user_lesson_progress` table
```sql
SELECT 
    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) * 100.0 / 
    COUNT(*) as completion_rate
FROM user_lesson_progress
WHERE updated_at >= NOW() - INTERVAL '30 days';
```

**Target**:
- **Excellent**: > 80% completion rate
- **Good**: 60-80%
- **Needs Improvement**: < 60%

#### 2.3 User Engagement
**Metric**: Active users, session duration, return rate

**Data Source**: User activity logs
```sql
-- Daily Active Users
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT user_id) as daily_active_users
FROM user_sessions
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at);

-- Average Session Duration
SELECT 
    AVG(EXTRACT(EPOCH FROM (ended_at - started_at))) / 60 as avg_session_minutes
FROM user_sessions
WHERE ended_at IS NOT NULL;
```

**Target**:
- **Excellent**: > 20 min average session, > 70% return rate
- **Good**: 10-20 min, 50-70% return rate
- **Needs Improvement**: < 10 min, < 50% return rate

#### 2.4 User Feedback Score
**Metric**: Explicit user ratings (if implemented)

**Data Source**: User feedback table
```sql
SELECT 
    AVG(rating) as avg_rating,
    COUNT(*) as total_feedback
FROM user_feedback
WHERE created_at >= NOW() - INTERVAL '30 days';
```

**Target**: > 4.0 / 5.0 average rating

---

## 3. Precision of Weak Area Identification

### Metric Definition
**Accuracy of `skill_analyzer` in identifying concepts that users actually struggle with**

This measures how well the system identifies weak areas that correlate with actual poor performance.

### Measurement Method

#### Data Collection
1. **Identified Weak Areas**: From `skill_analyzer.identify_weak_areas()`
   - Records: `concept_id`, `proficiency_score`, `gap`, `recommendation`
   - Stored in: `identified_weak_areas` table

2. **Actual Performance**: From quiz attempts and lesson performance
   - Quiz scores per concept (via `quiz_attempts` + `concept` mapping)
   - Lesson completion scores per concept

#### Calculation

**Precision**: Of all identified weak areas, how many actually show poor performance?
```sql
-- Precision of Weak Area Identification
WITH identified_weak AS (
    SELECT concept_id, identified_at
    FROM identified_weak_areas
    WHERE identified_at >= NOW() - INTERVAL '30 days'
),
actual_performance AS (
    SELECT 
        lc.concept_id,
        AVG(qa.score) as avg_quiz_score,
        AVG(ulp.score) as avg_lesson_score
    FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN lesson_concepts lc ON lc.lesson_id = q.lesson_id
    LEFT JOIN user_lesson_progress ulp ON ulp.lesson_id = q.lesson_id
    WHERE qa.attempted_at >= NOW() - INTERVAL '30 days'
    GROUP BY lc.concept_id
)
SELECT 
    COUNT(CASE WHEN ap.avg_quiz_score < 0.6 OR ap.avg_lesson_score < 0.7 THEN 1 END) * 100.0 /
    COUNT(*) as precision_rate
FROM identified_weak iw
JOIN actual_performance ap ON ap.concept_id = iw.concept_id;
```

**Recall**: Of all actual weak areas, how many were identified?
```sql
-- Recall of Weak Area Identification
WITH actual_weak AS (
    SELECT DISTINCT lc.concept_id
    FROM quiz_attempts qa
    JOIN quizzes q ON q.id = qa.quiz_id
    JOIN lesson_concepts lc ON lc.lesson_id = q.lesson_id
    WHERE qa.score < 0.6
    AND qa.attempted_at >= NOW() - INTERVAL '30 days'
),
identified_weak AS (
    SELECT concept_id
    FROM identified_weak_areas
    WHERE identified_at >= NOW() - INTERVAL '30 days'
)
SELECT 
    COUNT(CASE WHEN iw.concept_id IS NOT NULL THEN 1 END) * 100.0 /
    COUNT(*) as recall_rate
FROM actual_weak aw
LEFT JOIN identified_weak iw ON iw.concept_id = aw.concept_id;
```

#### Target Metrics
- **Precision**: > 0.75 (75% of identified weak areas are actually weak)
- **Recall**: > 0.70 (70% of actual weak areas are identified)
- **F1 Score**: > 0.72 (harmonic mean of precision and recall)

#### Implementation
Add tracking to `skill_analyzer` walker:
```jac
// In skill_analyzer walker
can identify_weak_areas {
    // ... existing logic ...
    
    // Store identified weak areas
    for weak_concept in weak_concepts {
        record = {
            "user_id": user_id,
            "concept_id": weak_concept.concept_id,
            "proficiency": weak_concept.proficiency,
            "gap": weak_concept.gap,
            "identified_at": std.time_now()
        };
        // Store in identified_weak_areas table
    }
}
```

---

## 4. Additional Metrics

### 4.1 Quiz Quality
**Metric**: User feedback on quiz questions (relevance, clarity, difficulty)

**Measurement**: Track user interactions with quiz questions
- Time spent per question
- Number of attempts before correct answer
- User-reported difficulty vs. system-calculated difficulty

### 4.2 Learning Path Efficiency
**Metric**: Time to mastery for concepts

**Measurement**: 
- Track time from first lesson on concept to mastery (proficiency_score >= 0.8)
- Compare recommended path vs. actual path taken

### 4.3 Adaptive Difficulty Accuracy
**Metric**: How well quiz difficulty matches user ability

**Measurement**:
- Compare predicted difficulty (from mastery) vs. actual quiz performance
- Target: Quiz scores should be in 60-80% range (not too easy, not too hard)

---

## Evaluation Plan

### Weekly Evaluation
1. **Automated Reports**: Run SQL queries to calculate metrics
2. **Dashboard**: Display key metrics in admin dashboard
3. **Alerts**: Flag metrics below thresholds

### Monthly Review
1. **Analysis**: Deep dive into metrics trends
2. **A/B Testing**: Test improvements to recommendation algorithm
3. **User Surveys**: Collect qualitative feedback

### Quarterly Assessment
1. **Comprehensive Report**: Full evaluation of all metrics
2. **Algorithm Tuning**: Adjust parameters based on results
3. **Feature Improvements**: Prioritize based on metric insights

---

## Data Collection Schema

### New Tables Needed

```sql
-- Track learning recommendations
CREATE TABLE learning_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    recommended_lesson_id UUID REFERENCES lessons(id),
    recommended_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Track identified weak areas
CREATE TABLE identified_weak_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    concept_id UUID REFERENCES concepts(id),
    proficiency_score FLOAT,
    gap FLOAT,
    recommendation TEXT,
    identified_at TIMESTAMP DEFAULT NOW(),
    verified_at TIMESTAMP, -- When user actually shows improvement
    created_at TIMESTAMP DEFAULT NOW()
);

-- Track user sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    duration_minutes INT,
    actions_count INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Track user feedback
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    category TEXT, -- 'recommendation', 'quiz', 'lesson', 'overall'
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Priority

1. **High Priority** (Required for Hackathon):
   - ✅ Recommendation relevance tracking
   - ✅ Quiz score aggregation
   - ✅ Lesson completion rate
   - ✅ Weak area identification precision

2. **Medium Priority** (Nice to Have):
   - User session tracking
   - User feedback collection
   - Learning path efficiency

3. **Low Priority** (Future Enhancement):
   - A/B testing framework
   - Advanced analytics dashboard
   - Predictive modeling

---

## Success Criteria

### Minimum Viable Metrics (Hackathon)
- ✅ Recommendation relevance: > 50%
- ✅ Average quiz score: > 0.60
- ✅ Lesson completion rate: > 60%
- ✅ Weak area precision: > 0.70

### Production-Ready Metrics
- Recommendation relevance: > 70%
- Average quiz score: > 0.75
- Lesson completion rate: > 80%
- Weak area precision: > 0.75, recall > 0.70
- User satisfaction rating: > 4.0/5.0

---

## Notes

- All metrics should be calculated over rolling 30-day windows
- Metrics should account for user experience level (beginner vs. advanced)
- Consider seasonal variations (e.g., exam periods)
- Privacy: Ensure all metrics are aggregated and anonymized

