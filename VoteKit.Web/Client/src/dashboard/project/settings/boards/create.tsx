import { useHistory } from "react-router-dom";
import { useConfig, useProject } from "../../../state";
import { slugify } from "../../../../lib/slug";
import { Checkbox } from "../../../../components/form";
import { schema } from "../../../gql/client";
import { useState } from "react";

export function CreateBoard() {
  const config = useConfig();
  const project = useProject();
  const history = useHistory();

  const [addBoard, addBoardRes] = schema.useAddBoardMutation({
    refetchQueries: ["boards"],
    awaitRefetchQueries: true,
  });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="project-settings-boards group-settings-content">
      {addBoardRes.loading ? <div className="spinner-overlay"/> : null}
      <div className="panel-title">Create New Board</div>

      <div className="flex">
        <form
          className="w-60 flex-no-shrink"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              let res = await addBoard({
                variables: {
                  input: {
                    name,
                    slug,
                    isPrivate,
                  },
                },
              });

              if (res.data?.addBoard) {
                history.push(`/settings/boards/${res.data.addBoard.slug}`);
              }
            } catch (e) {}
          }}
          onReset={(e) => {
            setName("");
            setSlug("");
            setIsPrivate(false);
          }}
        >
          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="boardsettings-create-name">Board Name</label>

            <input
              className="input-control"
              id="boardsettings-create-name"
              type="text"
              value={name}
              placeholder="Feature Requests"
              onChange={(e) => {
                if (!slug || slug == slugify(name || "")) {
                  setSlug(slugify(e.target.value));
                }

                setName(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="boardsettings-create-url">URL</label>

            <div className="input-text">
              <label htmlFor="boardsettings-create-url" className="input-addon m-r-1">
                {config.basePath}/
              </label>

              <input
                id="boardsettings-create-url"
                className="input-control"
                type="text"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
              />
            </div>
          </div>

          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="generalsettings-name">Privacy</label>

            <div>
              <Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} label="Internal Board" />
              <p className="m-t-10 m-l-5 text-muted">
                Internal boards are only accessible by team members and identified users. They are perfect for internal application feedback
                collection
              </p>
            </div>
          </div>

          {addBoardRes.error ? <p className="alert alert-error">{addBoardRes.error.message}</p> : null}

          <div className="flex m-gap-t-def m-t-40">
            <input type="submit" className="btn-primary" value="Save" />
            <input type="reset" className="btn-light m-l-def" value="Cancel" />
          </div>
        </form>
      </div>
    </div>
  );
}
