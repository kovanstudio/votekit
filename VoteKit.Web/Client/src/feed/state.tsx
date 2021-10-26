import { createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { schema, setLoginHandler } from "./gql/client";
import * as React from "react";

const LoginModal = lazy(() => import("./account/login"));

const ConfigContext = createContext<schema.ConfigFragment>(null);
const MeContext = React.createContext<{ me: schema.MeFragment, ensureMe: () => Promise<schema.MeFragment> }>(null);
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

export function useEnsureMe() {
  return React.useContext(MeContext).ensureMe;
}

export function useProject() {
  return useContext(ProjectContext);
}

export function useBoard() {
  return useContext(BoardContext);
}

export function MeProvider({ children, me }: { children: any, me?: schema.MeFragment }) {
  const [show, setShow] = useState(false);

  const promise = useRef<any>(null);
  const resolver = useRef<any>(null);

  const ctx = useMemo(() => ({
    me,
    ensureMe: () => {
      if (!!me)
        return Promise.resolve(me);

      if (promise.current)
        return promise.current;

      return promise.current = new Promise(res => {
        setShow(true);

        resolver.current = (arg) => {
          resolver.current = null;
          promise.current = null;
          res(arg);
        };
      });
    }
  }), [me]);

  useEffect(() => {
    setLoginHandler(ctx.ensureMe);
    return () => setLoginHandler(null);
  }, []);

  const handleClose = () => {
    resolver.current?.();
    setShow(false);
  };

  return <MeContext.Provider value={ctx}>
    <React.Suspense fallback={<div className="spinner-overlay"></div>}>
      {show ? <LoginModal onClose={handleClose}/> : null}
      {children}
    </React.Suspense>
  </MeContext.Provider>
}
