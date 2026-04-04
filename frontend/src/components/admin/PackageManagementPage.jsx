import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/api';
import PlanBadge from '../PlanBadge';
import toast from 'react-hot-toast';

const PLANS_META = {
  free:  { 
    courses: ['Python for Beginners', 'Machine Learning'], 
    projects: ['Todo Application'], 
    color: 'border-slate-300' 
  },
  basic: { 
    courses: ['Everything in Free plan', 'Deep Learning', 'NLP', 'GenAI'], 
    projects: ['Everything in Free plan', 'Ecommerce Web-Full Stack'], 
    color: 'border-blue-400' 
  },
  pro:   { 
    courses: ['Everything in Basic plan', 'RAG', 'AI Agents', 'MCP'], 
    projects: ['Everything in Basic plan', 'Retail - Single Agent', 'Retail - Multi Agent', 'Travel - MCP'], 
    color: 'border-purple-400' 
  }
};

const PackageManagementPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState(null); // { studentId, studentName, currentPlan }
  const [upgradePlan, setUpgradePlan] = useState('basic');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [plans, setPlans] = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsRes, reqRes, subRes, plansRes] = await Promise.all([
        paymentService.getPackageStats().catch(() => ({ data: { data: {} } })),
        paymentService.getPaymentRequests(),
        paymentService.getAllSubscriptions(),
        paymentService.getPlans().catch(() => ({ data: { data: [] } }))
      ]);
      setStats(statsRes.data.data || {});
      setPaymentRequests(reqRes.data.data || []);
      setSubscriptions(subRes.data.data || []);
      setPlans(plansRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load package data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await paymentService.approvePaymentRequest(id, '');
      toast.success('Payment approved! Plan activated.');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    setActionLoading(rejectModal);
    try {
      await paymentService.rejectPaymentRequest(rejectModal, rejectNote);
      toast.success('Payment rejected.');
      setRejectModal(null); setRejectNote('');
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally { setActionLoading(null); }
  };

  const handleManualUpgrade = async () => {
    setActionLoading('upgrade');
    try {
      await paymentService.manualUpgrade(upgradeModal.studentId, upgradePlan);
      toast.success(`${upgradeModal.studentName} upgraded to ${upgradePlan}!`);
      setUpgradeModal(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upgrade failed');
    } finally { setActionLoading(null); }
  };

  const filteredRequests = filterStatus
    ? paymentRequests.filter(r => r.status === filterStatus)
    : paymentRequests;

  const statusBadge = (status) => {
    const map = {
      pending:  'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    const icons = { pending: '⏳', approved: '✅', rejected: '❌' };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${map[status] || 'bg-gray-100 text-gray-600'}`}>
        {icons[status]} {status}
      </span>
    );
  };

  const tabs = [
    { id: 'overview', label: '📦 Package Overview' },
    { id: 'payments', label: '💳 Payment Requests' },
    { id: 'subscriptions', label: '👥 Active Subscriptions' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📦 Package Management</h1>
        <p className="text-gray-500 text-sm mt-1">Manage subscription plans, payment approvals, and student access.</p>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Free Members', value: stats.distribution?.free ?? 0, color: 'text-slate-600', bg: 'bg-slate-50' },
            { label: 'Basic Members', value: stats.distribution?.basic ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Pro Members',   value: stats.distribution?.pro ?? 0, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Pending Payments', value: stats.pendingPayments ?? 0, color: 'text-yellow-700', bg: 'bg-yellow-50',
              highlight: (stats.pendingPayments ?? 0) > 0 },
            { label: 'Total Revenue', value: `₹${(stats.totalRevenue ?? 0).toLocaleString('en-IN')}`, color: 'text-green-700', bg: 'bg-green-50' }
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-4 ${s.bg} ${s.highlight ? 'ring-2 ring-yellow-400' : 'border border-gray-100'}`}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Package Overview ─────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(PLANS_META).map(([planName, meta]) => (
            <div key={planName} className={`bg-white border-2 ${meta.color} rounded-2xl p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <PlanBadge plan={planName} size="lg" />
                <span className="text-2xl font-bold text-gray-500">
                  {planName === 'free' ? '₹0' : `₹${Math.floor(plans.find(p => p.name === planName)?.price || (planName === 'basic' ? 999 : 1999))}`}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Courses</p>
                <ul className="space-y-1">
                  {meta.courses.map((c, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-green-500">✓</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projects</p>
                <ul className="space-y-1">
                  {meta.projects.map((p, i) => (
                    <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="text-green-500">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">Active Members</p>
                <p className="text-xl font-bold text-gray-800">
                  {stats?.distribution?.[planName] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tab: Payment Requests ─────────────────────────────── */}
      {activeTab === 'payments' && (
        <div>
          <div className="flex gap-2 mb-4">
            {['pending', 'approved', 'rejected', ''].map(s => (
              <button
                key={s || 'all'}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s || 'All'} {s === 'pending' && stats?.pendingPayments > 0 ? `(${stats.pendingPayments})` : ''}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Student', 'Plan', 'UPI Txn ID', 'Amount', 'Submitted', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">No payment requests found.</td>
                  </tr>
                ) : filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{req.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{req.user?.email}</p>
                    </td>
                    <td className="px-4 py-3"><PlanBadge plan={req.plan?.name || 'free'} /></td>
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">{req.transaction_id}</code>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{parseFloat(req.amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(req.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">{statusBadge(req.status)}</td>
                    <td className="px-4 py-3">
                      {req.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(req.id)}
                            disabled={actionLoading === req.id}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                          >
                            {actionLoading === req.id ? '...' : '✓ Approve'}
                          </button>
                          <button
                            onClick={() => { setRejectModal(req.id); setRejectNote(''); }}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {req.status === 'approved' ? `By admin on ${new Date(req.updated_at).toLocaleDateString('en-IN')}` : req.admin_notes || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: Active Subscriptions ─────────────────────────── */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Student', 'Email', 'Plan', 'Activated', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">No subscriptions found.</td>
                </tr>
              ) : subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{sub.user?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-gray-500">{sub.user?.email}</td>
                  <td className="px-4 py-3"><PlanBadge plan={sub.plan?.name || 'free'} /></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(sub.start_date || sub.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}>
                      {sub.status === 'active' ? '🟢 Active' : sub.status}
                    </span>
                    {!sub.end_date && sub.status === 'active' && (
                      <span className="ml-1 text-xs text-indigo-500">Lifetime</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setUpgradeModal({ studentId: sub.user_id, studentName: sub.user?.name, currentPlan: sub.plan?.name })}
                      className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded-lg"
                    >
                      ✏️ Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Reject Modal ─────────── */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Payment Request</h3>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              placeholder="Optional reason for rejection..."
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none h-24 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={actionLoading === rejectModal}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {actionLoading === rejectModal ? 'Rejecting...' : 'Confirm Reject'}
              </button>
              <button onClick={() => setRejectModal(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Manual Upgrade Modal ─────────── */}
      {upgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Change Plan for {upgradeModal.studentName}</h3>
            <p className="text-sm text-gray-500 mb-4">Current plan: <PlanBadge plan={upgradeModal.currentPlan || 'free'} /></p>
            <div className="flex gap-3 mb-4">
              {['free', 'basic', 'pro'].map(p => (
                <button
                  key={p}
                  onClick={() => setUpgradePlan(p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 capitalize transition-all ${
                    upgradePlan === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-4">This immediately assigns the selected plan with lifetime access (no payment required).</p>
            <div className="flex gap-3">
              <button
                onClick={handleManualUpgrade}
                disabled={actionLoading === 'upgrade'}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {actionLoading === 'upgrade' ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setUpgradeModal(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageManagementPage;
