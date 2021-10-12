import * as React from "react";
import { schema } from "../gql/client";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icon";

export interface PaginationConnection {
  totalCount?: number;
  pageInfo?: schema.PageInfoFragment;
}

export function PaginationFooter({ connection, onChange }: { connection: PaginationConnection; onChange?: (delta: number) => void }) {
  return (
    <aside className="pagination-footer">
      <span>
        {connection.totalCount == 0 ? "No results" : null}
        {connection.totalCount == 1 ? <>{connection.totalCount} result found</> : null}
        {connection.totalCount > 1 ? <>{connection.totalCount} results found</> : null}
      </span>
      {connection.pageInfo.hasNextPage || connection.pageInfo.hasPreviousPage ? (
        <div className="actions">
          <button className="btn-light" disabled={!connection.pageInfo.hasPreviousPage} onClick={(e) => onChange?.(-1)}>
            <ChevronLeftIcon className="m-r-5" /> Back
          </button>
          <button className="btn-light" disabled={!connection.pageInfo.hasNextPage} onClick={(e) => onChange?.(1)}>
            Next <ChevronRightIcon className="m-l-5" />
          </button>
        </div>
      ) : null}
    </aside>
  );
}
