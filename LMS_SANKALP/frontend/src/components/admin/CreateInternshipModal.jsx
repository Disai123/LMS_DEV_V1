import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import internshipService from '../../services/internshipService'

const CreateInternshipModal = ({ internship, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    logo: '📖',
    duration: '4-12 Weeks',
    mode: 'Online',
    certificate_type: 'Completion',
    domains_offered: [],
    key_features: [],
    outcomes: [],
    highlights: [],
    status: 'active',
    is_published: false,
    start_date: '',
    end_date: ''
  })

  const [domainInput, setDomainInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')
  const [outcomeInput, setOutcomeInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (internship) {
      setFormData({
        ...internship,
        domains_offered: internship.domains_offered || [],
        key_features: internship.key_features || [],
        outcomes: internship.outcomes || [],
        highlights: internship.highlights || [],
        start_date: internship.start_date ? new Date(internship.start_date).toISOString().split('T')[0] : '',
        end_date: internship.end_date ? new Date(internship.end_date).toISOString().split('T')[0] : ''
      })
    }
  }, [internship])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (internship) {
        await internshipService.update(internship.id, formData)
      } else {
        await internshipService.create(formData)
      }
      onSuccess()
    } catch (err) {
      alert('Error saving internship')
    } finally {
      setSubmitting(false)
    }
  }

  const addArrayItem = (field, value, setInput) => {
    if (!value.trim()) return
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }))
    setInput('')
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-strong border border-white/50"
        >
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-secondary"></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                {internship ? 'Edit Internship' : 'Create New Internship'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Define the program details and learning outcomes.</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Basic Info Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Program Title</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. Full Stack Web Development"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Logo / Emoji</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="📖"
                    value={formData.logo}
                    onChange={e => setFormData({ ...formData, logo: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Duration</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="4-12 Weeks"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Mode</label>
                    <select
                      className="input"
                      value={formData.mode}
                      onChange={e => setFormData({ ...formData, mode: e.target.value })}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Status</label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Start Date</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.start_date}
                      onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">End Date</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.end_date}
                      onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea
                  className="input h-32 resize-none"
                  placeholder="Describe the internship program..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Arrays Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Domains */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                  Domains Offered
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add domain..."
                    value={domainInput}
                    onChange={e => setDomainInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('domains_offered', domainInput, setDomainInput))}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('domains_offered', domainInput, setDomainInput)}
                    className="btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.domains_offered.map((item, i) => (
                    <span key={i} className="flex items-center gap-2 bg-primary/5 text-primary text-xs font-bold px-3 py-2 rounded-xl border border-primary/10">
                      {item}
                      <button type="button" onClick={() => removeArrayItem('domains_offered', i)} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center text-sm">2</span>
                  Program Highlights
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add highlight..."
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('highlights', highlightInput, setHighlightInput))}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights', highlightInput, setHighlightInput)}
                    className="btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((item, i) => (
                    <span key={i} className="flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-3 py-2 rounded-xl border border-secondary/10">
                      {item}
                      <button type="button" onClick={() => removeArrayItem('highlights', i)} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-sm">3</span>
                  Key Features
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add feature..."
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('key_features', featureInput, setFeatureInput))}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('key_features', featureInput, setFeatureInput)}
                    className="btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.key_features.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      <button type="button" onClick={() => removeArrayItem('key_features', i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                  Learning Outcomes
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input flex-1"
                    placeholder="Add outcome..."
                    value={outcomeInput}
                    onChange={e => setOutcomeInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addArrayItem('outcomes', outcomeInput, setOutcomeInput))}
                  />
                  <button
                    type="button"
                    onClick={() => addArrayItem('outcomes', outcomeInput, setOutcomeInput)}
                    className="btn-secondary w-12 h-12 flex items-center justify-center p-0 rounded-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.outcomes.map((item, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      <button type="button" onClick={() => removeArrayItem('outcomes', i)} className="text-gray-400 hover:text-red-500 px-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>

          <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-slate-50/30">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-slate-500 border-none shadow-none hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary min-w-[160px] shadow-magic hover:shadow-magic-lg"
            >
              {submitting ? 'Saving...' : (internship ? 'Update Program' : 'Create Program')}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CreateInternshipModal
