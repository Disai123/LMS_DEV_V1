import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiClock, FiCheckCircle, FiXCircle, FiAlertCircle,
  FiGithub, FiGlobe, FiFileText, FiEye, FiEdit2,
  FiAward, FiX, FiSend, FiExternalLink
} from 'react-icons/fi';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import internshipService from '../services/internshipService';
import { toast } from 'react-hot-toast';

/* ─── Status badge config ─────────────────────────────────────── */
const STATUS = {
  pending: {
    bg: 'bg-amber-100', text: 'text-amber-800',
    border: 'border-amber-200', dot: 'bg-amber-400',
    Icon: FiClock, label: 'Pending Review'
  },
  approved: {
    bg: 'bg-emerald-100', text: 'text-emerald-800',
    border: 'border-emerald-200', dot: 'bg-emerald-400',
    Icon: FiCheckCircle, label: 'Approved'
  },
  rejected: {
    bg: 'bg-red-100', text: 'text-red-800',
    border: 'border-red-200', dot: 'bg-red-400',
    Icon: FiXCircle, label: 'Rejected'
  },
  revision_requested: {
    bg: 'bg-orange-100', text: 'text-orange-800',
    border: 'border-orange-200', dot: 'bg-orange-400',
    Icon: FiAlertCircle, label: 'Revision Requested'
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  const { Icon } = cfg;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
      <Icon size={13} />
      {cfg.label}
    </span>
  );
};

