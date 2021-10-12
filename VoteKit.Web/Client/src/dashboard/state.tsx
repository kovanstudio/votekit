import * as React from "react";
import { schema } from "./gql/client";

const ConfigContext = React.createContext<schema.ConfigFragment>(null);
const MeContext = React.createContext<schema.MeFragment>(null);
const ProjectContext = React.createContext<schema.ProjectFragment>(null);
const BoardContext = React.createContext<schema.BoardFragment>(null);

export const ConfigProvider = ConfigContext.Provider;
export const MeProvider = MeContext.Provider;
export const ProjectProvider = ProjectContext.Provider;
export const BoardProvider = BoardContext.Provider;

export function useConfig() {
  return React.useContext(ConfigContext);
}

export function useMe() {
  return React.useContext(MeContext);
}

export function useProject() {
  return React.useContext(ProjectContext);
}

export function useBoard() {
  return React.useContext(BoardContext);
}
