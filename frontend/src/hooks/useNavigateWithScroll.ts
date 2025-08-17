import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();

  const navigateWithScroll = useCallback((to: string, options?: { replace?: boolean; state?: any }) => {
    navigate(to, options);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
      // Fallback
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, [navigate]);

  return navigateWithScroll;
};
