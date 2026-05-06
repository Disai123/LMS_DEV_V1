import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/api';
import Header from '../components/common/Header';
import toast from 'react-hot-toast';
import { Check, Zap } from 'lucide-react';

const UPI_ID = 'test@upi';
const UPI_NAME = 'GNANAM AI';

const PLAN_META = {
  starter: {
    badge: 'START HERE',
    badgeBg: 'bg-slate-500',
    cardBorder: 'border-2 border-slate-300 shadow-lg',
    btnClass: 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold',
    courses: ['Python for Beginners', 'Machine Learning'],
    projects: ['Todo Application'],
    extras: ['Community Forum Access', 'Course Certificates', 'Hackathon Access'],
    originalPrice: null,
  },
  basic: {
    badge: 'POPULAR',
    badgeBg: 'bg-indigo-500',
    cardBorder: 'border-2 border-indigo-500 shadow-xl shadow-indigo-100 scale-[1.02]',
    btnClass: 'bg-green-500 hover:bg-green-600 text-white font-bold',
    includes: 'Starter',
    courses: ['Deep Learning', 'NLP', 'GenAI'],
    projects: ['Ecommerce Web-Full Stack'],
    extras: ['Project Certificate', 'Priority Support'],
    originalPrice: 9999,
  },
  pro: {
    badge: 'BEST VALUE',
    badgeBg: 'bg-green-500',
    cardBorder: 'border-2 border-indigo-200 shadow-lg',
    btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold',
    includes: 'Basic',
    courses: ['RAG', 'AI Agents', 'MCP'],
    projects: ['Retail - Single Agent', 'Retail - Multi Agent', 'Travel - MCP'],
    extras: ['Mentor Support'],
    originalPrice: 14999,
  }
};

const CheckItem = ({ text }) => (
  <li className="flex items-start gap-3 text-sm text-slate-700 font-medium">
    <Check size={18} className="text-green-500 shrink-0 mt-0.5" strokeWidth={3} />
    {text}
  </li>
);

const SectionHeader = ({ text }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 mt-3">
    {text}
  </p>
);

import { useAuth } from '../context/AuthContext';
import { useQueryClient } from 'react-query';

