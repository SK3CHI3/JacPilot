# API Migration Guide

## Frontend Updated for New Jaclang API

The frontend has been updated to use the new jaclang/jac_cloud API format.

### Changes Made

1. **Updated `frontend/src/services/jacClient.ts`**:
   - Changed endpoint from `/js/walker_spawn` to `/walker/{walker_name}`
   - Updated request format to send context directly as request body
   - Added support for node-specific walker execution via `/walker/{walker_name}/{node_id}`
   - Improved error handling for new API response format

### API Format Comparison

**Old Jaseci Format:**
```typescript
POST /js/walker_spawn
{
  "walker": "learning_planner",
  "ctx": {
    "user_id": "user123",
    "action": "plan_next_lesson"
  }
}
```

**New Jaclang Format:**
```typescript
POST /walker/learning_planner
{
  "user_id": "user123",
  "action": "plan_next_lesson"
}
```

### Response Format

The new API may return data in different formats:
- Direct data object
- Object with `report` field (for compatibility)
- Error objects with `error` or `detail` fields

The updated client handles all these formats automatically.

### Testing

To test the API:
1. Start the backend server: `jac serve jac/main.jac --host 0.0.0.0 --port 8000`
2. Visit `http://localhost:8000/docs` for interactive API documentation
3. Test walker endpoints using the Swagger UI

### Next Steps

- Ensure all walkers are properly loaded in the server
- Test each walker endpoint individually
- Update any hardcoded API calls in components if needed


