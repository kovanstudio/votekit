import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon } from "../../components/icon";
import { Markdown } from "../../components/markdown";
import { TimeAgo } from "../../components/time";
import { schema } from "../gql/client";
import { confirmDialog } from "../../lib/dialog";
import TextareaAutosize from "react-textarea-autosize";

export function EntryComments({ entry }: { entry: schema.EntryFragment }) {
  return (
    <div className="entry-comments m-t-30">
      <CommentsPage entry={entry} />
    </div>
  );
}

function CommentsPage({ entry, after }: { entry: schema.EntryFragment; after?: string }) {
  const [loadedNext, setLoadedNext] = React.useState(false);

  const entryComments = schema.useEntryCommentsQuery({
    variables: {
      entryId: entry.id,
      after,
    },
  });

  if (entryComments.loading) return <div className="spinner-overlay"></div>;

  if (!entryComments.data.entry.comments.totalCount) {
    return <p>This entry has no comments...</p>;
  }

  return (
    <>
      {entryComments.data?.entry.comments.nodes.map((c) => (
        <Comment comment={c} key={c.id} />
      ))}

      {loadedNext ? <CommentsPage entry={entry} after={entryComments.data.entry.comments.pageInfo.endCursor} /> : null}

      {!loadedNext && entryComments.data?.entry.comments.pageInfo.hasNextPage ? (
        <div
          className="load-more"
          onClick={(e) => {
            setLoadedNext(true);
          }}
        >
          <ChevronDownIcon />
        </div>
      ) : null}
    </>
  );
}

function Comment({ comment }: { comment: schema.CommentFragment }) {
  const [editing, setEditing] = React.useState(false);

  const [commentRemove, commentRemoveRes] = schema.useRemoveCommentMutation({
    refetchQueries: ["entryComments"],
  });

  const [commentVote] = schema.useVoteCommentMutation();

  if (editing) {
    return <CommentEditor comment={comment} onClose={(e) => setEditing(false)} />;
  }

  return (
    <div className="comment relative" key={comment.id}>
      {commentRemoveRes.loading ? <div className="spinner-overlay absolute"></div> : null}
      <span className="comment-icon">
        {comment.user ? (
          <Link to={`/people/${comment.user.id}`}>
            <img src={comment.user.avatar} />
          </Link>
        ) : (
          <img src="/images/logo-placeholder.jpg" />
        )}
      </span>

      <Markdown className="comment-body">{comment.content}</Markdown>

      <aside className="comment-footer">
        <small
          className={`m-r-15 cursor-pointer ${comment.likedByMe ? "text-default" : ""}`}
          onClick={async () => {
            try {
              await commentVote({
                variables: {
                  input: {
                    commentId: comment.id,
                  },
                },
              });
            } catch {}
          }}
        >
          {comment.likedByMe ? <ChevronDownIcon className="m-r-5" /> : <ChevronUpIcon className="m-r-5" />} {comment.stats.likes}
        </small>
        <small className="m-r-15">
          <TimeAgo value={comment.createdAt} />
        </small>

        {comment.user ? (
          <small>
            <Link to={`/people/${comment.user.id}`}>{comment.user.displayName}</Link>
          </small>
        ) : null}

        <a
          href="#"
          className="comment-action m-l-auto"
          onClick={(e) => {
            e.preventDefault();
            setEditing(true);
          }}
        >
          edit
        </a>
        <a
          href="#"
          className="comment-action m-l-10"
          onClick={async (e) => {
            e.preventDefault();

            if (!(await confirmDialog("Are you sure?"))) return;

            await commentRemove({
              variables: {
                input: { commentId: comment.id },
              },
            });
          }}
        >
          delete
          {commentRemoveRes.error ? <span className="text-danger m-l-5">(failed)</span> : null}
        </a>
      </aside>
    </div>
  );
}

function CommentEditor({ comment, onClose }: { comment: schema.CommentFragment; onClose: any }) {
  const [content, setContent] = React.useState(comment.content);

  const [commentSave, commentSaveRes] = schema.useSaveCommentMutation({
    refetchQueries: ["entryComments"],
    awaitRefetchQueries: true,
  });

  const handleSave = async (e) => {
    e.preventDefault();

    await commentSave({
      variables: {
        input: {
          commentId: comment.id,
          content,
        },
      },
    });

    onClose();
  };

  return (
    <div className="comment relative" key={comment.id}>
      {commentSaveRes.loading ? <div className="spinner-overlay absolute"/> : null}
      <span className="comment-icon">
        {comment.user ? (
          <Link to={`/people/${comment.user.id}`}>
            <img src={comment.user.avatar} alt="User avatar" />
          </Link>
        ) : (
          <img src="/images/logo-placeholder.jpg" alt="User avatar"/>
        )}
      </span>

      <div className="comment-body">
        <TextareaAutosize
          autoFocus
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.shiftKey) {
              handleSave(e).then((r) => {
              });
            }
          }}
          onFocus={(e) => {
          }}
          className="input-control"
          placeholder="Leave a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <aside className="comment-footer">
        {commentSaveRes.error ? <small className="text-danger">{commentSaveRes.error.message}</small> : null}

        <a href="#" className="m-l-auto" onClick={onClose}>
          cancel
        </a>
        <a href="#" className="m-l-10 text-primary" onClick={handleSave}>
          save
        </a>
      </aside>
    </div>
  );
}
