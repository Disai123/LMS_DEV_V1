import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiX, FiCheck, FiClock, FiAlertCircle, FiExternalLink, FiSend } from 'react-icons/fi';
import internshipService from '../../services/internshipService';

const STATUS_CONFIG = {
  pending: {
    label: 'Under Review',
    icon: <FiClock className="w-4 h-4" />,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400'
  },
  approved: {
    label: 'Approved ✓',
    icon: <FiCheck className="w-4 h-4" />,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-400'
  },
  rejected: {
    label: 'Revision Needed',
    icon: <FiAlertCircle className="w-4 h-4" />,
    classes: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-400'
  },
  revision_requested: {
    label: 'Revision Requested',
    icon: <FiAlertCircle className="w-4 h-4" />,
    classes: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-400'
  }
};

const EMPTY_FORM = { github_url: '', drive_url: '', documentation_url: '', description: '' };

const InternshipSubmissionModal = ({ isOpen, onClose, internship, onSuccess }) => {
  const [mode, setMode] = useState('loading'); // 'loading' | 'form' | 'view' | 'edit'
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch existing submission whenever modal opens
  useEffect(() => {
    if (!isOpen || !internship?.id) return;
    setMode('loading');
    setSuccessMsg('');

    internshipService.getMySubmissionForInternship(internship.id)
      .then(res => {
        const sub = res.data?.data;
        if (sub) {
          setExisting(sub);
          setFormData({
            github_url: sub.github_url || '',
            drive_url: sub.drive_url || '',
            documentation_url: sub.documentation_url || '',
            description: sub.description || ''
          });
          setMode('view');
        } else {
          setExisting(null);
          setFormData(EMPTY_FORM);
          setMode('form');
        }
      })
      .catch(() => {
        setExisting(null);
        setFormData(EMPTY_FORM);
        setMode('form');
      });
  }, [isOpen, internship?.id]);

  if (!isOpen) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error('Please add a description of your work.');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');

      if (existing) {
        // Update existing submission
        await internshipService.updateSubmission(existing.id, formData);
        toast.success('Submission updated! Admin will re-evaluate your work.');
        setSuccessMsg('Your submission has been updated and sent for re-evaluation.');
      } else {
        // First time submit
        const res = await internshipService.getMySubmissionForInternship(internship.id)
          .then(r => r.data?.data)
          .catch(() => null);

        if (res) {
          // Shouldn't happen, but guard
          await internshipService.updateSubmission(res.id, formData);
          toast.success('Submission updated!');
          setSuccessMsg('Your submission has been updated.');
        } else {
          const { default: axios } = await import('axios');
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          await axios.post(`${API_BASE}/api/internships/submissions`, {
            internship_id: internship.id,
            internship_title: internship.title,
            ...formData
          }, { headers: { Authorization: `Bearer ${token}` } });
          toast.success('Work submitted successfully!');
          setSuccessMsg('Your work has been submitted for review. Points will be awarded once approved.');
        }
      }

      // Refresh the existing entry
      const updated = await internshipService.getMySubmissionForInternship(internship.id)
        .then(r => r.data?.data).catch(() => null);
      if (updated) {
        setExisting(updated);
        setFormData({
          github_url: updated.github_url || '',
          drive_url: updated.drive_url || '',
          documentation_url: updated.documentation_url || '',
          description: updated.description || ''
        });
      }
      setMode('view');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit = existing && existing.status !== 'approved';
  const statusCfg = existing ? (STATUS_CONFIG[existing.status] || STATUS_CONFIG.pending) : null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'view' ? 'My Submission' : mode === 'edit' ? 'Edit Submission' : 'Submit Your Work'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{internship?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Loading */}
          {mode === 'loading' && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          )}

          {/* ── VIEW MODE ── */}
          {mode === 'view' && existing && (
            <>
              {/* Success message after edit */}
              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
                  <FiCheck className="w-4 h-4 flex-shrink-0" /> {successMsg}
                </div>
              )}

              {/* Status Banner */}
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${statusCfg.classes}`}>
                <div className={`w-2 h-2 rounded-full ${statusCfg.dot} flex-shrink-0`} />
                {statusCfg.icon}
                <span className="font-bold text-sm">{statusCfg.label}</span>
                {existing.points_awarded > 0 && (
                  <span className="ml-auto font-black text-emerald-600">+{existing.points_awarded} pts</span>
                )}
              </div>

              {/* Admin Feedback */}
              {existing.admin_feedback && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin Feedback</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{existing.admin_feedback}</p>
                </div>
              )}

              {/* Submitted Links */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Details</p>

                {[
                  { label: 'GitHub Repository', val: existing.github_url },
                  { label: 'Project / Demo URL', val: existing.drive_url },
                  { label: 'Documentation / Report', val: existing.documentation_url },
                ].map(({ label, val }) => val && (
                  <div key={label} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                      <p className="text-sm text-indigo-600 font-medium truncate max-w-xs mt-0.5">{val}</p>
                    </div>
                    <a href={val} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition-colors">
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}

                {existing.description && (
                  <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{existing.description}</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 text-right">
                Submitted: {new Date(existing.submitted_at).toLocaleString()}
              </p>

              {/* Edit button */}
              {canEdit && (
                <button
                  onClick={() => setMode('edit')}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
                >
                  <FiEdit2 className="w-4 h-4" /> Edit & Re-submit
                </button>
              )}

              {existing.status === 'approved' && (
                <div className="text-center text-xs text-slate-400 pt-1">
                  ✅ Approved submissions cannot be edited.
                </div>
              )}
            </>
          )}

          {/* ── FORM MODE (new submit or edit) ── */}
          {(mode === 'form' || mode === 'edit') && (
            <>
              {mode === 'edit' && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm font-medium">
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  Editing will reset status to <strong className="ml-1">Pending</strong> and trigger re-evaluation.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { name: 'github_url', label: 'GitHub Repository URL', placeholder: 'https://github.com/yourusername/repo', type: 'url' },
                  { name: 'drive_url', label: 'Project / Demo URL', placeholder: 'https://your-demo.com', type: 'url' },
                  { name: 'documentation_url', label: 'Documentation / Report URL', placeholder: 'Google Drive, Notion, or PDF link', type: 'url' },
                ].map(({ name, label, placeholder, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Brief Description of Work <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What did you build? What challenges did you solve? What are the key outcomes?"
                    className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm resize-vertical transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => mode === 'edit' ? setMode('view') : onClose()}
                    className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold text-sm transition-colors"
                  >
                    {mode === 'edit' ? 'Back' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><FiSend className="w-4 h-4" /> {mode === 'edit' ? 'Re-submit for Review' : 'Submit for Review'}</>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipSubmissionModal;
