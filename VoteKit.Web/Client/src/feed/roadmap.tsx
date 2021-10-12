import { CommentIcon, PlusIcon, SearchIcon } from "../components/icon";
import React from "react";
import "./css/modules/roadmap.scss";
import { schema } from "./gql/client";
import { Status, Upvotes } from "./components/entry";
import { TimeAgo } from "../components/time";
import { Link } from "react-router-dom";
import { OrderBy } from "../gql/feed/schema";

export function Roadmap() {
  const statuses = schema.useStatusesQuery();
  const roadmapStatuses = statuses.data?.statuses.filter((s) => s.isInRoadmap) ?? [];

  return (
    <section className="main">
      <div className="container container-wide">
        {statuses.loading ? <div className="spinner-overlay"/> : null}
        <div className="group-roadmap">
          {roadmapStatuses.map((s) => (
            <StatusBoard key={s.id} status={s}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusBoard({ status }: { status: schema.StatusFragment }) {
  const entries = schema.useEntriesQuery({
    variables: {
      input: {
        statusIds: [status.id],
      },
      orderBy: {
        votes: OrderBy.Desc,
      },
      first: 10,
    },
  });

  return (
    <div className="panel group-roadmap-board pos-relative">
      {entries.loading ? <div className="spinner-overlay"/> : null}
      <header className="panel-header">{status.name}</header>

      <div className="panel-body entries">
        {entries.data?.entries.nodes.map((e) => (
          <RoadmapEntry key={e.id} entry={e}/>
        ))}

        {!entries.loading && !entries.data?.entries.totalCount ? <div className="alert alert-notice m-y-0">It is All Alone Here</div> : null}
      </div>
    </div>
  );
}

function RoadmapEntry({ entry }: { entry: schema.EntryFragment }) {
  return (
    <article className="entry entry-card">
      <aside className="entry-score">
        <Upvotes entry={entry}/>
      </aside>

      <section className="entry-body">
        <span
          className="entry-status entry-status-light m-b-5"
          style={{
            backgroundColor: `#${entry.board.color.substring(0, 6)}20`,
            color: `#${entry.board.color.substring(0, 6)}`,
          }}
        >
          {entry.board.name}
        </span>

        <header className="entry-header m-t-5">
          <Link to={entry.pathname}>{entry.title}</Link>
        </header>

        <footer className="entry-footer">
          <small>
            <TimeAgo value={entry.createdAt}/>
          </small>
          <small className="m-l-10 flex place-center">
            <CommentIcon className="m-r-5"/> {entry.stats.comments}
          </small>
        </footer>
      </section>
    </article>
  );
}
