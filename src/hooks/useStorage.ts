import { useCallback, useMemo } from "react";
import { createStorage, EMPTY } from "../storage/local-storage";
import { debounce } from "../debounce";
import { ensureObject } from "../conversion";
import { useSharedState } from "./useSharedState";

const SERIALIZATION_DEBOUNCE = 1000;

export function useStorage<T>(
  namespace: string,
  defaults: T
): [T, (value: T) => void] {
  const storage = useMemo(() => {
    const storage = createStorage<T>(namespace);
    const storedValue = storage.get();
    return {
      initial:
        storedValue === EMPTY
          ? Object.create(null)
          : ensureObject<T>(storedValue),
      store: debounce(storage.set, SERIALIZATION_DEBOUNCE),
    };
  }, [namespace]);

  const [state, setState] = useSharedState<T>(namespace, storage.initial);

  const updateValues = useCallback(
    (newValues: T) => {
      const nextValues = { ...state, ...newValues };
      setState(nextValues);
      storage.store(nextValues);
    },
    [setState, state, storage]
  );

  const values = useMemo(() => {
    return { ...defaults, ...state };
  }, [defaults, state]);

  return [values, updateValues];
}

type Unnestable<Shape> = [Shape, (value: Partial<Shape>) => void];

export function unnest<Shape extends { [key: string]: any }>(
  hook: () => Unnestable<Shape>
) {
  return function useUnnest<Key extends keyof Shape, Value extends Shape[Key]>(
    key: Key
  ): [Value, (value: Value) => void] {
    const [values, updateValues] = hook();

    const setValue = useCallback(
      (value: Value) => {
        updateValues({ [key]: value } as Partial<Shape>);
      },
      [key, updateValues]
    );

    return [values[key], setValue];
  };
}