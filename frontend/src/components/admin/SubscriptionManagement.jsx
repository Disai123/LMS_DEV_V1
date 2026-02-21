import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { paymentService } from '../../services/api'
import { motion } from 'framer-motion'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const SubscriptionManagement = () => {
    const [activeTab, setActiveTab] = useState('payment-requests')
    const [searchTerm, setSearchTerm] = useState('')
    const [rejectModal, setRejectModal] = useState(null) // { id, name }
    const [rejectNote, setRejectNote] = useState('')
    const queryClient = useQueryClient()

    // ── Payment Requests ──────────────────────────────────────────────────────
    const { data: requestsData, isLoading: requestsLoading } = useQuery(
        'admin-payment-requests',
        () => paymentService.getPaymentRequests(),
        { onError: () => toast.error('Failed to fetch payment requests') }
    )

    const approveMutation = useMutation(
        ({ id }) => paymentService.approvePaymentRequest(id),
        {
            onSuccess: (_, { name }) => {
                toast.success(`Approved! Subscription activated.`)
                queryClient.invalidateQueries('admin-payment-requests')
                queryClient.invalidateQueries('admin-all-subscriptions')
            },
            onError: (err) => toast.error(err.response?.data?.message || 'Approval failed')
        }
    )

    const rejectMutation = useMutation(
        ({ id, note }) => paymentService.rejectPaymentRequest(id, note),
        {
            onSuccess: () => {
                toast.success('Payment request rejected.')
                setRejectModal(null)
                setRejectNote('')
                queryClient.invalidateQueries('admin-payment-requests')
            },
            onError: (err) => toast.error(err.response?.data?.message || 'Rejection failed')
        }
    )

    // ── All Subscriptions ─────────────────────────────────────────────────────
    const { data: subscriptionsData, isLoading: subscriptionsLoading } = useQuery(
        'admin-all-subscriptions',
        () => paymentService.getAllSubscriptions(),
        { onError: () => toast.error('Failed to fetch subscriptions') }
    )

    const paymentRequests = requestsData?.data?.data || []
    const subscriptions = subscriptionsData?.data?.data || []

    const pendingCount = paymentRequests.filter(r => r.status === 'pending').length

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const statusBadge = (status) => {
        const map = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            active: 'bg-green-100 text-green-800',
            expired: 'bg-gray-100 text-gray-600',
            cancelled: 'bg-red-100 text-red-700',
        }
        return map[status] || 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
                {pendingCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {pendingCount} Pending
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        onClick={() => setActiveTab('payment-requests')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'payment-requests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Payment Requests
                        {pendingCount > 0 && (
                            <span className="ml-2 bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('subscriptions')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'subscriptions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Active Subscriptions
                    </button>
                </nav>
            </div>

            {/* ── Payment Requests Tab ── */}
            {activeTab === 'payment-requests' && (
                <div>
                    {requestsLoading ? <LoadingSpinner size="lg" /> : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Student', 'Plan', 'Amount', 'Transaction ID', 'Date', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paymentRequests.map((req) => (
                                        <tr key={req.id} className={req.status === 'pending' ? 'bg-yellow-50' : ''}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{req.user?.name}</div>
                                                <div className="text-xs text-gray-500">{req.user?.email}</div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className="capitalize text-sm font-semibold text-indigo-700">{req.plan?.name}</span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ₹{req.amount}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{req.transaction_id}</code>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {new Date(req.created_at).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${statusBadge(req.status)}`}>
                                                    {req.status}
                                                </span>
                                                {req.admin_notes && (
                                                    <p className="text-xs text-gray-400 mt-1 max-w-[120px] truncate" title={req.admin_notes}>{req.admin_notes}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {req.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => approveMutation.mutate({ id: req.id })}
                                                            disabled={approveMutation.isLoading}
                                                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                        >
                                                            ✓ Approve
                                                        </button>
                                                        <button
                                                            onClick={() => { setRejectModal({ id: req.id, name: req.user?.name }); setRejectNote(''); }}
                                                            className="px-3 py-1.5 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors"
                                                        >
                                                            ✕ Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {paymentRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No payment requests yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Subscriptions Tab ── */}
            {activeTab === 'subscriptions' && (
                <div>
                    <div className="relative max-w-md mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search by user or plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {subscriptionsLoading ? <LoadingSpinner size="lg" /> : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['User', 'Plan', 'Status', 'Start Date', 'End Date', 'Payment Ref'].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredSubscriptions.map((sub) => (
                                        <tr key={sub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-8 w-8 rounded-full" src={`https://ui-avatars.com/api/?name=${sub.user?.name}&background=random`} alt="" />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">{sub.user?.name}</div>
                                                        <div className="text-xs text-gray-500">{sub.user?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="capitalize text-sm font-semibold text-indigo-700">{sub.plan?.name}</span>
                                                <div className="text-xs text-gray-500">{sub.plan?.currency} {sub.plan?.price}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full capitalize ${statusBadge(sub.status)}`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(sub.start_date).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {sub.end_date ? new Date(sub.end_date).toLocaleDateString('en-IN') : '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                                                {sub.payment_id || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSubscriptions.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No subscriptions found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Reject Payment</h3>
                        <p className="text-sm text-gray-600">Rejecting payment request from <strong>{rejectModal.name}</strong>.</p>
                        <textarea
                            value={rejectNote}
                            onChange={(e) => setRejectNote(e.target.value)}
                            placeholder="Reason for rejection (optional)"
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => rejectMutation.mutate({ id: rejectModal.id, note: rejectNote })}
                                disabled={rejectMutation.isLoading}
                                className="flex-1 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {rejectMutation.isLoading ? 'Rejecting...' : 'Confirm Reject'}
                            </button>
                            <button
                                onClick={() => setRejectModal(null)}
                                className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SubscriptionManagement
