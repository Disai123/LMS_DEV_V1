import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { contactService } from '../../services/contactService';
import { FiMail, FiUser, FiClock, FiMessageSquare, FiChevronRight, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const ContactMessages = () => {
    const queryClient = useQueryClient();
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, unread, read

    const { data, isLoading, isError } = useQuery('admin-messages', () => contactService.getMessages());

    const messages = data?.data?.messages || [];

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = 
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        return matchesSearch && msg.status === filter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) return <div className="h-64 flex items-center justify-center"><LoadingSpinner /></div>;
    if (isError) return <div className="text-center py-10 text-red-500">Error loading messages</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FiFilter className="text-slate-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Messages List */}
                <div className={`lg:col-span-5 space-y-3 ${selectedMessage ? 'hidden lg:block' : ''}`}>
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                            <FiMail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layoutId={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 group ${
                                    selectedMessage?.id === msg.id
                                        ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200'
                                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-bold truncate max-w-[150px] ${
                                        selectedMessage?.id === msg.id ? 'text-white' : 'text-slate-900'
                                    }`}>
                                        {msg.name}
                                    </h3>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                        selectedMessage?.id === msg.id 
                                            ? 'bg-white/20 text-white' 
                                            : msg.status === 'unread' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {msg.status}
                                    </span>
                                </div>
                                <p className={`text-sm font-semibold mb-1 truncate ${
                                    selectedMessage?.id === msg.id ? 'text-white/90' : 'text-slate-700'
                                }`}>
                                    {msg.subject}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className={`text-xs truncate max-w-[200px] ${
                                        selectedMessage?.id === msg.id ? 'text-white/70' : 'text-slate-500'
                                    }`}>
                                        {msg.message}
                                    </p>
                                    <span className={`text-[10px] whitespace-nowrap ${
                                        selectedMessage?.id === msg.id ? 'text-white/60' : 'text-slate-400'
                                    }`}>
                                        {formatDate(msg.created_at)}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Message Detail */}
                <div className={`lg:col-span-7 ${!selectedMessage ? 'hidden lg:flex' : 'flex'} flex-col h-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]`}>
                    {selectedMessage ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedMessage.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                {/* Header */}
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <div className="flex items-start justify-between mb-6">
                                        <button 
                                            onClick={() => setSelectedMessage(null)}
                                            className="lg:hidden text-slate-400 hover:text-slate-600 mb-4"
                                        >
                                            <FiChevronRight className="rotate-180 w-6 h-6" />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                                                {selectedMessage.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">{selectedMessage.name}</h2>
                                                <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <FiClock /> {formatDate(selectedMessage.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white rounded-2xl border border-slate-100 mb-2">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Subject</p>
                                        <h3 className="font-bold text-slate-900">{selectedMessage.subject}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Message</p>
                                    <div className="bg-slate-50 rounded-2xl p-6 text-slate-700 leading-relaxed whitespace-pre-wrap italic">
                                        "{selectedMessage.message}"
                                    </div>
                                </div>

                                {/* Footer/Actions */}
                                <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <a 
                                            href={`mailto:${selectedMessage.email}`}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100"
                                        >
                                            <FiMail /> Reply via Email
                                        </a>
                                    </div>
                                    <button className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <FiMessageSquare className="w-10 h-10 text-slate-200" />
                            </div>
                            <p className="font-medium">Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactMessages;
