import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { loadSessionFromLocalStorage, clearSessionFromLocalStorage } from '@/lib/auth-storage';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  loadSessionFromLocalStorage();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking admin status for user:', userId);
      
      // Appel de la fonction RPC is_admin avec timeout plus long
      console.log('📞 Calling RPC is_admin...');
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('RPC timeout')), 15000); // 15 secondes
      });
      
      const rpcPromise = supabase.rpc('is_admin', { p_user_id: userId });
      
      try {
        const { data, error } = await Promise.race([rpcPromise, timeoutPromise]) as any;
        
        console.log('📞 RPC call completed');
        console.log('📊 RPC Data:', data);
        console.log('❌ RPC Error:', error);
        
        if (error) {
          console.error('❌ RPC Error details:', error.message, error.code, error.details);
          throw error; // Force le fallback
        }
        
        const adminStatus = Boolean(data);
        console.log('✅ Admin status determined:', adminStatus);
        setIsAdmin(adminStatus);
        return adminStatus;
        
      } catch (rpcError) {
        console.log('🔄 RPC failed, trying direct query as fallback...');
        
        // Fallback: requête directe à la table admins
        const { data: directData, error: directError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle();
        
        console.log('📊 Direct query data:', directData);
        console.log('❌ Direct query error:', directError);
        
        if (directError) {
          console.error('❌ Direct query failed:', directError);
          setIsAdmin(false);
          return false;
        }
        
        const adminStatus = !!directData;
        console.log('✅ Admin status from direct query:', adminStatus);
        setIsAdmin(adminStatus);
        return adminStatus;
      }
      
    } catch (error) {
      console.error('💥 Exception during admin check:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      clearSessionFromLocalStorage();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state change:', event, 'has session:', !!session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('👤 User found, checking admin status...');
        try {
          await checkAdminStatus(session.user.id);
        } catch (error) {
          console.error('Error in admin check:', error);
          if (mounted) setIsAdmin(false);
        }
      } else {
        console.log('👤 No user, setting isAdmin to false');
        if (mounted) setIsAdmin(false);
      }
      
      if (mounted) {
        console.log('⏳ Setting loading to false');
        setLoading(false);
      }
    });

    const getInitialSession = async () => {
      try {
        console.log('🚀 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('🚀 Initial session found:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('👤 Initial session has user, checking admin...');
          try {
            await checkAdminStatus(session.user.id);
          } catch (error) {
            console.error('Error checking admin status on init:', error);
            if (mounted) setIsAdmin(false);
          }
        } else {
          console.log('👤 No initial session user');
          if (mounted) setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) {
          console.log('✅ Initial session check complete, setting loading to false');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    isAdmin,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
