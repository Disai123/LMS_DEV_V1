import { useState } from 'react'

const CATEGORIES = ['Personal', 'Work', 'Shopping', 'Health', 'Other']
const PRIORITIES = ['low', 'medium', 'high']

function AddTaskModal({ onClose, onAdd, defaultCategory }) {
    const today = new Date().toISOString().split('T')[0]
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: defaultCategory !== 'All' && defaultCategory !== 'Today'
            ? defaultCategory
            : 'Personal',
        priority: 'medium',
        due_date: '',
    })

    const set = (field, val) => setForm(f => ({ ...f, [field]: val }))

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title.trim()) return
        onAdd(form)
        onClose()
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h3>✨ New Task</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title *</label>
                        <input
                            className="form-input"
                            placeholder="What needs to be done?"
                            value={form.title}
                            onChange={e => set('title', e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Add details (optional)..."
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                className="form-select"
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                className="form-select"
                                value={form.priority}
                                onChange={e => set('priority', e.target.value)}
                            >
                                {PRIORITIES.map(p => (
                                    <option key={p} value={p}>
                                        {p === 'high' ? '🔴 High' : p === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            className="form-input"
                            value={form.due_date}
                            min={today}
                            onChange={e => set('due_date', e.target.value)}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTaskModal
