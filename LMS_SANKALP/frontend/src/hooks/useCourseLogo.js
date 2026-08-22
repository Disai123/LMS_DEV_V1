import { useState, useEffect } from 'react';
import { api } from '../services/api';

const useCourseLogo = (courseId, hasLogo) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId || !hasLogo) {
      setLogoUrl(null);
      return;
    }

    const fetchLogo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching logo for course ${courseId}`);
        const response = await api.get(`/courses/${courseId}/logo?t=${Date.now()}`, {
          cache: 'no-cache'
        });
        
        console.log('Logo response status:', response.status);
        console.log('Logo response data:', response.data);
        
        if (response.data.success && response.data.data && response.data.data.logoUrl) {
          setLogoUrl(response.data.data.logoUrl);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching course logo:', err);
        setError(err.message);
        setLogoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [courseId, hasLogo]);

  return { logoUrl, loading, error };
};

export default useCourseLogo;
