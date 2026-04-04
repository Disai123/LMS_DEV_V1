export const COURSE_MANIFEST = [
  { key: 'python', title: 'Python', plan: 'free', sequence: 1 },
  { key: 'machine', title: 'Machine Learning', plan: 'free', sequence: 2 },
  { key: 'deep learning', title: 'Deep Learning', plan: 'basic', sequence: 3 },
  { key: 'nlp', title: 'NLP', plan: 'basic', sequence: 4 },
  { key: 'gen ai', title: 'Genai & Langchain', plan: 'basic', sequence: 5 },
  { key: 'rag', title: 'RAG', plan: 'pro', sequence: 6 },
  { key: 'ai agent', title: 'Ai Agents', plan: 'pro', sequence: 7 },
  { key: 'mcp', title: 'MCP', plan: 'pro', sequence: 8 },
];

export const getCourseMetadata = (title) => {
  if (!title) return null;
  const lowerTitle = title.toLowerCase();
  return COURSE_MANIFEST.find(m => lowerTitle.includes(m.key));
};

export const TIER_ORDER = { free: 0, basic: 1, pro: 2 };

export const hasPlanAccess = (userPlanTierOrder, requiredPlan) => {
  const required = TIER_ORDER[requiredPlan] ?? 0;
  return userPlanTierOrder >= required;
};
