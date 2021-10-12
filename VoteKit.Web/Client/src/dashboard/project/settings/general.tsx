import { useState } from "react";
import { useHistory } from "react-router-dom";
import { schema } from "../../gql/client";
import { useConfig, useProject } from "../../state";
import { ImageUploader } from "../../../components/upload";
import { useOverrides } from "../../../lib/useOverrides";

export function ProjectGeneralSettings() {
  const config = useConfig();
  const project = useProject();
  const history = useHistory();

  const [saveProject, { error, loading }] = schema.useSaveProjectMutation();

  const [saved, setSaved] = useState(history.location?.state?.projectSaved ?? false);

  const [projectData, update] = useOverrides(project);

  return (
    <div className="project-settings-general group-settings-content">
      {loading ? <div className="spinner-overlay"/> : null}
      <div className="panel-title">Project Settings</div>
      <div className="flex">
        <form
          className="w-60 flex-no-shrink"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              let res = await saveProject({
                variables: {
                  input: {
                    name: projectData.name,
                    website: projectData.website,
                  },
                },
              });

              setSaved(true);
              update(null);
            } catch (e) {
              setSaved(false);
            }
          }}
          onReset={(e) => {
            update(null);
            setSaved(false);
          }}
        >
          <div className="flex-col m-gap-t-def">
            <label htmlFor="generalsettings-name">Project Name</label>

            <input
              className="input-control"
              id="generalsettings-name"
              type="text"
              value={projectData.name || ""}
              placeholder="My Project"
              onChange={(e) => update({ name: e.target.value })}
            />
          </div>

          <div className="flex-col m-gap-t-def">
            <label htmlFor="generalsettings-website">Website</label>

            <input
              className="input-control"
              id="generalsettings-website"
              type="text"
              value={projectData.website || ""}
              placeholder="http://example.com"
              onChange={(e) => update({ website: e.target.value })}
            />
          </div>

          {saved ? <p className="m-gap-t-def alert alert-success">Project settings saved successfully</p> : null}

          {error ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

          <div className="flex m-gap-t-def m-t-40">
            <input type="submit" className="btn-primary" value="Save" />
            <input type="reset" className="btn-light m-l-def" value="Cancel" />
          </div>
        </form>
        <aside className="m-l-40">
          <div className="flex-col">
            <label>Project Logo & Favicon</label>
            <p className="m-b-10">Use an image at least 250x250 for best results. Favicon needs to be a square image.</p>

            <div className="flex align-items-end">
              <ImageUploader
                className="project-logo"
                projectId={project.id}
                onChange={async (image) => {
                  await saveProject({
                    variables: {
                      input: {
                        logoImageId: image.id,
                      },
                    },
                  });
                }}
              >
                <img src={projectData.logoURL} alt="Project Logo" />
              </ImageUploader>

              <ImageUploader
                className="project-favicon m-l-10"
                projectId={project.id}
                onChange={async (image) => {
                  await saveProject({
                    variables: {
                      input: {
                        faviconImageId: image.id,
                      },
                    },
                  });
                }}
              >
                <img src={projectData.faviconURL} alt="Project Favicon" />
              </ImageUploader>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
