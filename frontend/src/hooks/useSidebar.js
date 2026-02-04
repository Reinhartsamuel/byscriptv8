import { useState, useCallback } from 'react';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prevState => !prevState);
  }, []);

  return { isCollapsed, toggleSidebar };
}
