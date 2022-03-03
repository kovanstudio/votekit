import { motion } from "framer-motion";
import React from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { Status, Upvotes } from "../components/entry";
import { Checkbox, Select } from "../../components/form";
import { SelectBoard, SelectMember, SelectStatus } from "../components/selectors";
import { TimeAgo } from "../../components/time";
import "../css/modules/entry.scss";
import { schema } from "../gql/client";
import { useMe, useProject } from "../state";
import { EntrySections } from "./sections";
import { EditEntryModal } from "./modal-edit";
import { Markdown } from "../../components/markdown";
import { useOverrides } from "../../lib/useOverrides";
import { confirmDialog } from "../../lib/dialog";

export function EntryRoutes() {
  return <Entry/>;
}

export function Entry() {
  const { boardSlug, entrySlug } = useParams();

  const entryRes = schema.useLookupEntryQuery({
    variables: {
      boardSlug,
      entrySlug,
    },
  });

  if (entryRes.loading) return <div className="spinner-overlay"/>;
  if (!entryRes.data?.lookupEntry) return <Redirect to="/"/>;

  const entry = entryRes.data.lookupEntry;

  return (
    <div className="container container-main group-entry">
      <div className="group-entry-content">
        <EntryContent entry={entry}/>
        <EntrySections entry={entry}/>
      </div>
      <nav className="nav group-entry-nav">
        <EntryDetails entry={entry}/>
      </nav>
    </div>
  );
}

function EntryContent({ entry }: { entry: schema.EntryFragment }) {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="panel entry">
      {editing ? <EditEntryModal entry={entry} onClose={() => setEditing(false)}/> : null}
      <div className="entry-header">
        <div className="row">
          <h2>{entry.title}</h2>

          <EntryContentUpvoters entry={entry}/>

          <aside className="score">
            <Upvotes entry={entry}/>
          </aside>
        </div>

        <aside className="row ">
          {entry.isPrivate ? <span className="entry-status entry-status-private">Internal</span> : null}
          {entry.isLocked ? <span className="entry-status entry-status-locked">Locked</span> : null}
          {entry.isArchived ? <span className="entry-status entry-status-archived">Archived</span> : null}
          <Status entry={entry} className="m-r-15"/>
          <div className="actions">
            <TimeAgo value={entry.createdAt} className="m-r-15"/>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setEditing(true);
              }}
            >
              edit
            </a>
          </div>
        </aside>

        {entry.content ? <Markdown className="row">{entry.content}</Markdown> : null}
      </div>

      <div className="entry-footer">
        <EntryCommentForm entry={entry}/>
      </div>
    </div>
  );
}

function EntryContentUpvoters({ entry }: { entry: schema.EntryFragment }) {
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
        <Link to={`/people/${u.id}`} key={u.id}>
          <img src={u.avatar} alt="User avatar"/>
        </Link>
      ))}
    </div>
  );
}

function EntryDetails({ entry }: { entry: schema.EntryFragment }) {
  const history = useHistory();
  const project = useProject();

  const [data, update, { isDirty }] = useOverrides(
    {
      entryId: entry.id,
      boardId: entry.board.id,
      statusId: entry.status.id,
      assignedUserId: entry.assignedUser?.id ?? null,
      isPrivate: entry.isPrivate,
      isLocked: entry.isLocked,
      isArchived: entry.isArchived,
    },
    [entry]
  );

  const [entrySave, entrySaveRes] = schema.useSaveEntryMutation({
    refetchQueries: ["projectEntries"],
  });

  const [entryRemove, entryRemoveRes] = schema.useRemoveEntryMutation({
    refetchQueries: ["projectEntries"],
  });

  const handleSave = async (input = data) => {
    try {
      let oldPathname = entry.pathname;

      let res = await entrySave({
        variables: {
          input,
        },
      });

      if (res.data.saveEntry.pathname != oldPathname) {
        history.replace(`/entries${res.data.saveEntry.pathname}`);
      } else {
        update(null);
      }
    } catch {
    }
  };

  return (
    <div className="panel-narrow entry-details">
      {entrySaveRes.loading ? <div className="spinner-overlay"/> : null}
      <h4 className="m-b-20">Details</h4>
      <form
        className="form-options"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSave();
        }}
        onReset={(e) => {
          e.preventDefault();
          update(null);
        }}
      >
        <div className="option">
          <label className="option-label">Board</label>

          <div className="option-value">
            <SelectBoard project={project} value={data.boardId} onChange={(boardId) => update({ boardId })}/>
          </div>
        </div>

        <div className="option">
          <label className="option-label">Status</label>

          <div className="option-value">
            <SelectStatus project={project} value={data.statusId} onChange={(statusId) => update({ statusId })}/>
          </div>
        </div>

        <div className="option">
          <label className="option-label">Assignee</label>

          <div className="option-value">
            <SelectMember
              placeholder="Unassigned"
              project={project}
              value={data.assignedUserId}
              isClearable={true}
              onChange={(assignedUserId) => update({ assignedUserId })}
            />
          </div>
        </div>

        <div className="option">
          <div className="option-value">
            <Checkbox label="Internal Entry" checked={data.isPrivate} onChange={(e) => update({ isPrivate: e.target.checked })}/>
            <p className="checkbox-description">Internal entries are hidden from the outside users and only visible to your team members</p>
          </div>
        </div>

        {entrySaveRes.error ? <p className="m-gap-t-def alert alert-error">{entrySaveRes.error.message}</p> : null}

        {isDirty() ? (
          <div className="actions">
            <input type="reset" className="btn-light" value="Cancel"/>
            <input type="submit" value="Save"/>
          </div>
        ) : entry.isArchived ? (
          <div className="actions">
            <button
              className="btn-action"
              onClick={async (e) => {
                e.preventDefault();
                await handleSave(update({ isArchived: false }));
              }}
            >
              Unarchive
            </button>
            <button className="btn-danger" onClick={async (e) => {
              e.preventDefault();
              if (!(await confirmDialog("Are you sure?"))) return;
              await entryRemove({ variables: { input: { entryId: entry.id } } });
              history.replace("/entries")
            }}>Delete
            </button>
          </div>
        ) : (
          <div className="actions">
            <button
              className="btn-action"
              onClick={async (e) => {
                e.preventDefault();
                await handleSave(update({ isArchived: true }));
              }}
            >
              Archive
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                await handleSave(update({ isLocked: !entry.isLocked }));
              }}
              className="btn-action"
            >
              {entry.isLocked ? "Unlock" : "Lock"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

const commentVisibilityOptions = [
  { label: "Public", value: "public" },
  { label: "Internal", value: "private" },
];

function EntryCommentForm({ entry }: { entry: schema.EntryFragment }) {
  const me = useMe();

  const [focus, setFocus] = React.useState(false);

  const [content, setContent] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);

  let footer = focus || content.trim();

  const [addComment, addCommentRes] = schema.useAddCommentMutation({
    refetchQueries: ["entryComments", "lookupEntry"],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addComment({
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
    } catch (e) {
    }
  };

  //TODO: Delete

  return (
    <form className="entry-comment-form" onSubmit={handleSubmit}>
      {addCommentRes.loading ? <div className="spinner-overlay"/> : null}

      <aside className="comment-icon">
        <img src={me.avatar} alt="User avatar"/>
      </aside>

      <div className="comment-body">
        <TextareaAutosize
          onKeyDown={async (e) => {
            if (e.key == "Enter" && e.shiftKey) {
              await handleSubmit(e);
            }
          }}
          onFocus={() => setFocus(true)}
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
        {/*    <AttachIcon className="m-r-2" /> ATTACH FILE*/}
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