const PricingPage = () => {
  const { user, refreshUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, subRes] = await Promise.all([
        paymentService.getPlans(),
        paymentService.getMySubscription().catch(() => ({ data: { data: null, pendingRequest: null } }))
      ]);
      const order = { starter: 0, basic: 1, pro: 2 };
      const sorted = (plansRes.data.data || [])
        .filter(p => p.name !== 'free')
        .sort((a, b) => (order[a.name] ?? 9) - (order[b.name] ?? 9));
      setPlans(sorted);
      setCurrentSubscription(subRes.data.data);
      setPendingRequest(subRes.data.pendingRequest);
    } catch (err) {
      toast.error('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) { toast.error('Please enter your UPI Transaction ID'); return; }
    setSubmitting(true);
    try {
      await paymentService.submitTransaction(selectedPlan.id, transactionId.trim());
      toast.success('Your account has been upgraded successfully!');
      setSelectedPlan(null);
      setTransactionId('');

      // Crucial: Invalidate all queries to force re-fetch everywhere
      queryClient.invalidateQueries('my-subscription');
      queryClient.invalidateQueries('realtime-projects');

      fetchData();
      await refreshUser(); // Update global auth state
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit payment.');
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  // Fallback to 'starter' if user has no explicit subscription yet
  const currentPlanName = currentSubscription?.plan?.name?.toLowerCase() || 'starter';

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20">
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Invest Once, Learn Forever
        </h1>
        <p className="text-slate-600 text-lg max-w-xl mx-auto font-medium">
          No subscriptions. No renewals. Pay once with UPI and unlock your learning path for life.
        </p>
      </div>



      {/* Plan Cards Container */}
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {plans.map((plan) => {
          const meta = PLAN_META[plan.name] || PLAN_META.starter;
          const isCurrent = currentPlanName === plan.name;
          const isFree = plan.name === 'starter';
          const discount = meta.originalPrice
            ? Math.round(((meta.originalPrice - plan.price) / meta.originalPrice) * 100)
            : null;

          // If it's current, force the border to be green like the screenshot
          const activeBorder = isCurrent ? 'border-2 border-green-500 shadow-xl shadow-green-100 scale-[1.02]' : meta.cardBorder;

          return (
            <div
              key={plan.id}
              className={`flex flex-col h-full bg-white rounded-3xl overflow-hidden transition-all duration-300 ${activeBorder}`}
            >
              {/* Badge Banner */}
              {meta.badge && (
                <div className={`${meta.badgeBg} py-2.5 text-center text-white text-[13px] font-extrabold uppercase tracking-widest`}>
                  {meta.badge}
                </div>
              )}

              {/* Current Plan Banner */}
              {isAuthenticated && isCurrent && (
                <div className="bg-green-500 py-2.5 text-center text-white text-[13px] font-extrabold uppercase tracking-widest border-t border-green-400">
                  ✓ Current Plan
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow">
                {/* Plan Title & Price */}
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 capitalize">{plan.name} Plan</h3>

                {isFree ? (
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[48px] leading-none font-black text-slate-900">Free</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[48px] leading-none font-black text-slate-900">₹{Math.floor(plan.price)}</span>
                    <span className="text-slate-500 font-semibold text-sm">/ One Year</span>
                  </div>
                )}

                {/* Subtitle / Savings */}
                <div className="h-6 mb-2 mt-1">
                  {meta.originalPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through font-semibold text-sm">₹{meta.originalPrice}</span>
                      <span className="text-green-600 font-bold text-[11px] bg-green-50 px-2 py-0.5 rounded-md">Save ₹{meta.originalPrice - Math.floor(plan.price)}!</span>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs font-medium">{plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Plan — Basic Course Access</p>
                  )}
                </div>

                <div className="w-full h-[1px] bg-slate-100 mb-2"></div>

                {/* Parent Plan Inclusion Badge */}
                {meta.includes && (
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
                    <div className="bg-green-500 rounded-full p-0.5">
                      <Check size={12} className="text-white" strokeWidth={4} />
                    </div>
                    <span className="text-[12px] font-bold text-slate-600">
                      Includes <span className="text-indigo-600">{meta.includes}</span> plan
                    </span>
                  </div>
                )}

                {/* Features List */}
                <div className="flex-grow mb-4">
                  <SectionHeader text="Courses" />
                  <ul className="space-y-1.5 mt-1">
                    {meta.courses.map((c, i) => <CheckItem key={i} text={c} />)}
                  </ul>

                  <SectionHeader text="Projects" />
                  <ul className="space-y-1.5 mt-1">
                    {meta.projects.map((p, i) => <CheckItem key={i} text={p} />)}
                  </ul>

                  <SectionHeader text="Extras" />
                  <ul className="space-y-1.5 mt-1">
                    {meta.extras.map((e, i) => <CheckItem key={i} text={e} />)}
                  </ul>
                </div>

                {/* CTA Button */}
                {isAuthenticated && isCurrent ? (
                  <button disabled className="w-full py-2.5 rounded-full font-bold text-white bg-green-500 text-sm">
                    ✓ Active
                  </button>
                ) : isFree ? (
                  <button
                    onClick={() => !isAuthenticated && navigate('/login', { state: { from: location } })}
                    className={`w-full py-2.5 rounded-full font-bold text-sm transition-all duration-200 ${isAuthenticated
                      ? 'text-slate-500 bg-slate-100 cursor-default'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                      }`}
                  >
                    {isAuthenticated ? 'Free (Default)' : 'BUY'}
                  </button>

                ) : (
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        setSelectedPlan(plan);
                        setTransactionId('');
                      } else {
                        navigate('/login', { state: { from: location } });
                      }
                    }}
                    className={`w-full py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-md ${meta.btnClass}`}
                  >
                    BUY
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-extrabold text-white capitalize">{selectedPlan.name} Plan</h2>
                <p className="text-indigo-100 text-sm mt-1 font-medium">Pay ₹{Math.floor(selectedPlan.price)} via UPI (one-time)</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-white/80 hover:text-white text-3xl leading-none font-light">×</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${Math.floor(selectedPlan.price)}&cu=INR`}
                  alt="UPI QR Code"
                  className="w-40 h-40 mx-auto rounded-xl border border-slate-200 shadow-sm mb-4 bg-white p-2"
                />
                <p className="text-sm text-slate-600 mb-2 font-medium">Or pay using UPI ID:</p>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <code className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-lg font-mono text-base font-bold">{UPI_ID}</code>
                  <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('Copied!'); }} className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-bold">Copy</button>
                </div>
                <p className="text-sm text-slate-500">Pay exactly <strong className="text-slate-900 font-bold">₹{Math.floor(selectedPlan.price)}</strong> to <strong className="text-slate-900 font-bold">{UPI_NAME}</strong></p>
              </div>

              <form onSubmit={handleSubmitTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">UPI Transaction ID *</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. 407123456789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono shadow-inner"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Find this in your UPI app under "Transaction History".</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting || !transactionId.trim()}
                  className="w-full py-4 px-6 rounded-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30"
                >
                  {submitting ? 'Activating...' : 'Activate Plan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPage;
