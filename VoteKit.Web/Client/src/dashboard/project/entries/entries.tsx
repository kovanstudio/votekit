import * as React from "react";
import { Checkbox, Radio, Select } from "../../../components/form";
import { PlusIcon, SearchIcon } from "../../../components/icon";
import { PaginationFooter } from "../../components/pagination";
import "../../css/modules/feed.scss";
import { schema } from "../../gql/client";
import { AddEntryModal } from "../../entries/modal-add";
import { FeedEntry } from "./entry";

const sortOptions = [
  { label: "Trending", value: "votes" },
  { label: "Most Watched", value: "watchers" },
  { label: "New", value: "createdAt" },
];

export function ProjectEntries() {
  const [filters, setFilters] = React.useState({} as any);
  const [order, setOrder] = React.useState("votes");

  const [adding, setAdding] = React.useState(false);

  const variables = {
    input: {
      query: filters.query || null,
      statusIds: filters.statusIds?.length ? filters.statusIds : null,
      boardIds: filters.boardIds?.length ? filters.boardIds : null,
      isPrivate: filters.isPrivate ?? null,
    },
    orderBy: {
      [order]: "DESC",
    },
  };

  return (
    <div className="container container-main group-feed">
      {adding ? <AddEntryModal onClose={() => setAdding(false)} /> : null}

      <nav className="nav group-feed-nav">
        <Filters filters={filters} setFilters={setFilters} />
      </nav>

      <div className="group-feed-content">
        <div className="panel">
          <header className="panel-header flex place-center">
            <div className="w-30">
              <Select
                placeholder="Sort By..."
                options={sortOptions}
                value={sortOptions.find((o) => o.value == order)}
                onChange={({ value }) => setOrder(value)}
              />
            </div>

            <div className="m-l-auto">
              <button className="btn btn-primary panel-btn" onClick={() => setAdding(true)}>
                <PlusIcon className="m-r-5" />
                Add Feedback
              </button>
            </div>
          </header>

          <EntriesList variables={variables} />
        </div>
      </div>
    </div>
  );
}

export function EntriesList({ variables }: { variables: Partial<schema.EntriesQueryVariables> }) {
  const [paginator, setPaginator] = React.useState({} as any);

  const projectEntries = schema.useEntriesQuery({
    variables: {
      ...variables,
      ...paginator,
    },
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

  return (
    <div className="entries panel-flush">
      {projectEntries.loading ? (
        <div className="spinner-overlay" />
      ) : (
        <>
          {!entries.nodes.length ? (
            <div className="p-20">
              <p className="alert alert-notice m-0">There are no entries matching your filters...</p>
            </div>
          ) : null}

          {entries.nodes.map((e) => (
            <FeedEntry key={e.id} entry={e} />
          ))}

          <PaginationFooter connection={entries} onChange={handlePaginate} />
        </>
      )}
    </div>
  );
}

function Filters({ filters, setFilters }) {
  let boards = schema.useBoardsQuery();
  let statuses = schema.useStatusesQuery();

  const [query, setQuery] = React.useState("");

  return (
    <section className="nav-section">
      <header className="nav-header">FILTER</header>

      <form
        className="nav-form"
        onSubmit={(e) => {
          e.preventDefault();
          setFilters({ query });
        }}
      >
        <div className="flex flex-col m-gap-t-def">
          <div className="input-text">
            <span className="input-addon">
              <SearchIcon className="m-r-10" />
            </span>

            <input
              id="createproject-slug"
              className="input-control"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      <form className="nav-form m-t-20">
        {boards.data?.boards?.length > 1 ? (
          <div className="flex flex-col m-gap-t-def">
            <label>Board</label>

            {boards.data.boards.map((b) => (
              <div key={b.id} className="m-t-5">
                <Checkbox
                  checked={!!filters.boardIds?.includes(b.id)}
                  onChange={(e) => {
                    let filtered = (filters.boardIds || []).filter((x) => x != b.id);

                    if (e.target.checked) {
                      filtered.push(b.id);
                    }

                    setFilters({ ...filters, boardIds: filtered });
                  }}
                  label={b.name}
                />
              </div>
            ))}
          </div>
        ) : null}

        {statuses.data?.statuses?.length ? (
          <div className="flex flex-col m-gap-t-def">
            <label>Status</label>

            {statuses.data.statuses.map((s) => (
              <div key={s.id} className="m-t-10">
                <Checkbox
                  checked={!!filters.statusIds?.includes(s.id)}
                  onChange={(e) => {
                    let filtered = (filters.statusIds || []).filter((x) => x != s.id);

                    if (e.target.checked) {
                      filtered.push(s.id);
                    }

                    setFilters({ ...filters, statusIds: filtered });
                  }}
                  label={s.name}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col m-gap-t-def">
          <label>Visibility</label>

          <div className="m-t-5">
            <Radio
              checked={filters.isPrivate !== false && !filters.isPrivate}
              onChange={() => setFilters({ ...filters, isPrivate: null })}
              label="All"
            />
          </div>

          <div className="m-t-10">
            <Radio checked={filters.isPrivate === true} onChange={() => setFilters({ ...filters, isPrivate: true })} label="Public" />
          </div>

          <div className="m-t-10">
            <Radio checked={filters.isPrivate === false} onChange={() => setFilters({ ...filters, isPrivate: false })} label="Internal" />
          </div>
        </div>
      </form>
    </section>
  );
}
