
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthMethods = () => {
  const login = async (email: string, password?: string) => {
    try {
      const { error } = password
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signInWithOtp({ email });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || "Failed to login");
        return error;
      }
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.message || "An unexpected error occurred");
      return error;
    }
  };

  const signup = async (email: string, password?: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || "Failed to sign up");
        return error;
      }
      
      console.log('Signup successful, user data:', data);
    } catch (error: any) {
      console.error('Signup failed', error);
      toast.error(error.message || "An unexpected error occurred");
      return error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out: Calling supabase.auth.signOut()');
      // Attempt to sign out from Supabase with explicit scope
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error; 
      }
      
      // Clear any cached data or local state
      localStorage.removeItem('entrepreneurMode');
      
      // We don't need to manually redirect, as the onAuthStateChange event
      // in AuthContext will handle updating the UI after logout
      return Promise.resolve();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Propagate the error so the calling component knows the logout wasn't successful
      return Promise.reject(error);
    }
  };

  return {
    login,
    signup,
    logout,
    signOut: logout // Alias for compatibility
  };
};
