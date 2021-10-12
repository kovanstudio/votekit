import { Link, Redirect, useParams } from "react-router-dom";
import { schema } from "../gql/client";
import { useBoard } from "../state";
import { BellIcon, CheckIcon, ChevronLeftIcon } from "../../components/icon";
import { TimeAgo } from "../../components/time";
import { Markdown } from "../../components/markdown";
import { Status, Upvotes } from "../components/entry";
import CommentsPage, { CommentForm } from "./comments";
import * as React from "react";

export function Entry() {
  const board = useBoard();
  const { entrySlug } = useParams();

  const enrryRes = schema.useLookupEntryQuery({
    variables: {
      boardSlug: board.slug,
      entrySlug,
    },
  });

  if (enrryRes.loading) {
    return <div className="spinner-overlay" />;
  }

  const entry = enrryRes.data?.lookupEntry;

  if (!entry) {
    return <Redirect to={`/${board.slug}`} />;
  }

  return (
    <section className="main">
      <div className="container">
        <div className="panel group-board">
          <header className="panel-header">
            <Link to={`/${board.slug}`} className="flex text-inherit">
              <ChevronLeftIcon className="m-r-5" /> Back to board
            </Link>

            <div className="header-addons">
              <Subscribe entry={entry} />
            </div>
          </header>

          <div className="panel-body group-entry">
            <div className="entry">
              <div className="entry-header">
                <div className="row">
                  <h2>{entry.title}</h2>

                  <EntryHeaderUpvoters entry={entry} />

                  <aside className="score">
                    <Upvotes entry={entry} />
                  </aside>
                </div>

                <aside className="row ">
                  <Status entry={entry} className="m-r-15" />
                  <div className="actions">
                    <TimeAgo value={entry.createdAt} className="m-r-15" />
                  </div>
                </aside>

                {entry.content ? <Markdown className="row">{entry.content}</Markdown> : null}
              </div>

              <div className="entry-content entry-comments">
                <CommentsPage entry={entry} />
              </div>

              <div className="entry-footer">
                <CommentForm entry={entry} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EntryHeaderUpvoters({ entry }: { entry: schema.EntryFragment }) {
  const entryUpvoters = schema.useEntryUpvotersQuery({
    variables: {
      entryId: entry.id,
    },
  });

  const upvoters = entryUpvoters.data?.entry.upvoters;

  if (!upvoters?.totalCount) {
    return null;
  }

  return (
    <div className="voters">
      {upvoters.totalCount > 6 ? <span className="more">+{upvoters.totalCount - 6} more</span> : null}

      {upvoters.nodes.slice(0, 6).map((u) => (
        <a href="#" key={u.id}>
          <img src={u.avatar} />
        </a>
      ))}
    </div>
  );
}

export function Subscribe({ entry }: { entry: schema.EntryFragment }) {
  const [subscribeEntry] = schema.useSubscribeEntryMutation();
  const [unSubscribeEntry] = schema.useUnSubscribeEntryMutation();

  if (entry.subscribedByMe) {
    return (
      <a
        href="#"
        className="flex text-success"
        onClick={async (e) => {
          e.preventDefault();
          await unSubscribeEntry({ variables: { input: { entryId: entry.id } } });
        }}
      >
        <CheckIcon className="m-r-5" />
        Subscribed to Updates
      </a>
    );
  }

  return (
    <a
      href="#"
      className="flex text-muted"
      onClick={async (e) => {
        e.preventDefault();
        await subscribeEntry({ variables: { input: { entryId: entry.id } } });
      }}
    >
      <BellIcon className="m-r-5" />
      Subscribe
    </a>
  );
}
