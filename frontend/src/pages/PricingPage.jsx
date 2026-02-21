import React, { useState, useEffect } from 'react';
import { paymentService } from '../services/api';
import Header from '../components/common/Header';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ─── UPI QR Code placeholder (replace UPI_ID with your actual UPI ID) ───────
const UPI_ID = 'test@upi'; // Default dummy UPI ID
const UPI_NAME = 'Test Merchant'; // Default dummy Name

const PricingPage = () => {
    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState(null); // plan object when modal is open
    const [transactionId, setTransactionId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [plansRes, subRes] = await Promise.all([
                paymentService.getPlans(),
                paymentService.getMySubscription().catch(() => ({ data: { data: null, pendingRequest: null } }))
            ]);

            // Show all plans: free, monthly, yearly
            setPlans(plansRes.data.data);
            setCurrentSubscription(subRes.data.data);
            setPendingRequest(subRes.data.pendingRequest);
        } catch (err) {
            console.error('Error fetching pricing data:', err);
            toast.error('Failed to load plans.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitTransaction = async (e) => {
        e.preventDefault();
        if (!transactionId.trim()) {
            toast.error('Please enter your UPI Transaction ID');
            return;
        }
        setSubmitting(true);
        try {
            await paymentService.submitTransaction(selectedPlan.id, transactionId.trim());
            toast.success('Payment submitted! Admin will verify and activate your plan within 24 hours.');
            setSelectedPlan(null);
            setTransactionId('');
            fetchData(); // refresh to show pending state
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    const currentPlanId = currentSubscription?.plan?.id;

    const getPlanBadge = (planName) => {
        if (planName === 'yearly') return { label: 'Best Value', color: 'bg-green-500' };
        if (planName === 'monthly') return { label: 'Popular', color: 'bg-indigo-500' };
        return null;
    };

    const getPlanDuration = (planName) => {
        if (planName === 'monthly') return '/ month';
        if (planName === 'yearly') return '/ year';
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Unlock premium realtime projects and accelerate your career. Pay via UPI — no credit card needed.
                    </p>
                </div>

                {/* Pending Payment Banner */}
                {pendingRequest && (
                    <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded-xl flex items-start gap-3">
                        <span className="text-2xl">⏳</span>
                        <div>
                            <p className="font-semibold text-yellow-800">Payment Under Review</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                Your payment for the <strong>{pendingRequest.plan?.name}</strong> plan (Transaction ID: <code className="bg-yellow-100 px-1 rounded">{pendingRequest.transaction_id}</code>) is being verified by admin. You'll get access once approved.
                            </p>
                        </div>
                    </div>
                )}

                {/* Plan Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 items-start">
                    {plans.map((plan) => {
                        const isCurrent = currentPlanId === plan.id;
                        const isStarter = plan.name === 'starter';
                        const isBasic = plan.name === 'basic';
                        const isPro = plan.name === 'pro';

                        // Plan Styling Logic
                        let cardStyle = "bg-white border-gray-100 hover:border-gray-200";
                        let buttonStyle = "bg-gray-100 text-gray-900 hover:bg-gray-200";
                        let badge = null;

                        if (isBasic) {
                            cardStyle = "bg-white border-purple-100 hover:border-purple-300 ring-4 ring-purple-500/5";
                            buttonStyle = "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30";
                            badge = { text: "Popular", color: "bg-purple-100 text-purple-700" };
                        } else if (isPro) {
                            cardStyle = "bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 border-indigo-800 text-white hover:border-indigo-700 hover:shadow-2xl hover:shadow-indigo-500/20";
                            buttonStyle = "bg-white text-indigo-900 hover:bg-gray-50";
                            badge = { text: "Best Value", color: "bg-yellow-400 text-yellow-900 font-bold shadow-lg" };
                        }

                        // Current Plan Override
                        if (isCurrent) {
                            cardStyle += " border-green-500 ring-2 ring-green-500";
                        }

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.02] border p-8 flex flex-col ${cardStyle}`}
                            >
                                {/* Badge */}
                                {badge && (
                                    <div className="absolute top-5 right-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${badge.color}`}>
                                            {badge.text}
                                        </span>
                                    </div>
                                )}

                                {isCurrent && (
                                    <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-1 text-xs font-bold uppercase tracking-wide">
                                        Active Plan
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className={`text-2xl font-bold mb-2 capitalize ${isPro ? 'text-white' : 'text-gray-900'}`}>{plan.display_name || plan.name}</h3>
                                    <div className="flex items-baseline mb-2">
                                        <span className={`text-4xl font-extrabold ${isPro ? 'text-white' : 'text-gray-900'}`}>
                                            {
                                                plan.price > 0 ? `₹${Math.floor(plan.price)}` : 'Free'
                                            }
                                        </span>
                                        {plan.price > 0 && (
                                            <span className={`ml-2 text-sm font-medium ${isPro ? 'text-gray-400' : 'text-gray-500'}`}>/ month</span>
                                        )}
                                    </div>
                                    <p className={`text-sm ${isPro ? 'text-gray-400' : 'text-gray-600'}`}>{plan.description}</p>
                                </div>

                                <div className="space-y-4 mb-8 flex-grow">
                                    {plan.features && Array.isArray(plan.features) && plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <div className={`mt-0.5 mr-3 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${isPro ? 'bg-yellow-400/20' : isBasic ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                                <svg className={`h-3 w-3 ${isPro ? 'text-yellow-400' : isBasic ? 'text-purple-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className={`text-sm ${isPro ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                                        </li>
                                    ))}
                                </div>

                                {isCurrent ? (
                                    <div>
                                        <button disabled className={`w-full py-3 px-6 rounded-xl text-base font-bold bg-green-500 text-white cursor-default opacity-90`}>
                                            ✓ Current Plan
                                        </button>
                                        {currentSubscription?.end_date && (
                                            <p className={`text-center text-xs mt-3 ${isPro ? 'text-gray-500' : 'text-gray-500'}`}>
                                                Renews: {new Date(currentSubscription.end_date).toLocaleDateString('en-IN')}
                                            </p>
                                        )}
                                    </div>
                                ) : isStarter ? (
                                    <button disabled className="w-full py-3 px-6 rounded-xl text-base font-bold text-gray-500 bg-gray-100 cursor-default border border-gray-200">
                                        Default Plan
                                    </button>
                                ) : pendingRequest ? (
                                    <button disabled className="w-full py-3 px-6 rounded-xl text-base font-bold text-yellow-800 bg-yellow-100 cursor-not-allowed">
                                        ⏳ Payment Pending
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setSelectedPlan(plan); setTransactionId(''); }}
                                        className={`w-full py-3 px-6 rounded-xl text-base font-bold transition-all duration-200 shadow-md ${buttonStyle}`}
                                    >
                                        {plan.price > 0 ? `Select ${plan.display_name || plan.name}` : 'Select Plan'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* How it works */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">How to Pay</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        {[
                            { step: '1', icon: '📱', text: 'Click "Pay via UPI" on your plan' },
                            { step: '2', icon: '🔍', text: 'Scan QR or use UPI ID to pay' },
                            { step: '3', icon: '📋', text: 'Copy your UPI Transaction ID' },
                            { step: '4', icon: '✅', text: 'Submit ID — Admin activates within 24h' },
                        ].map(item => (
                            <div key={item.step} className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">{item.step}</div>
                                <div className="text-2xl">{item.icon}</div>
                                <p className="text-sm text-gray-600">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-gray-500 text-sm mt-8">
                    <p>Need help? Contact support at support@aishani.com</p>
                </div>
            </div>

            {/* Payment Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="bg-indigo-600 text-white p-6 rounded-t-2xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold capitalize">{selectedPlan.name} Plan</h2>
                                    <p className="text-indigo-200 text-sm mt-1">Pay ₹{Math.floor(selectedPlan.price)} via UPI</p>
                                </div>
                                <button onClick={() => setSelectedPlan(null)} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* UPI Details */}
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                {/* QR Code placeholder — replace with your actual QR image */}
                                {/* QR Code placeholder — replace with your actual QR image */}
                                <div className="mx-auto mb-3 flex items-center justify-center">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${Math.floor(selectedPlan.price)}&cu=INR`}
                                        alt="UPI QR Code"
                                        className="w-40 h-40 rounded-xl border-2 border-gray-200"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mb-1">Or pay using UPI ID:</p>
                                <div className="flex items-center justify-center gap-2">
                                    <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-mono text-sm font-bold">{UPI_ID}</code>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('UPI ID copied!'); }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Pay exactly <strong>₹{Math.floor(selectedPlan.price)}</strong> to <strong>{UPI_NAME}</strong></p>
                            </div>

                            {/* Transaction ID Input */}
                            <form onSubmit={handleSubmitTransaction} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Enter UPI Transaction ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="e.g. 407123456789"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Find this in your UPI app under "Transaction History" after payment.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting || !transactionId.trim()}
                                    className="w-full py-3 px-6 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {submitting ? 'Submitting...' : 'Submit for Verification'}
                                </button>
                            </form>

                            <p className="text-xs text-center text-gray-500">
                                Admin will verify your payment and activate your plan within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingPage;
