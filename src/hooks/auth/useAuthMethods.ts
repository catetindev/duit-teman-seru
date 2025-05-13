import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage hook

export const useAuthMethods = () => {
  const { t } = useLanguage(); // Use the hook to access translations

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
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase signOut error:', error);
        // Even if Supabase signout fails, we should proceed to clear local state
        // The AuthContext listener for onAuthStateChange should handle clearing user/session.
        // We throw the error so the UI can potentially inform the user of a partial failure.
        throw error; 
      }
      
      toast.success("Logged out successfully");
      // The onAuthStateChange listener in AuthContext will handle clearing user/session state.
      return Promise.resolve();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Use the translation key for the fallback message
      toast.error(error.message || t('auth.logoutFailed')); 
      // Propagate the error so the calling component knows the logout wasn't fully successful.
      // The AuthContext listener should still clear local state upon detecting no session.
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