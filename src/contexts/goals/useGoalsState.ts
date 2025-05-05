
// This file is now a simple re-export from the state directory
import { useGoalsState as useRefactoredGoalsState } from './state/useGoalsState';

export function useGoalsState() {
  return useRefactoredGoalsState();
}
