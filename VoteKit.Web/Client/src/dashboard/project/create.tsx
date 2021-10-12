import * as React from "react";
import { Redirect } from "react-router-dom";
import { schema } from "../gql/client";
import { useConfig } from "../state";
import { slugify } from "../../lib/slug";

export default CreateProject;

export function CreateProject() {
  return null;
  
  // const [createProject, { error, data }] = schema.useCreateProjectMutation();
  // const config = useConfig();
  //
  // const [name, setName] = React.useState("");
  // const [slug, setSlug] = React.useState("");
  //
  // if (data?.createProject?.id) {
  //   return <Redirect to={`/p/${data.createProject.slug}`} />;
  // }
  //
  // return (
  //   <section className="container container-main place-center flex-col">
  //     <form
  //       className="panel create-project-form w-50"
  //       onSubmit={async (e) => {
  //         e.preventDefault();
  //
  //         try {
  //           await createProject({
  //             variables: { input: { name, slug } },
  //           });
  //         } catch (e) {}
  //       }}
  //     >
  //       <header className="panel-title">Create New Project</header>
  //       <div className="flex flex-col m-gap-t-def">
  //         <label htmlFor="createproject-name">Project Name</label>
  //         <input
  //           id="createproject-name"
  //           className="input-control"
  //           type="text"
  //           value={name}
  //           onChange={(e) => {
  //             setName(e.target.value);
  //             setSlug(slugify(e.target.value));
  //           }}
  //         />
  //       </div>
  //
  //       <div className="flex flex-col m-gap-t-def">
  //         <label htmlFor="createproject-slug">Subdomain</label>
  //
  //         <div className="input-text">
  //           <input id="createproject-slug" className="input-control" type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
  //
  //           <span className="input-addon">.{config.hostname}</span>
  //         </div>
  //       </div>
  //
  //       <div className="flex flex-col m-gap-t-def">
  //         <input type="submit" className="bg-primary" value="Create Project" />
  //       </div>
  //
  //       {error ? <p className="m-gap-t-def color-danger text-center ws-pre">{error.message}</p> : null}
  //     </form>
  //   </section>
  // );
}
