'use client';

import { useState, useEffect, useCallback } from 'react';
import { INITIAL_DASHBOARD_DATA } from '@/lib/constants';
import { fetchDashboardData } from '@/lib/api';

export function useDashboardData() {
  const [data, setData] = useState(INITIAL_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('All Time (Live)');
  const [activityTimeframe, setActivityTimeframe] = useState('Real-Time Stream');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchDashboardData();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchDashboardData()
      .then((res) => {
        if (!ignore) setData(res);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return {
    data,
    loading,
    refresh: load,
    timeRange,
    setTimeRange,
    activityTimeframe,
    setActivityTimeframe,
  };
}
