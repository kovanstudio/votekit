import { NavLink, Redirect, Route, Switch, useParams } from "react-router-dom";
import { BoardProvider, useProject } from "../../../state";
import { schema } from "../../../gql/client";
import { BoardGeneralSettings } from "./general";
import { BoardPrivacySettings } from "./privacy";
import { BoardDeleteSettings } from "./delete";

export default BoardSettings;

export function BoardSettings() {
  const { boardSlug } = useParams();

  const board = schema.useBoardQuery({
    variables: { boardSlug },
    skip: !boardSlug,
  });

  if (!boardSlug) {
    return <Redirect to={`/settings`} />;
  }

  if (board.loading) {
    return <div className="spinner-overlay"/>;
  }

  const boardData = board.data.board;

  return (
    <div className="project-settings-boards group-settings-content">
      <div className="panel-title">Board Settings: {boardData.name}</div>

      <ul className="tab-bar">
        <li>
          <NavLink exact to={`/settings/boards/${boardData.slug}`}>
            General
          </NavLink>
        </li>

        <li>
          <NavLink exact to={`/settings/boards/${boardData.slug}/privacy`}>
            Privacy
          </NavLink>
        </li>

        <li>
          <NavLink exact className="text-danger" to={`/settings/boards/${boardData.slug}/delete`}>
            Delete
          </NavLink>
        </li>
      </ul>

      <BoardProvider value={boardData}>
        <Switch>
          <Route path={`/settings/boards/${boardData.slug}`} exact component={BoardGeneralSettings} />

          <Route path={`/settings/boards/${boardData.slug}/privacy`} component={BoardPrivacySettings} />

          <Route path={`/settings/boards/${boardData.slug}/delete`} component={BoardDeleteSettings} />
        </Switch>
      </BoardProvider>
    </div>
  );
}
