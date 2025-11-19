/**
 * Quiz Node Model
 * Represents a generated quiz
 */

node quiz {
    has quiz_id;
    has lesson_id;
    has difficulty;  // 1-5
    has questions;  // JSON array
    has created_at;
}

