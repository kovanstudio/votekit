import { schema } from "../gql/client";
import { CheckIcon, ChevronUpIcon } from "../../components/icon";
import * as React from "react";

export function Upvotes({ entry }: { entry: schema.EntryFragment }) {
  const [entryVote] = schema.useVoteEntryMutation({
    refetchQueries: ["entryUpvoters"],
  });

  return (
    <span
      className={`entry-upvotes ${entry.upvotedByMe ? "voted" : ""}`}
      onClick={async (e) => {
        try {
          await entryVote({
            variables: {
              input: {
                entryId: entry.id,
                delta: entry.upvotedByMe ? schema.VoteDelta.Down : schema.VoteDelta.Up,
              },
            },
          });
        } catch (e) {}
      }}
    >
      {entry.upvotedByMe ? <CheckIcon /> : <ChevronUpIcon />}
      {entry.stats.votes}
    </span>
  );
}

export function Status({ entry, className = "" }: { entry: schema.EntryFragment; className?: string }) {
  return (
    <span
      className={`entry-status ${className}`}
      style={{
        backgroundColor: `#${entry.status.color}20`,
        color: `#${entry.status.color}`,
      }}
    >
      {entry.status.name}
    </span>
  );
}
