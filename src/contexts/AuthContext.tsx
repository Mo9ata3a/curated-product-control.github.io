
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
      console.log('Checking admin status for user:', userId);
      const { data, error } = await supabase.rpc('is_admin', { p_user_id: userId });
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return false;
      } else {
        console.log('Admin status result:', data);
        setIsAdmin(data || false);
        return data || false;
      }
    } catch (error) {
      console.error('Exception checking admin status:', error);
      setIsAdmin(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // L'état sera nettoyé par onAuthStateChange
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Configuration de l'écouteur d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await checkAdminStatus(session.user.id);
        } catch (error) {
          console.error('Error in admin check:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      // Toujours définir loading à false après traitement
      setLoading(false);
    });

    // Vérifier la session initiale
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session:', session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            await checkAdminStatus(session.user.id);
          } catch (error) {
            console.error('Error checking admin status on init:', error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

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
