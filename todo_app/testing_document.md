# Testing Document
## Project: Minimalist To-Do Application

### 1. Introduction
This document outlines the testing strategy for the To-Do application, covering both unit testing (via manual verification as requested) and integration testing.

### 2. Testing Environment
- **Browser**: Google Chrome / Microsoft Edge (Latest Version)
- **API Tool**: Swagger UI (Built-in) or Postman
- **Database**: execution environment (SQLite)

### 3. Backend API Testing (Manual Verification)
Access the interactive API docs at: `http://localhost:8000/docs`

#### **Test Case 1: Create a Todo**
- **Endpoint**: `POST /todos/`
- **Input**: `{"title": "Test Task", "description": "Testing creation", "completed": false}`
- **Expected Result**: 200 OK, returns created object with an ID.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 2: Retrieve Todos**
- **Endpoint**: `GET /todos/`
- **Expected Result**: 200 OK, returns a list containing "Test Task".
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 3: Update Todo Status**
- **Endpoint**: `PUT /todos/{id}`
- **Input**: `{"completed": true}`
- **Expected Result**: 200 OK, `completed` field is now `true`.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 4: Delete Todo**
- **Endpoint**: `DELETE /todos/{id}`
- **Expected Result**: 200 OK, returns deleted object.
- **Status**: [ ] Pass / [ ] Fail

### 4. Frontend UI Testing

#### **Test Case 5: Add Task Interaction**
- **Action**: Enter "Buy Groceries" in input field and press Enter/Click Plus button.
- **Expected Result**: Input clears, new task appears at the bottom of the list.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 6: Input Validation**
- **Action**: Try to add an empty task.
- **Expected Result**: No task is added, no error crash.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 7: Toggle Completion**
- **Action**: Click the circle icon on a task.
- **Expected Result**: Icon changes to checkmark, text gets strikethrough style, task fades slightly.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 8: Delete Task**
- **Action**: Click the trash icon.
- **Expected Result**: Task is removed from the list immediately.
- **Status**: [ ] Pass / [ ] Fail

#### **Test Case 9: Persistence**
- **Action**: Refresh the page after adding/modifying tasks.
- **Expected Result**: All tasks remain in their last state.
- **Status**: [ ] Pass / [ ] Fail

### 5. Responsiveness Testing
- **Desktop (1920x1080)**: Verify layout is centered and readable.
- **Mobile (375x812)**: Verify input and list items fit the screen width, buttons are tappable.
