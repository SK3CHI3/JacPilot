/**
 * Lesson Node Model
 * Represents a lesson in the learning platform
 */

node lesson {
    has lesson_id;
    has title;
    has content;
    has order;
    has estimated_time;  // minutes
    has lesson_type;  // theory, practice, project
}

