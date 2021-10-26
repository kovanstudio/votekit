import { schema } from "../gql/client";
import { useEnsureMe, useMe, useProject } from "../state";
import { Markdown } from "../../components/markdown";
import { AttachIcon, ChevronDownIcon, ChevronUpIcon } from "../../components/icon";
import { TimeAgo } from "../../components/time";
import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { Select } from "../../components/form";
import { confirmDialog } from "../../lib/dialog";
import { useState } from "react";

export default function CommentsPage({ entry, after }: { entry: schema.EntryFragment; after?: string }) {
  const project = useProject();
  const [loadedNext, setLoadedNext] = useState(false);

  const entryComments = schema.useEntryCommentsQuery({
    variables: {
      entryId: entry.id,
      after,
    },
  });

  if (entryComments.loading) {
    return null;
  }

  const comments = entryComments.data?.entry.comments;

  if (!comments.totalCount) {
    return null;
  }

  return (
    <>
      {comments.nodes.map((c) => (
        <Comment comment={c} key={c.id}/>
      ))}

      {loadedNext ? <CommentsPage entry={entry} after={comments.pageInfo.endCursor}/> : null}

      {!loadedNext && comments.pageInfo.hasNextPage ? (
        <div
          className="load-more"
          onClick={(e) => {
            setLoadedNext(true);
          }}
        >
          <ChevronDownIcon/>
        </div>
      ) : null}
    </>
  );
}

function Comment({ comment }: { comment: schema.CommentFragment }) {
  const project = useProject();
  const me = useMe();

  const postedByMe = me && comment.user?.id == me.id;
  const [editing, setEditing] = useState(false);

  const [commentRemove, commentRemoveRes] = schema.useRemoveCommentMutation({
    refetchQueries: ["entryComments"],
  });

  const [commentVote] = schema.useVoteCommentMutation();

  if (editing) {
    return <CommentEditor comment={comment} onClose={(e) => setEditing(false)}/>;
  }

  return (
    <div className="comment" key={comment.id} data-comment-id={comment.id}>
      <span className="comment-icon">
        <a href={"#"}>
          <img src={comment.user?.avatar || "/images/logo-placeholder.jpg"}/>
        </a>
      </span>
      <Markdown className="comment-body">{comment.content}</Markdown>
      <aside className="comment-footer">
        <small
          className={`m-r-15 cursor-pointer ${comment.likedByMe ? "text-default" : ""}`}
          onClick={async (e) => {
            try {
              await commentVote({
                variables: {
                  input: {
                    commentId: comment.id,
                  },
                },
              });
            } catch {
            }
          }}
        >
          {comment.likedByMe ? <ChevronDownIcon className="m-r-5"/> : <ChevronUpIcon className="m-r-5"/>} {comment.stats.likes}
        </small>
        <small className="m-r-15">
          <TimeAgo value={comment.createdAt}/>
        </small>

        {comment.user ? (
          <small>
            <a href="#">{comment.user.displayName}</a>
          </small>
        ) : null}

        {comment.isPrivate ? <small className="emphasis m-l-15">private</small> : null}

        {postedByMe ? (
          <>
            <a
              href="#"
              className="m-l-auto"
              onClick={(e) => {
                e.preventDefault();
                setEditing(true);
              }}
            >
              edit
            </a>
            <a
              href="#"
              className="m-l-10"
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
          </>
        ) : null}
      </aside>
    </div>
  );
}

function CommentEditor({ comment, onClose }: { comment: schema.CommentFragment; onClose: any }) {
  const [content, setContent] = useState(comment.content);

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
    <div className="comment relative" key={comment.id} data-comment-id={comment.id}>
      {commentSaveRes.loading ? <div className="spinner-overlay absolute"/> : null}

      <span className="comment-icon">
        <a href={"#"}>
          <img src={comment.user?.avatar || "/images/logo-placeholder.jpg"}/>
        </a>
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

const commentVisibilityOptions = [
  { label: "Public", value: "public" },
  { label: "Internal", value: "private" },
];

export function CommentForm({ entry }: { entry: schema.EntryFragment }) {
  const project = useProject();
  const me = useMe();
  const ensureMe = useEnsureMe();

  const [focus, setFocus] = useState(false);

  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  let footer = focus || content.trim();

  const [commentCreate, commentCreateRes] = schema.useAddCommentMutation({
    refetchQueries: ["entryComments"],
    awaitRefetchQueries: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let commentCreateRes = await commentCreate({
        variables: {
          input: {
            entryId: entry.id,
            content,
            isPrivate,
          },
        },
      });

      setContent("");
      setIsPrivate(false);

      setTimeout(() => {
        let commentElement = document.querySelector(`[data-comment-id='${commentCreateRes.data.addComment.id}']`);

        if (commentElement) {
          commentElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (e) {
    }
  };

  return (
    <form className="entry-comment-form" onSubmit={handleSubmit}>
      {commentCreateRes.loading ? <div className="spinner-overlay"/> : null}

      <aside className="comment-icon">
        <img src={me?.avatar || "/images/logo-placeholder.jpg"}/>
      </aside>

      <div className="comment-body">
        <TextareaAutosize
          onKeyDown={(e) => {
            if (e.key == "Enter" && e.shiftKey) {
              handleSubmit(e).then((r) => {
              });
            }
          }}
          onFocus={async (e) => {
            setFocus(true)
            await ensureMe();
          }}
          className="input-control"
          placeholder="Leave a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <motion.div
        className="comment-footer"
        variants={{
          active: { height: "auto", marginTop: 10, opacity: 1 },
          inactive: { height: 0, marginTop: 0, opacity: 0 },
        }}
        initial="inactive"
        animate={footer ? "active" : "inactive"}
      >
        {/*<div>*/}
        {/*  <a href="#" className="attach">*/}
        {/*    <AttachIcon className="m-r-2"/> ATTACH FILE*/}
        {/*  </a>*/}
        {/*</div>*/}

        <div className="m-l-auto flex">
          <div style={{ width: "150px" }} className="m-r-20">
            <Select
              className={"w-100"}
              onChange={(e) => setIsPrivate(e.value == "private")}
              options={commentVisibilityOptions}
              value={commentVisibilityOptions.find((v) => v.value == (isPrivate ? "private" : "public"))}
            />
          </div>

          <input type="submit" value="Add Comment"/>
        </div>
      </motion.div>
    </form>
  );
}
