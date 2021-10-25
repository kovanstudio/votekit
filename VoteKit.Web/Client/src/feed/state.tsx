import { createContext, useContext, useMemo, useRef, useState } from "react";
import { schema } from "./gql/client";
import * as React from "react";


const ConfigContext = createContext<schema.ConfigFragment>(null);
const MeContext = React.createContext<{
  me: schema.MeFragment,
  setHandler: any,
  ensure: any
}>(null);
const ProjectContext = createContext<schema.ProjectFragment>(null);
const BoardContext = createContext<schema.BoardFragment>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ProjectProvider = ProjectContext.Provider;
export const BoardProvider = BoardContext.Provider;

export function useConfig() {
  return useContext(ConfigContext);
}

export function useMe() {
  return React.useContext(MeContext).me;
}

export function useProject() {
  return useContext(ProjectContext);
}

export function useBoard() {
  return useContext(BoardContext);
}

export function MeProvider({ children, value }: { children: any, value?: schema.MeFragment }) {
  let loginHandlerRef = useRef(null);

  let ctx = useMemo(() => ({
    me: value,
    setHandler: handler => loginHandlerRef.current = handler,
    ensure: () => {
      if (!!value) {
        return value;
      }

      if (loginHandlerRef.current) {
        return loginHandlerRef.current()
      }

      return Promise.reject(new Error("Unable to initialize login"));
    }
  }), [value, loginHandlerRef]);

  return <MeContext.Provider value={ctx}>{children}</MeContext.Provider>
}
