# API Documentation — ToDo App Backend

Base URL: `http://localhost:3000/api`

## Auth

### POST /auth/register
Register a new user.

**Auth required:** No

**Request body**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Success response — 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "c1a2b3-uuid-456",
    "email": "user@example.com",
    "createdAt": "2026-07-29T14:30:00.000Z"
  }
}
```

**Error responses**
- `400 VALIDATION_ERROR` — missing email/password, or email already registered
- `500 SERVER_ERROR`

---

### POST /auth/login
Log in and receive a JWT.

**Auth required:** No

**Request body**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Success response — 200 OK**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "c1a2b3-uuid-456", "email": "user@example.com" }
  }
}
```

**Error responses**
- `401 UNAUTHORIZED` — wrong email or password
- `500 SERVER_ERROR`

Token is valid for 7 days. Send it on subsequent requests as:
```
Authorization: Bearer <token>
```

---

## Todos

All `/todos` routes require `Authorization: Bearer <token>`.

### GET /todos
Returns all todos belonging to the logged-in user, newest first.

**Success response — 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Write API docs",
      "isCompleted": false,
      "deadline": "2026-07-30T23:59:00.000Z",
      "userId": "c1a2b3-uuid-456",
      "createdAt": "2026-07-26T14:30:00.000Z"
    }
  ]
}
```

---

### POST /todos
Create a new todo for the logged-in user.

**Request body**
```json
{
  "title": "Write API docs",
  "deadline": "2026-07-30T23:59:00Z"
}
```
`deadline` is optional.

**Success response — 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Write API docs",
    "isCompleted": false,
    "deadline": "2026-07-30T23:59:00.000Z",
    "userId": "c1a2b3-uuid-456",
    "createdAt": "2026-07-26T14:30:00.000Z"
  }
}
```

**Error responses**
- `400 VALIDATION_ERROR` — title missing, or deadline is in the past
- `500 SERVER_ERROR`

---

### PUT /todos/:id
Update a todo's title, completion status, and/or deadline. All fields optional — only send what changes.

**Request body**
```json
{
  "title": "Write API docs (updated)",
  "isCompleted": true,
  "deadline": "2026-08-01T23:59:00Z"
}
```

**Success response — 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Write API docs (updated)",
    "isCompleted": true,
    "deadline": "2026-08-01T23:59:00.000Z",
    "userId": "c1a2b3-uuid-456",
    "createdAt": "2026-07-26T14:30:00.000Z"
  }
}
```

**Error responses**
- `403 FORBIDDEN` — todo belongs to another user
- `404 NOT_FOUND` — todo does not exist
- `500 SERVER_ERROR`

---

### DELETE /todos/:id
Delete a todo.

**Success response — 200 OK**
```json
{
  "success": true,
  "data": { "message": "Todo deleted successfully" }
}
```

**Error responses**
- `403 FORBIDDEN` — todo belongs to another user
- `404 NOT_FOUND` — todo does not exist
- `500 SERVER_ERROR`

---

## Error format (all endpoints)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": ["optional extra details"]
  }
}
```

## Status codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing/invalid token, or wrong credentials |
| 403 | Forbidden — resource belongs to another user |
| 404 | Not Found |
| 500 | Internal Server Error |
