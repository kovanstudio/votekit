import * as React from "react";
import { Checkbox } from "../../../../components/form";
import { useOverrides } from "../../../../lib/useOverrides";
import { schema } from "../../../gql/client";
import { useBoard } from "../../../state";

export function BoardPrivacySettings() {
  const board = useBoard();

  const [saveBoard, { error, loading, data }] = schema.useSaveBoardMutation();
  const [{ isPrivate, isListed, isSeoIndexed }, update] = useOverrides(board, [
    board.id,
  ]);

  return (
    <form
      className="w-100 flex-no-shrink"
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          await saveBoard({
            variables: {
              input: {
                boardId: board.id,
                isPrivate,
                isSeoIndexed,
                isListed,
              },
            },
          });
        } catch (e) {}
      }}
      onReset={(e) => {
        update(null);
      }}
    >
      <div className="flex flex-col m-gap-t-def">
        <div>
          <Checkbox
            checked={isPrivate}
            onChange={(e) => update({ isPrivate: e.target.checked })}
            label="Internal Board"
          />
          <p className="m-t-10 m-l-5 text-muted">
            Internal boards are only accessible by team members and identified
            users. They are perfect for internal application feedback collection
          </p>
        </div>
      </div>

      <div className="flex flex-col m-gap-t-def">
        <div>
          <Checkbox
            checked={!isListed}
            onChange={(e) => update({ isListed: !e.target.checked })}
            label="Unlisted Board"
          />
          <p className="m-t-10 m-l-5 text-muted">
            By default all boards are listed on the project homepage. If you do
            not wish to display this board on the project home, you can unlist
            it.
          </p>
        </div>
      </div>

      {isPrivate ? null : (
        <div className="flex flex-col m-gap-t-def">
          <div>
            <Checkbox
              checked={isSeoIndexed}
              onChange={(e) => update({ isSeoIndexed: e.target.checked })}
              label="Allow Search Engine Index"
            />
            <p className="m-t-10 m-l-5 text-muted">
              Allows search engines to crawl and index board content
            </p>
          </div>
        </div>
      )}

      {data ? (
        <p className="m-gap-t-def alert alert-success">
          Board settings saved successfully
        </p>
      ) : null}

      {error ? (
        <p className="m-gap-t-def alert alert-error">{error.message}</p>
      ) : null}

      <div className="flex m-gap-t-def m-t-40">
        <input type="submit" className="btn-primary" value="Save" />
        <input type="reset" className="btn-light m-l-def" value="Cancel" />
      </div>
    </form>
  );
}
