'use client';

import { useState, useEffect } from 'react';
import { INITIAL_DASHBOARD_DATA } from '@/lib/constants';
import { fetchDashboardData } from '@/lib/api';

export function useDashboardData() {
  const [data, setData] = useState(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('Sep 15, 2026 - Sep 21, 2026');
  const [activityTimeframe, setActivityTimeframe] = useState('Last 7 Days');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetchDashboardData();
        if (isMounted) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    loading,
    timeRange,
    setTimeRange,
    activityTimeframe,
    setActivityTimeframe,
  };
}
