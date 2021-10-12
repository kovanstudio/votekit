import * as React from "react";
import { useHistory } from "react-router-dom";
import { useOverrides } from "../../lib/useOverrides";
import Modal from "../../components/modal";
import { schema } from "../gql/client";

export function EditEntryModal({ onClose, entry }: { onClose: () => void; entry: schema.EntryFragment }) {
  const history = useHistory();

  const [data, update] = useOverrides(entry, [entry]);
  const [entrySave, entrySaveRes] = schema.useSaveEntryMutation();

  return (
    <Modal onClose={onClose}>
      {entrySaveRes.loading ? <div className="spinner-overlay"/> : null}

      <form
        className="modal group-edit-entry panel"
        style={{ width: "500px" }}
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            let oldPathname = entry.pathname;

            let res = await entrySave({
              variables: {
                input: {
                  entryId: entry.id,
                  title: data.title || "",
                  content: data.content || null,
                },
              },
            });

            onClose();

            if (res.data.saveEntry.pathname != oldPathname) {
              history.replace(`/entries${res.data.saveEntry.pathname}`);
            }
          } catch {
          }
        }}
        onReset={onClose}
      >
        <header className="panel-title m-b-20">Edit Entry</header>

        <div className="flex">
          <div className="w-100">
            <div className="flex flex-col m-gap-t-def">
              <label htmlFor="addentry-title">Title</label>
              <input
                id="addentry-title"
                className="input-control"
                type="text"
                value={data.title ?? ""}
                onChange={(e) => update({ title: e.target.value })}
              />
            </div>

            <div className="flex flex-col m-gap-t-def">
              <label htmlFor="addentry-content">Description</label>
              <textarea
                id="addentry-content"
                className="input-control"
                value={data.content ?? ""}
                onChange={(e) => update({ content: e.target.value })}
                rows={6}
                style={{ resize: "none" }}
              />
            </div>

            {entrySaveRes.error ? <p className="m-gap-t-def alert alert-error">{entrySaveRes.error.message}</p> : null}

            <div className="flex m-gap-t-def">
              <input type="submit" className="btn-primary" value="Save" disabled={!data.title}/>
              <input type="reset" className="btn-light m-l-def" value="Cancel"/>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
