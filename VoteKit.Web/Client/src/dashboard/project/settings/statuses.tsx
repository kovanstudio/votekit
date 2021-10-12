import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { schema } from "../../gql/client";
import ColorPicker from "../../components/color";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "../../../components/icon";
import { useProject } from "../../state";
import { Checkbox, Radio } from "../../../components/form";

export function ProjectStatusesSettings() {
  const project = useProject();
  const statuses = schema.useStatusesQuery();

  return (
    <div className="project-settings-statuses group-settings-content">
      <div className="panel-title">Entry Statuses</div>

      {statuses.loading ? <div className="spinner-overlay" /> : null}
      {statuses.data?.statuses ? (
        <StatusesTable
          statuses={statuses.data.statuses}
          onSave={async () => {
            await statuses.refetch();
          }}
        />
      ) : null}
    </div>
  );
}

const edited = Symbol();
const deleted = Symbol();
const added = Symbol();
const moved = Symbol();

function StatusesTable({ statuses: baseStatuses, onSave }: { statuses: schema.StatusFragment[]; onSave: () => Promise<any> }) {
  const project = useProject();
  const [statuses, setStatuses] = React.useState(baseStatuses);

  const [addStatus, addStatusRes] = schema.useAddStatusMutation();
  const [saveStatus, saveStatusRes] = schema.useSaveStatusMutation();
  const [removeStatus, removeStatusRes] = schema.useRemoveStatusMutation();

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [newids, setNewids] = React.useState({});

  React.useEffect(() => {
    if (!saving && baseStatuses != statuses) {
      setStatuses(baseStatuses);
    }
  }, [saving, baseStatuses]);

  function del(index) {
    let status = statuses[index];

    if (status[added]) {
      let newStatuses = statuses.slice();
      newStatuses.splice(index, 1);
      setStatuses(newStatuses);
    } else {
      update(index, { [deleted]: true });
    }
  }

  function move(index, offset) {
    if (index + offset < 0 || index + offset >= statuses.length) {
      return;
    }

    let newStatuses = statuses.slice() as any;
    newStatuses[index] = { ...statuses[index + offset], [moved]: true };
    newStatuses[index + offset] = { ...statuses[index], [moved]: true };
    setStatuses(newStatuses);
  }

  function update(index, updates) {
    let newStatuses = statuses.slice();
    newStatuses[index] = { ...newStatuses[index], ...updates, [edited]: true };
    
    if (updates.isDefault === true) {
      for (let i = 0; i < newStatuses.length; i++) {
        if (i == index) continue;
        
        if (newStatuses[i].isDefault)
          newStatuses[i] = { ...newStatuses[i], isDefault: null, [edited]: true } as any;
      }
    }
    
    setStatuses(newStatuses);
  }

  async function handleSave(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      let index = 0;
      let newNewids = { ...newids };
      let toDelete = []

      for (let status of statuses) {
        if (status[deleted]) {
          toDelete.push(status.id);
        } else if (status[added]) {
          let res = await addStatus({
            variables: {
              input: {
                name: status.name,
                color: status.color,
                sortIndex: index++,
              },
            },
          });

          newNewids[res.data.addStatus.id] = status.id;

          await saveStatus({
            variables: {
              input: {
                statusId: res.data.addStatus.id,
                isDefault: status.isDefault || null,
                isInRoadmap: status.isInRoadmap,
              },
            },
          });
        } else {
          await saveStatus({
            variables: {
              input: {
                statusId: status.id,
                name: status.name,
                color: status.color,
                isDefault: status.isDefault || null,
                isInRoadmap: status.isInRoadmap,
                sortIndex: index++,
              },
            },
          });
        }
      }
      
      for (let statusId of toDelete) {
        await removeStatus({
          variables: { input: { statusId } },
        });
      }

      setNewids(newNewids);
      setSaved(true);
    } catch (e) {
      setError(e);
    } finally {
      await onSave();
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      onReset={() => {
        setStatuses(baseStatuses);
      }}
    >
      {addStatusRes.loading || saveStatusRes.loading || removeStatusRes.loading ? <div className="spinner-overlay" /> : null}
      <table className="statuses-table">
        <tbody>
          <AnimatePresence>
            {statuses.map((status, index) => (
              <motion.tr
                layout
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                animate={{ opacity: status[deleted] ? 0.6 : 1 }}
                key={newids[status.id] ?? status.id}
              >
                {status[deleted] ? (
                  <td colSpan={4} onClick={() => update(index, { [deleted]: false })} className="cursor-pointer">
                    <input defaultValue="Deleted! Click here to restore" type="text" className="input-control cursor-pointer" readOnly disabled />
                  </td>
                ) : (
                  <>
                    <td className="form-group">
                      <input value={status.name} onChange={(e) => update(index, { name: e.target.value })} type="text" className="input-control" />
                    </td>
                    <td className="form-group" style={{width: "120px"}}>
                      <ColorPicker className="input-control" value={status.color || "ffffff"} onChange={(color) => update(index, { color })} />
                    </td>
                    <td className="form-group" style={{width: "110px"}}>
                      <Radio
                        checked={status.isDefault || false}
                        onChange={(e) => update(index, { isDefault: e.target.checked })}
                        label="Default"
                      />
                    </td>
                    <td className="form-group" style={{width: "110px"}}>
                      <Checkbox
                        checked={status.isInRoadmap}
                        onChange={(e) => update(index, { isInRoadmap: e.target.checked })}
                        label="Roadmap"
                      />
                    </td>

                  </>
                )}
                
                <td className="text-right controls" style={{width:"60px"}}>
                  {!status[deleted] ? (
                    <>
                      <span className={`cursor-pointer ${index == 0 ? "disabled" : ""}`} onClick={() => move(index, -1)}>
                        <ChevronUpIcon />
                      </span>
                      <span className={`m-l-5 cursor-pointer ${index == statuses.length - 1 ? "disabled" : ""}`} onClick={() => move(index, 1)}>
                        <ChevronDownIcon />
                      </span>
                    </>
                  ) : null}
                </td>

                <td className="text-right controls" style={{width:"55px"}}>
                  {!status[deleted] && !status.isDefault ? (

                      <span className={`cursor-pointer ${status.isDefault ? "text-muted" : ""}`} onClick={() => del(index)}>
                        Remove
                      </span>
  
                  ) : null}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {saved ? <p className="m-gap-t-def alert alert-success">Status list saved successfully</p> : null}

      {error && !saved ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

      <div className="flex m-t-30">
        <input type="submit" className="btn-primary" value="Save" />
        <input type="reset" className="btn-light m-l-def" value="Cancel" />

        <button
          className="btn btn-light m-l-auto"
          onClick={(e) => {
            e.preventDefault();

            setStatuses([
              ...statuses,
              {
                id: Date.now(),
                name: "new status",
                color: "7b64ff",
                [added]: true,
              } as any,
            ]);
          }}
        >
          <PlusIcon className="m-r-5" />
          Add New Status
        </button>
      </div>
    </form>
  );
}
