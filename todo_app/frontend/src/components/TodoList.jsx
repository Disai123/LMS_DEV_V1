import TodoItem from './TodoItem'

function TodoList({ todos, onToggle, onDelete }) {
    if (todos.length === 0) return null  // App.jsx handles empty state

    return (
        <div className="todo-list" style={{ display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={() => onToggle(todo.id, todo.completed)}
                    onDelete={() => onDelete(todo.id)}
                />
            ))}
        </div>
    )
}

export default TodoList
