import { useCallback, useContext } from "react";
import { Context } from "../context/SharedState";

export function useSharedState<T>(
  key: string,
  fallbackValue: T
): [T, (value: T) => void] {
  const [state, setState] = useContext(Context);

  const setValue = useCallback(
    (value: T) => {
      setState((values) => ({ ...values, [key]: value }));
    },
    [key, setState]
  );

  const value = key in state ? state[key] : fallbackValue;

  return [value, setValue];
}
