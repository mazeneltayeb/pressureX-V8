// // /contexts/AuthContext.js
// "use client";

// import { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { supabase } from '/lib/supabaseClient';

// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [userProfile, setUserProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const isMounted = useRef(true);

//   useEffect(() => {
//     isMounted.current = true;

//     const initializeAuth = async () => {
//       try {
//         // جلب الجلسة الحالية
//         const { data: { session } } = await supabase.auth.getSession();
        
//         if (session?.user && isMounted.current) {
//           setUser(session.user);
//           await fetchUserProfile(session.user.id);
//         }
//       } catch (error) {
//         console.error('Auth initialization error:', error);
//       } finally {
//         if (isMounted.current) {
//           setLoading(false);
//         }
//       }
//     };

//     initializeAuth();

//     // الاستماع لتغييرات المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log('Auth event:', event);
        
//         if (!isMounted.current) return;
        
//         if (session?.user) {
//           setUser(session.user);
//           await fetchUserProfile(session.user.id);
//         } else {
//           setUser(null);
//           setUserProfile(null);
//         }
//         setLoading(false);
//       }
//     );

//     return () => {
//       isMounted.current = false;
//       subscription?.unsubscribe();
//     };
//   }, []);

//   const fetchUserProfile = async (userId) => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('id', userId)
//         .single();

//       if (!error && data && isMounted.current) {
//         setUserProfile(data);
//       }
//     } catch (error) {
//       console.error('Profile fetch error:', error);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       if (isMounted.current) {
//         setUser(null);
//         setUserProfile(null);
//       }
//     } catch (error) {
//       console.error('Sign out error:', error);
//       throw error;
//     }
//   };

//   const value = {
//     user,
//     userProfile,
//     loading,
//     signOut,
//     isAuthenticated: !!user,
//     refreshProfile: () => user && fetchUserProfile(user.id)
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




// /contexts/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '/lib/supabaseClient';

const AuthContext = createContext({});

// 🔥 متغير كاش خارجي لحالة المستخدم (مشترك بين جميع التبويبات)
let globalUser = null;
let globalAuthLoading = true;
let authListeners = new Set(); // لتتبع جميع الـ listeners

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(globalUser);
  const [loading, setLoading] = useState(globalAuthLoading);
  const isMounted = useRef(true);
  const [initialized, setInitialized] = useState(false);

  // 🔥 تحديث الحالة المحلية عند تغيير الحالة العالمية
  useEffect(() => {
    const updateLocalState = () => {
      if (isMounted.current) {
        setUser(globalUser);
        setLoading(globalAuthLoading);
      }
    };

    // إضافة هذا الـ listener للمجموعة
    authListeners.add(updateLocalState);

    return () => {
      if (isMounted.current) {
        authListeners.delete(updateLocalState);
      }
      isMounted.current = false;
    };
  }, []);

  // 🔥 تحديث جميع الـ listeners عند تغيير الحالة
  const updateAllListeners = (newUser, newLoading) => {
    globalUser = newUser;
    globalAuthLoading = newLoading;
    
    // تحديث جميع الـ listeners
    authListeners.forEach(listener => listener());
  };

  // 🔥 تهيئة المصادقة (تتم مرة واحدة فقط)
  useEffect(() => {
    if (initialized) return;

    const initializeAuth = async () => {
      // إذا كان هناك مستخدم مخزن في localStorage، استخدمه
      const savedUser = localStorage.getItem('auth_user');
      const savedTimestamp = localStorage.getItem('auth_timestamp');
      
      if (savedUser && savedTimestamp) {
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق
        
        if (now - timestamp < CACHE_DURATION) {
          updateAllListeners(JSON.parse(savedUser), false);
          setInitialized(true);
          return;
        }
      }

      try {
        // فقط التبويب الأول يقوم بجلب الجلسة
        if (!globalUser && authListeners.size === 1) {
          console.log('🔐 First tab fetching session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            localStorage.setItem('auth_user', JSON.stringify(session.user));
            localStorage.setItem('auth_timestamp', Date.now().toString());
            updateAllListeners(session.user, false);
          } else {
            updateAllListeners(null, false);
          }
        } else {
          // التبويبات الأخرى تستخدم البيانات المخزنة
          updateAllListeners(globalUser, false);
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        updateAllListeners(null, false);
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    // 🔥 الاستماع لتغييرات المصادقة (مشترك بين جميع التبويبات)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event);
        
        if (session?.user) {
          localStorage.setItem('auth_user', JSON.stringify(session.user));
          localStorage.setItem('auth_timestamp', Date.now().toString());
          updateAllListeners(session.user, false);
        } else {
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_timestamp');
          updateAllListeners(null, false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialized]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_timestamp');
      updateAllListeners(null, false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    initialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};