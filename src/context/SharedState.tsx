import React, { createContext, useState } from "react";

type State = {
  [key: string]: any;
};

type SharedStateValue = [State, React.Dispatch<React.SetStateAction<State>>];

const fail = () => {
  throw new Error("State stored without context");
};

export const Context = createContext<SharedStateValue>([{}, fail]);

interface SharedStateContextProps {
  children?: React.ReactNode;
}

export const SharedStateContext = ({ children }: SharedStateContextProps) => {
  const state = useState<State>({});
  return <Context.Provider value={state}>{children}</Context.Provider>;
};