/* ─── Edit Modal ──────────────────────────────────────────────── */
const EditModal = ({ submission, onClose, onSaved }) => {
  const [form, setForm] = useState({
    github_url: submission.github_url || '',
    drive_url: submission.drive_url || '',
    documentation_url: submission.documentation_url || '',
    description: submission.description || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.description.trim()) { toast.error('Description is required'); return; }
    setSaving(true);
    try {
      await internshipService.updateSubmission(submission.id, form);
      toast.success('Submission updated! The admin will re-evaluate your work.');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Submission</h2>
            <p className="text-sm text-gray-500 mt-0.5">{submission.internship_title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 font-medium mb-5 flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            Saving will reset status to <strong className="ml-1">Pending Review</strong> and trigger re-evaluation.
          </div>

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
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="What did you build? Key outcomes and achievements..."
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm resize-vertical transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : <><FiSend className="w-4 h-4" /> Re-submit for Review</>
                }
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Detail View Modal ───────────────────────────────────────── */
const DetailModal = ({ submission, onClose, onEdit }) => {
  const cfg = STATUS[submission.status] || STATUS.pending;
  const canEdit = submission.status !== 'approved';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-6 rounded-t-2xl relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors">
            <FiX className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold mb-1">{submission.internship_title}</h2>
          <p className="text-indigo-100 text-sm">Internship Submission</p>
          <div className="mt-3">
            <StatusBadge status={submission.status} />
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Points */}
          {submission.status === 'approved' && submission.points_awarded > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <FiAward className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-emerald-800 font-bold">🎉 {submission.points_awarded} Points Awarded!</p>
                <p className="text-emerald-600 text-xs mt-0.5">Congratulations on completing this internship.</p>
              </div>
            </div>
          )}

          {/* Admin Feedback */}
          {submission.admin_feedback && (
            <div className={`rounded-xl p-4 border ${
              submission.status === 'approved' ? 'bg-emerald-50 border-emerald-200' :
              submission.status === 'rejected' ? 'bg-red-50 border-red-200' :
              'bg-orange-50 border-orange-200'
            }`}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Admin Feedback</p>
              <p className="text-sm text-slate-700 leading-relaxed">{submission.admin_feedback}</p>
            </div>
          )}

          {/* Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted Links</p>
            {[
              { icon: FiGithub, label: 'GitHub Repository', val: submission.github_url },
              { icon: FiGlobe, label: 'Project / Demo', val: submission.drive_url },
              { icon: FiFileText, label: 'Documentation', val: submission.documentation_url },
            ].map(({ icon: Icon, label, val }) => val && (
              <a
                key={label}
                href={val}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
              >
                <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center group-hover:border-indigo-300 transition-colors">
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="text-sm text-indigo-600 truncate">{val}</p>
                </div>
                <FiExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
              </a>
            ))}
          </div>

          {/* Description */}
          {submission.description && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</p>
              <p className="text-sm text-slate-700 leading-relaxed">{submission.description}</p>
            </div>
          )}

          <p className="text-xs text-slate-400 text-right">
            Submitted: {new Date(submission.submitted_at).toLocaleString()}
          </p>

          {/* Edit button */}
          {canEdit && (
            <button
              onClick={() => { onClose(); onEdit(submission); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              <FiEdit2 className="w-4 h-4" /> Edit & Re-submit
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────── */
const MyInternshipSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewSub, setViewSub] = useState(null);
  const [editSub, setEditSub] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await internshipService.getMySubmissions();
      setSubmissions(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  if (loading) return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your submissions...</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-1">My Internship Submissions</h1>
            <p className="text-gray-500">Track status, view feedback, and re-submit your internship work.</p>
          </motion.div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">{error}</div>
          )}

          {/* Stats Row */}
          {submissions.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {['pending', 'approved', 'rejected', 'revision_requested'].map(s => {
                const count = submissions.filter(sub => sub.status === s).length;
                const cfg = STATUS[s];
                return (
                  <div key={s} className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} text-center`}>
                    <p className={`text-2xl font-black ${cfg.text}`}>{count}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${cfg.text} opacity-80`}>{cfg.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submissions List */}
          {submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-14 text-center"
            >
              <FiFileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Submissions Yet</h3>
              <p className="text-gray-400 mb-6 text-sm">Apply for an internship and submit your work to get started.</p>
              <a
                href="/student/internships"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition text-sm"
              >
                Browse Internships
              </a>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {submissions.map((sub, idx) => {
                const cfg = STATUS[sub.status] || STATUS.pending;
                const { Icon } = cfg;
                const canEdit = sub.status !== 'approved';

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
                  >
                    {/* Status strip */}
                    <div className={`h-1.5 w-full ${cfg.dot}`} />

                    <div className="p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{sub.internship_title}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Submitted {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <StatusBadge status={sub.status} />
                      </div>

                      {/* Description excerpt */}
                      {sub.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{sub.description}</p>
                      )}

                      {/* Links row */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {sub.github_url && (
                          <a href={sub.github_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition font-medium">
                            <FiGithub className="w-4 h-4" /> GitHub
                          </a>
                        )}
                        {sub.drive_url && (
                          <a href={sub.drive_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition font-medium">
                            <FiGlobe className="w-4 h-4" /> Demo
                          </a>
                        )}
                        {sub.documentation_url && (
                          <a href={sub.documentation_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition font-medium">
                            <FiFileText className="w-4 h-4" /> Docs
                          </a>
                        )}
                      </div>

                      {/* Points awarded */}
                      {sub.status === 'approved' && sub.points_awarded > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                          <FiAward className="w-4 h-4 text-emerald-600" />
                          <p className="text-emerald-800 font-bold text-sm">
                            🎉 {sub.points_awarded} points earned!
                          </p>
                        </div>
                      )}

                      {/* Admin Feedback preview */}
                      {sub.admin_feedback && (
                        <div className={`rounded-xl p-3 mb-4 border text-sm ${
                          sub.status === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          sub.status === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-orange-50 border-orange-200 text-orange-700'
                        }`}>
                          <span className="font-bold">Admin: </span>
                          <span className="line-clamp-2">{sub.admin_feedback}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setViewSub(sub)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition text-sm font-semibold"
                        >
                          <FiEye className="w-4 h-4" /> View Details
                        </button>

                        {canEdit && (
                          <button
                            onClick={() => setEditSub(sub)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition text-sm font-semibold"
                          >
                            <FiEdit2 className="w-4 h-4" /> Edit & Re-submit
                          </button>
                        )}

                        {sub.status === 'approved' && (
                          <span className="ml-auto text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <FiCheckCircle className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {viewSub && (
          <DetailModal
            submission={viewSub}
            onClose={() => setViewSub(null)}
            onEdit={sub => setEditSub(sub)}
          />
        )}
        {editSub && (
          <EditModal
            submission={editSub}
            onClose={() => setEditSub(null)}
            onSaved={() => { setEditSub(null); fetchSubmissions(); }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default MyInternshipSubmissionsPage;
