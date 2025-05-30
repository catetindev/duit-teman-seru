
import { useEntrepreneurMode as useEntrepreneurModeContext } from '@/contexts/EntrepreneurModeContext';

/**
 * Custom hook to manage Entrepreneur Mode state
 * Premium users can toggle between personal and business finance views
 * 
 * @deprecated Use useEntrepreneurMode from EntrepreneurModeContext directly
 */
export function useEntrepreneurMode() {
  return useEntrepreneurModeContext();
}
