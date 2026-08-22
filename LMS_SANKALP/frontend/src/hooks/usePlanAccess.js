// SANKALP: all courses accessible — no plan gating
const usePlanAccess = () => ({
  tierOrder: 2,
  planName: 'Full Access',
  hasAccess: () => true,
  isLoading: false
})

export default usePlanAccess
