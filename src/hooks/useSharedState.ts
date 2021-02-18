import { useCallback, useContext } from "react";
import { Context } from "../context/SharedState";

export function useSharedState<T>(
  key: string,
  fallbackValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useContext(Context);

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      if (value instanceof Function) {
        setState((values) => {
          const prevValue = key in values ? values[key] : fallbackValue;
          return { ...values, [key]: value(prevValue) };
        });
      } else {
        setState((values) => ({ ...values, [key]: value }));
      }
    },
    [key, setState]
  );

  const value = key in state ? state[key] : fallbackValue;

  return [value, setValue];
}
