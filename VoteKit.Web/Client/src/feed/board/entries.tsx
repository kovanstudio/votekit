import { PlusIcon, SearchIcon } from "../../components/icon";
import { schema } from "../gql/client";
import { MarkdownSummary } from "../../components/markdown";
import { TimeAgo } from "../../components/time";
import * as React from "react";
import { Link } from "react-router-dom";
import { useBoard, useProject } from "../state";
import { Status, Upvotes } from "../components/entry";
import { PaginationFooter } from "../../dashboard/components/pagination";

export function BoardEntries() {
  const project = useProject();
  const board = useBoard();

  const [paginator, setPaginator] = React.useState({} as any);
  const [order, setOrder] = React.useState("votes");
  const [query, setQuery] = React.useState("");

  const variables = {
    input: {
      boardIds: [board.id],
      query,
    },
    orderBy: {
      [order]: "DESC",
    },
  };

  const projectEntries = schema.useEntriesQuery({
    variables: {
      ...variables,
      ...paginator,
    },
    fetchPolicy: "network-only",
  });

  const entries = projectEntries.data?.entries;
  const pageInfo = entries?.pageInfo;

  const handlePaginate = React.useCallback(
    (delta: number) => {
      if (delta > 0 && pageInfo?.hasNextPage) {
        setPaginator({ after: pageInfo.endCursor });
      } else if (delta < 0 && pageInfo?.hasPreviousPage) {
        setPaginator({ before: pageInfo.startCursor });
      }
    },
    [pageInfo]
  );

  const [tempQuery, setTempQuery] = React.useState("");

  return (
    <section className="main">
      <div className="container">
        <div className="panel group-board">
          <header className="panel-header">
            Trending
            <div className="header-addons">
              <div className="input-text  m-r-10" style={{ width: "160px" }}>
                <span className="input-addon">
                  <SearchIcon className="m-r-10" />
                </span>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setQuery(tempQuery);
                  }}
                >
                  <input
                    id="createproject-slug"
                    className="input-control"
                    type="text"
                    placeholder="Search..."
                    value={tempQuery}
                    onChange={(e) => setTempQuery(e.target.value)}
                  />
                </form>
              </div>
              <Link to="/entries/add" className="btn">
                <PlusIcon /> <span className="m-l-5 mobile--display-none">Make a suggestion</span>
              </Link>
            </div>
          </header>

          <div className="panel-body">
            {entries?.nodes.length ? (
              <div className="entries">
                {entries.nodes.map((e) => (
                  <Entry entry={e} key={e.id} />
                ))}
              </div>
            ) : null}

            {entries?.totalCount === 0 ? (
              <div className="alert alert-notice m-y-0">We could not find any feedback entries matching your criteria.</div>
            ) : null}
          </div>

          {entries ? <PaginationFooter connection={entries} onChange={handlePaginate} /> : null}
        </div>
      </div>
    </section>
  );
}

function Entry({ entry }: { entry: schema.EntryFragment }) {
  return (
    <article className="entry">
      <section className="entry-body">
        <header className="entry-header">
          <Link to={entry.pathname}>{entry.title}</Link>
        </header>

        {entry.content ? (
          <Link to={entry.pathname}>
            <MarkdownSummary className="entry-content">{entry.content}</MarkdownSummary>
          </Link>
        ) : null}

        <footer className="entry-footer">
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
