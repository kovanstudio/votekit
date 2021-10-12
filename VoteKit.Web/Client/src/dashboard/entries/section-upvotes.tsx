import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from "../../components/icon";
import { TimeAgo } from "../../components/time";
import { schema } from "../gql/client";

export function EntryUpvotes({ entry }: { entry: schema.EntryFragment }) {
  return (
    <div className="entry-upvotes m-t-30">
      <UpvotesPage entry={entry} />
    </div>
  );
}

function UpvotesPage({ entry, after }: { entry: schema.EntryFragment; after?: string }) {
  const [loadedNext, setLoadedNext] = React.useState(false);

  const entryComments = schema.useEntryUpvotersQuery({
    variables: {
      entryId: entry.id,
      after,
    },
  });

  if (entryComments.loading) return <div className="spinner-overlay" />;

  if (!entryComments.data.entry.upvoters.totalCount) {
    return <p>This entry has no upvotes...</p>;
  }

  return (
    <>
      {entryComments.data?.entry.upvoters.nodes.map((c) => (
        <Link to={`/people/${c.id}`} className="upvote" key={c.id}>
          <img src={c.avatar} className="user-avatar" />
          <span>{c.displayName}</span>
          <span className="m-l-auto">
            Last seen <TimeAgo value={c.seenAt} />
          </span>
        </Link>
      ))}

      {loadedNext ? <UpvotesPage entry={entry} after={entryComments.data.entry.upvoters.pageInfo.endCursor} /> : null}

      {loadedNext && entryComments.data?.entry.upvoters.pageInfo.hasNextPage ? (
        <div className="load-more" onClick={() => setLoadedNext(true)}>
          <ChevronDownIcon />
        </div>
      ) : null}
    </>
  );
}
