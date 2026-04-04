import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { contactService } from '../services/contactService';
import toast from 'react-hot-toast';

const ContactPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await contactService.submitMessage(formData);
            setSubmitted(true);
            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Contact error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#0F172A' }}>
            <Header />

            <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 pointer-events-none">
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        right: '5%',
                        width: '40%',
                        height: '60%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(251,191,36,0.08) 0%, transparent 70%)',
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '5%',
                        width: '40%',
                        height: '60%',
                        background: 'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)',
                    }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-2xl relative z-10"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
                        {!submitted ? (
                            <>
                                <div className="mb-10 text-center">
                                    <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                                        Contact <span className="text-amber-400">Admin</span>
                                    </h1>
                                    <p className="text-slate-400">
                                        Have a question or need help? Send us a message and we'll get back to you within 24 hours.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Your Name</label>
                                            <div className="relative">
                                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    required
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-400 ml-1">Email Address</label>
                                            <div className="relative">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                                <input
                                                    required
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Subject</label>
                                        <div className="relative">
                                            <FiMessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                            <input
                                                required
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="How can we help?"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Message</label>
                                        <textarea
                                            required
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message here..."
                                            rows="5"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 font-black py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-amber-400/10 group overflow-hidden relative"
                                    >
                                        {loading ? (
                                            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                Send Message
                                                <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                    className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30"
                                >
                                    <FiCheckCircle className="w-10 h-10" />
                                </motion.div>
                                <h2 className="text-3xl font-black text-white mb-4">Message Sent!</h2>
                                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                                    Thank you for reaching out. Our team has received your message and will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
                                >
                                    Back to Pricing
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactPage;
