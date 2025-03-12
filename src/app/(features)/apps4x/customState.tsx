import { useState, useMemo } from "react";

export const useGroupedState = (initialValues: Record<string, any> = {}) => {
  const [state, setState] = useState<any>(initialValues);

  // Memoized state object
  const stateObject = useMemo(() => state, [state]);

  // Dynamic state updater (Auto-adds missing keys)
  const updateState = (key: string, value: any) => {
    setState((prev: any) => ({ ...prev, [key]: value }));
  };

  return { stateObject, setState: updateState };
};
