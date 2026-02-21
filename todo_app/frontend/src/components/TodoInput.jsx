import { useState } from 'react'

function TodoInput({ onAdd }) {
    const [title, setTitle] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title.trim()) return
        onAdd(title.trim())
        setTitle('')
    }

    return (
        <form className="todo-input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task..."
                className="todo-input"
            />
            <button type="submit" className="add-btn" aria-label="Add task">
                +
            </button>
        </form>
    )
}

export default TodoInput
