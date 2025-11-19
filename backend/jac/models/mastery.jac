/**
 * Mastery Node Model
 * Tracks user proficiency for a specific concept
 */

node mastery {
    has mastery_id;
    has user_id;
    has concept_id;
    has proficiency_score = 0.0;  // 0.0 - 1.0
    has last_updated;
    has attempts_count = 0;
    has streak = 0;
}

