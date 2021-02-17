import React, { createContext, useState } from "react";

type State = {
  [key: string]: any;
};

type SharedStateValue = [State, React.Dispatch<React.SetStateAction<State>>];

const fail = () => {
  throw new Error("State stored without context");
};

export const Context = createContext<SharedStateValue>([{}, fail]);

const EMPTY = Object.create(null);

interface SharedStateContextProps {
  children?: React.ReactNode;
}

export const SharedStateContext = ({ children }: SharedStateContextProps) => {
  const state = useState<State>(EMPTY);
  return <Context.Provider value={state}>{children}</Context.Provider>;
};
