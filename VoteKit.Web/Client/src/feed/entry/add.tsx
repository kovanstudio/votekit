import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SelectBoard } from "../components/selectors";
import { schema } from "../gql/client";
import { Status, Upvotes } from "../components/entry";
import { TimeAgo } from "../../components/time";
import { OrderBy } from "../../gql/feed/schema";
import { CommentIcon } from "../../components/icon";

export function AddEntry() {
  const history = useHistory();
  const [addEntry, addEntryRes] = schema.useAddEntryMutation();

  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [board, setBoard] = useState(null);

  title = title.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let res = await addEntry({
      variables: {
        input: {
          title,
          content: description,
          boardId: board,
        },
      },
    });

    history.push(res.data.addEntry.pathname);
  };

  return (
    <section className="main">
      <div className="container">
        <div className="panel">
          <header className="panel-header">Make a Suggestion</header>

          <div className="panel-body group-entry-add">
            <div className="group-entry-add-body">
              <form className="entry-add" onSubmit={handleSubmit}>
                <div className="flex flex-col m-gap-t-def">
                  <label htmlFor="login-email">
                    Short, descriptive <b>title</b>
                  </label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} id="login-email" className="input-control flex-grow" type="text" />
                </div>

                <div className="flex flex-col m-gap-t-def">
                  <label htmlFor="login-email">
                    Choose the <b>board</b> it belongs to
                  </label>
                  <SelectBoard selectSingle={true} onChange={setBoard} value={board} />
                </div>

                <div className="flex flex-col m-gap-t-def">
                  <label htmlFor="login-email">
                    <b>Describe</b> your suggestion
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="login-email"
                    className="input-control flex-grow"
                    rows={10}
                  />
                </div>

                {addEntryRes.error ? <div className="m-gap-t-def alert alert-error">{addEntryRes.error.message}</div> : null}

                <div className="flex m-gap-t-def">
                  <input type="submit" className="btn-primary m-l-auto" value="Save" disabled={!title || !board} />
                </div>
              </form>
            </div>

            <Sidebar title={title} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Sidebar({ title = "" }) {
  const projectEntries = schema.useEntriesQuery({
    variables: {
      input: {
        query: title,
      },
      orderBy: {
        votes: OrderBy.Desc
      },
      first: 4
    }
  });
  
  return (
    <aside className="group-entry-add-sidebar">
      {projectEntries.data?.entries.totalCount ? <h3>Is your post similar to one of these?</h3> : <h3>We could not find similar entries to yours.</h3>}
      
      <div className="entries">
        {projectEntries.data?.entries.nodes.map(e => <SidebarEntry entry={e} key={e.id} />)}
      </div>
    </aside>
  );
}

function SidebarEntry({ entry }: { entry: schema.EntryFragment }) {
  return (
    <article className="entry entry-card">
      <aside className="entry-score">
        <Upvotes entry={entry} />
      </aside>
      
      <section className="entry-body">
        <header className="entry-header">
          <Link to={entry.pathname}>{entry.title}</Link>
        </header>

        <footer className="entry-footer">
          <Status entry={entry} className="m-r-15" />
          <small>
            <TimeAgo value={entry.createdAt} />
          </small>
          <small className="m-l-10 flex place-center"><CommentIcon className="m-r-5" /> {entry.stats.comments}</small>
        </footer>
      </section>
    </article>
  );
}
