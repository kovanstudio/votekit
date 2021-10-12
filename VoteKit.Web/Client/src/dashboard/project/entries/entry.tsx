import * as React from "react";
import { Link } from "react-router-dom";
import { Status, Upvotes } from "../../components/entry";
import { MarkdownSummary } from "../../../components/markdown";
import { TimeAgo } from "../../../components/time";
import { schema } from "../../gql/client";

export function FeedEntry({ entry }: { entry: schema.EntryFragment }) {
  return (
    <article className="entry">
      <section className="entry-body">
        <header className="entry-header">
          <Link to={`/entries${entry.pathname}`}>{entry.title}</Link>
        </header>

        {entry.content ? (
          <Link to={`/entries${entry.pathname}`}>
            <MarkdownSummary className="entry-content">{entry.content}</MarkdownSummary>
          </Link>
        ) : null}

        <footer className="entry-footer">
          {entry.isPrivate ? <span className="entry-status entry-status-private">Internal</span> : null}
          {entry.isLocked ? <span className="entry-status entry-status-locked">Locked</span> : null}
          {entry.isArchived ? <span className="entry-status entry-status-archived">Archived</span> : null}
          
          <Status entry={entry} className="m-r-15" />
          <small>
            <TimeAgo value={entry.createdAt} />
          </small>
          <small className="m-l-10">{entry.stats.comments} comments</small>
        </footer>
      </section>

      <aside className="entry-score">
        <Upvotes entry={entry} />
      </aside>
    </article>
  );
}
