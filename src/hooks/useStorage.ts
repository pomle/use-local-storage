import { useCallback, useMemo } from "react";
import { createStorage, EMPTY } from "../storage/local-storage";
import { debounce } from "../debounce";
import { ensureObject } from "../conversion";
import { useSharedState } from "./useSharedState";

type StorageValues = {
  [key: string]: StorageValues | string | number | boolean | undefined;
};

const SERIALIZATION_DEBOUNCE = 1000;

export function useStorage<T extends StorageValues>(
  namespace: string,
  defaults: T
): [T, (value: Partial<T>) => void] {
  const storage = useMemo(() => {
    const storage = createStorage<Partial<T>>(namespace);
    const storedValue = storage.get();
    return {
      initial:
        storedValue === EMPTY
          ? Object.create(null)
          : ensureObject<T>(storedValue),
      store: debounce(storage.set, SERIALIZATION_DEBOUNCE),
    };
  }, [namespace]);

  const [state, setState] = useSharedState<Partial<T>>(
    namespace,
    storage.initial
  );

  const updateValues = useCallback(
    (newValues: Partial<T>) => {
      setState((state) => {
        const nextValues = { ...state, ...newValues };
        storage.store(nextValues);
        return nextValues;
      });
    },
    [setState, storage]
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
