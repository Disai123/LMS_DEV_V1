function isOverdue(due_date, completed) {
    if (!due_date || completed) return false
    return new Date(due_date) < new Date(new Date().toDateString())
}

function formatDate(dateStr) {
    if (!dateStr) return null
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function TodoItem({ todo, onToggle, onDelete }) {
    const overdue = isOverdue(todo.due_date, todo.completed)

    return (
        <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            {/* Priority bar */}
            <div className={`priority-bar ${todo.priority || 'medium'}`} />

            {/* Checkbox */}
            <button
                className={`check-btn ${todo.completed ? 'checked' : ''}`}
                onClick={onToggle}
                aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
            >
                {todo.completed ? '✓' : ''}
            </button>

            {/* Task info */}
            <div className="task-info">
                <div className={`task-title ${todo.completed ? 'done' : ''}`}>
                    {todo.title}
                </div>
                <div className="task-meta">
                    <span className={`cat-tag cat-${todo.category || 'Personal'}`}>
                        {todo.category || 'Personal'}
                    </span>
                    {todo.due_date && (
                        <span className={`meta-chip ${overdue ? 'overdue' : ''}`}>
                            📅 {overdue ? '⚠ ' : ''}{formatDate(todo.due_date)}
                        </span>
                    )}
                    {todo.description && (
                        <span className="meta-chip" title={todo.description}>📝</span>
                    )}
                </div>
            </div>

            {/* Delete */}
            <button className="delete-btn" onClick={onDelete} aria-label="Delete">🗑</button>
        </div>
    )
}

export default TodoItem
