import * as React from "react";
import { schema } from "../../../gql/client";
import { useBoard } from "../../../state";

export function BoardDeleteSettings() {
  const board = useBoard();
  const [confirmation, setConfirmation] = React.useState("");

  const [removeBoard, { error }] = schema.useRemoveBoardMutation({
    refetchQueries: ["boards"],
  });

  return (
    <form
      className="w-100 flex-no-shrink"
      onSubmit={async (e) => {
        e.preventDefault();

        if (confirmation != "DELETE BOARD") {
          return;
        }

        try {
          await removeBoard({
            variables: {
              input: {
                boardId: board.id,
              },
            },
          });
        } catch (e) {}
      }}
    >
      <p className="text-danger m-gap-t-def">
        Once you delete a board, all posts within the board will also be
        deleted. <b>There is no way to recover them</b>. Please be certain.
      </p>

      <div className="flex flex-col m-gap-t-def">
        <label htmlFor="account-settings-delete">
          Please type "DELETE BOARD" in the field below:
        </label>

        <input
          className="input-control"
          id="account-settings-delete"
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
      </div>

      {error ? (
        <p className="m-gap-t-def alert alert-error">{error.message}</p>
      ) : null}

      <div className="flex m-gap-t-def m-gap-t-def">
        <input
          disabled={confirmation != "DELETE BOARD"}
          type="submit"
          className="btn-danger"
          value="Delete Board"
        />
      </div>
    </form>
  );
}
