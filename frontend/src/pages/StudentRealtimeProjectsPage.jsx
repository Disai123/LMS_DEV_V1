import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProjectGrid from '../components/projects/ProjectGrid';
import ProjectFilters from '../components/projects/ProjectFilters';
import ProjectsUpsell from '../components/common/ProjectsUpsell';
import { useNavigate } from 'react-router-dom';
import { useRealtimeProjects } from '../hooks/useRealtimeProjects';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/api';

const StudentRealtimeProjectsPage = () => {
  const navigate = useNavigate();
  // Add free project IDs here when ready (e.g. 'todo_list')
  const FREE_PROJECTS = [];
  const { user } = useAuth();
  const {
    projects,
    categories,
    stats,
    total,
    isLoading,
    error,
    hasAccess,
    filters,
    updateFilters,
    clearFilters
  } = useRealtimeProjects();

  const { data: subscriptionResponse } = useQuery(
    'my-subscription',
    () => paymentService.getMySubscription(),
    { enabled: !!user && user.role !== 'admin' }
  );

  // Debug logging
  const subscription = subscriptionResponse?.data?.data;
  console.log('User Role:', user?.role);
  console.log('Subscription Data:', subscription);
  console.log('Plan Name:', subscription?.plan?.name);

  // Check if premium: Admin OR has active subscription OR has student permissions
  const planName = subscription?.plan?.name?.toLowerCase();

  // Use permissions from AuthContext as the primary source of truth for optimistic activation
  const hasCoursesPerm = user?.permissions?.courses || false;
  const hasProjectsPerm = user?.permissions?.realtime_projects || false;

  // isPaid true if any paid plan or admin or has explicit project permissions
  const isPaid = user?.role === 'admin' ||
    ['basic', 'pro', 'monthly', 'yearly'].includes(planName) ||
    hasProjectsPerm;

  const isPremiumUser = isPaid; // Simplified: if you paid, you're premium

  console.log('User Permissions:', user?.permissions);
  console.log('Is Paid (Access Granted):', isPaid);

  const badgeText = planName ? `${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan` : (isPaid ? 'Premium Plan' : 'Free Plan');

  // Split projects into Free and Premium
  const freeAllowedList = ['todoapp', 'prerequisites'];
  const freeProjects = projects.filter(p => freeAllowedList.includes(p.id?.toLowerCase()?.replace(/[-_]/g, '')));
  const premiumProjects = projects.filter(p => !freeAllowedList.includes(p.id?.toLowerCase()?.replace(/[-_]/g, '')));

  // Show access denied if no permission
  if (!hasAccess && !isLoading && !isPaid) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
          <ProjectsUpsell />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Realtime Projects
              </h1>
              {/* Plan Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPaid
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm'
                : 'bg-gray-200 text-gray-600'
                }`}>
                {badgeText}
              </div>
            </div>
            <p className="text-gray-600">
              Build real-world projects and learn by doing.
            </p>
          </div>
        </motion.div>

        {/* Error State or Upsell */}
        {error ? (
          <ProjectsUpsell />
        ) : (
          <>
            {/* Filters */}
            {categories && categories.length > 0 && (
              <ProjectFilters
                filters={filters}
                categories={categories}
                onFilterChange={updateFilters}
                onClearFilters={clearFilters}
              />
            )}

            {/* Free Foundations Slot */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                <h2 className="text-xl font-bold text-gray-800">Free Foundations</h2>
                <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Unlocked for Everyone</span>
              </div>
              {freeProjects.length > 0 ? (
                <ProjectGrid projects={freeProjects} isLoading={isLoading} />
              ) : (
                !isLoading && <div className="text-gray-500 italic py-4">No free projects found.</div>
              )}
            </div>

            {/* Premium Projects Slot */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-800">Premium Realtime Experience</h2>
                  {!isPaid && user?.role !== 'admin' && (
                    <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" /></svg>
                      Premium Only
                    </span>
                  )}
                </div>

                {!isPaid && user?.role !== 'admin' && (
                  <button
                    onClick={() => navigate('/pricing')}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
                  >
                    Unlock All Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                )}
              </div>

              {premiumProjects.length > 0 ? (
                <div className="relative">
                  <ProjectGrid projects={premiumProjects} isLoading={isLoading} />

                  {/* Upsell Banner Overlay for Free Users */}
                  {!isPaid && user?.role !== 'admin' && !isLoading && (
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                      <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-1">Upgrade to Premium</h3>
                        <p className="text-indigo-100 text-sm max-w-md">
                          Get instance access to Ecommerce Web, AI Intelligent Agent, and all future realtime projects to build your portfolio.
                        </p>
                      </div>

                      <button
                        onClick={() => window.location.href = '/pricing'}
                        className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg whitespace-nowrap"
                      >
                        Get Premium Access
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                !isLoading && <div className="text-gray-500 italic py-4">No premium projects available yet.</div>
              )}
            </div>

            {/* Empty State (when no projects after filtering) */}
            {!isLoading && projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Projects Found</h3>
                <p className="text-gray-500">
                  {filters.category !== 'all' || filters.difficulty !== 'all' || filters.search
                    ? 'Try adjusting your filters to see more projects.'
                    : 'No projects are available at the moment.'}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default StudentRealtimeProjectsPage;

