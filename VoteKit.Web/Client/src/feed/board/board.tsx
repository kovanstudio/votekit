import { Redirect, Switch, Route, useParams } from "react-router-dom";
import { schema } from "../gql/client";
import { BoardProvider, useProject } from "../state";
import * as React from "react";
import { BoardEntries } from "./entries";
import { Entry } from "../entry/entry";

export function Board() {
  const project = useProject();
  const { boardSlug } = useParams();

  const projectBoard = schema.useBoardQuery({
    variables: {
      boardSlug,
    },
  });

  if (projectBoard.loading) {
    return <div className="spinner-overlay" />;
  }

  if (!projectBoard?.data?.board) {
    return <Redirect to={"/"} />;
  }

  const board = projectBoard.data.board;

  return (
    <BoardProvider value={board}>
      <Switch>
        <Route path={`/${board.slug}`} exact component={BoardEntries} />
        <Route path={`/${board.slug}/:entrySlug`} component={Entry} />
      </Switch>
    </BoardProvider>
  );
}
