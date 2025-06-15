
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('🔍 Checking admin status for user:', userId);
      const { data, error } = await supabase.rpc('is_admin', { p_user_id: userId });
      console.log('RPC is_admin response:', { data, error });

      if (error) {
        console.error('❌ RPC Error:', error);
        setIsAdmin(false);
        return;
      }

      const adminStatus = Boolean(data);
      console.log('✅ Admin status determined:', adminStatus);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('💥 Exception during admin check:', error);
      setIsAdmin(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Auth event: ${event}`);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        checkAdminStatus(session.user.id).finally(() => {
          setLoading(false);
          console.log('✅ Auth check complete.');
        });
      } else {
        setIsAdmin(false);
        setLoading(false);
        console.log('✅ Auth check complete (no user).');
      }
    });

    return () => {
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
