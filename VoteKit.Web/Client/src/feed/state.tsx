import { createContext, useContext } from "react";
import { schema } from "./gql/client";
import * as React from "react";

const ConfigContext = createContext<schema.ConfigFragment>(null);
const MeContext = React.createContext<schema.MeFragment>(null);
const ProjectContext = createContext<schema.ProjectFragment>(null);
const BoardContext = createContext<schema.BoardFragment>(null);

export const ConfigProvider = ConfigContext.Provider;
export const MeProvider = MeContext.Provider;
export const ProjectProvider = ProjectContext.Provider;
export const BoardProvider = BoardContext.Provider;

export function useConfig() {
  return useContext(ConfigContext);
}

export function useMe() {
  return React.useContext(MeContext);
}

export function useProject() {
  return useContext(ProjectContext);
}

export function useBoard() {
  return useContext(BoardContext);
}
