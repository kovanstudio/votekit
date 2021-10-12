import * as React from "react";
import { useHistory } from "react-router-dom";
import Modal from "../../components/modal";
import { SelectBoard, SelectMember, SelectStatus } from "../components/selectors";
import { useProject } from "../state";
import { schema } from "../gql/client";

const update = (payload) => ({ type: "update", payload });

type Entry = {
  title: string;
  content: string;
  boardId: string;
  statusId: string;
  assigneeUserId?: string;
};

export function AddEntryModal({ onClose }) {
  const history = useHistory();

  const [entry, dispatch] = React.useReducer((s: Partial<Entry>, a): Partial<Entry> => {
    switch (a.type) {
      case "update":
        return { ...s, ...a.payload };
      default:
        return s;
    }
  }, {});

  const [createEntry, createEntryRes] = schema.useAddEntryMutation({
    refetchQueries: ["entries"],
  });

  return (
    <Modal onClose={onClose}>
      {createEntryRes.loading ? <div className="spinner-overlay" /> : null}
      <form
        className="modal group-add-entry panel"
        style={{ width: "850px" }}
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            let res = await createEntry({
              variables: {
                input: {
                  title: entry.title || "",
                  content: entry.content || null,
                  boardId: entry.boardId || "",
                  statusId: entry.statusId || "",
                  assigneeUserId: entry.assigneeUserId || null,
                },
              },
            });

            history.push(`/entries${res.data.addEntry.pathname}`);
          } catch {}
        }}
        onReset={onClose}
      >
        <header className="panel-title m-b-20">Add New Entry</header>

        <div className="flex">
          <div className="w-60 m-r-20">
            <div className="flex flex-col m-gap-t-def">
              <label htmlFor="addentry-title">Title</label>
              <input
                id="addentry-title"
                className="input-control"
                type="text"
                value={entry.title ?? ""}
                onChange={(e) => dispatch(update({ title: e.target.value }))}
              />
            </div>

            <div className="flex flex-col m-gap-t-def">
              <label htmlFor="addentry-content">Description</label>
              <textarea
                id="addentry-content"
                className="input-control"
                value={entry.content ?? ""}
                onChange={(e) => dispatch(update({ content: e.target.value }))}
                rows={12}
                style={{ resize: "none" }}
              />
            </div>

            {createEntryRes.error ? <p className="m-gap-t-def alert alert-error">{createEntryRes.error.message}</p> : null}

            <div className="flex m-gap-t-def">
              <input type="submit" className="btn-primary" value="Save" disabled={!entry.boardId || !entry.title} />
              <input type="reset" className="btn-light m-l-def" value="Cancel" />
            </div>
          </div>
          <div className="w-40 m-l-20">
            <EntryDetails entry={entry} dispatch={dispatch} />
          </div>
        </div>
      </form>
    </Modal>
  );
}

function EntryDetails({ entry, dispatch }) {
  const project = useProject();

  return (
    <div className="entry-details">
      <div className="form-options">
        <div className="option">
          <label className="option-label">Board</label>

          <div className="option-value">
            <SelectBoard selectSingle project={project} value={entry.boardId ?? null} onChange={(boardId) => dispatch(update({ boardId }))} />
          </div>
        </div>

        <div className="option">
          <label className="option-label">Status</label>

          <div className="option-value">
            <SelectStatus selectFirst project={project} value={entry.statusId ?? null} onChange={(statusId) => dispatch(update({ statusId }))} />
          </div>
        </div>

        <div className="option">
          <label className="option-label">Assignee</label>

          <div className="option-value">
            <SelectMember
              selectFirst
              project={project}
              value={entry.assigneeUserId ?? null}
              onChange={(assigneeUserId) => dispatch(update({ assigneeUserId }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
