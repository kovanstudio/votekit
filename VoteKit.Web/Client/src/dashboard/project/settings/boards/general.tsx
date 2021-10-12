import * as React from "react";
import { slugify } from "../../../../lib/slug";
import { useBoard, useConfig, useProject } from "../../../state";
import ColorPicker from "../../../components/color";
import { useOverrides } from "../../../../lib/useOverrides";
import { schema } from "../../../gql/client";
import { useHistory } from "react-router-dom";

export function BoardGeneralSettings() {
  const project = useProject();
  const board = useBoard();
  const config = useConfig();
  const history = useHistory();

  const [saveBoard, { error, loading, data }] = schema.useSaveBoardMutation();
  const [{ name, slug, color }, update] = useOverrides(board, [board.id]);

  return (
    <form
      className="w-60 flex-no-shrink"
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          let prevSlug = board.slug;

          const res = await saveBoard({
            variables: {
              input: {
                boardId: board.id,
                name,
                slug,
                color,
              },
            },
          });

          if (res.data.saveBoard.slug != prevSlug) {
            history.replace({
              pathname: `/settings/boards/${res.data.saveBoard.slug}`,
              state: { boardSaved: true },
            });
          }
        } catch (e) {}
      }}
      onReset={() => {
        update(null);
      }}
    >
      <div className="flex flex-col m-gap-t-def">
        {loading ? <div className="spinner-overlay"/> : null}
        <label htmlFor="boardsettings-update-name">Board Name</label>

        <input
          className="input-control"
          id="boardsettings-update-name"
          type="text"
          value={name}
          placeholder="Feature Requests"
          onChange={(e) => update({ name: e.target.value })}
        />
      </div>

      <div className="flex flex-col m-gap-t-def">
        <label htmlFor="boardsettings-update-url">URL</label>

        <div className="input-text">
          <label htmlFor="boardsettings-update-url" className="input-addon m-r-1">
            {config.basePath}/
          </label>

          <input
            id="boardsettings-update-url"
            className="input-control"
            type="text"
            value={slug}
            onChange={(e) => update({ slug: slugify(e.target.value) })}
          />
        </div>
      </div>

      <div className="flex flex-col m-gap-t-def">
        <label htmlFor="boardsettings-update-color">Accent Color</label>

        <ColorPicker value={color} onChange={(color) => update({ color })} />
      </div>

      {data ? <p className="m-gap-t-def alert alert-success">Board settings saved successfully</p> : null}

      {error ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

      <div className="flex m-gap-t-def m-t-40">
        <input type="submit" className="btn-primary" value="Save" />
        <input type="reset" className="btn-light m-l-def" value="Cancel" />
      </div>
    </form>
  );
}
