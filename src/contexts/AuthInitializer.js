// /components/AuthInitializer.js
"use client";

import { useEffect } from 'react';

export default function AuthInitializer() {
  useEffect(() => {
    // 🔥 تتبع عدد التبويبات المفتوحة
    const tabId = Math.random().toString(36).substring(7);
    sessionStorage.setItem('currentTabId', tabId);
    
    // 🔥 إدارة أحداث visibility (عند تبديل التبويبات)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // عند العودة للتبويب، تحديث البيانات إذا لزم الأمر
        const lastUpdate = localStorage.getItem('auth_last_update');
        const now = Date.now();
        
        if (lastUpdate && now - parseInt(lastUpdate) > 60000) { // 1 دقيقة
          localStorage.setItem('auth_force_refresh', 'true');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 🔥 تنظيف البيانات عند إغلاق التبويب
    const handleBeforeUnload = () => {
      // حذف معرف التبويب فقط
      sessionStorage.removeItem('currentTabId');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null; // هذا مكون غير مرئي
}