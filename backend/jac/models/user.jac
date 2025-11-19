/**
 * User Node Model
 * Represents a user in the learning platform
 */

node user {
    has user_id;
    has email;
    has name;
    has total_lessons_completed = 0;
    has average_quiz_score = 0.0;
    has level = 1;
}

