import * as React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../state";

export function ProjectSelector() {
  return null;
  
  // const me = useMe();
  //
  // return (
  //   <section className="container container-main place-center justify-center flex-col">
  //     <div className="panel w-50">
  //       <header className="panel-title">Which Project do you wish to continue with?</header>
  //
  //       <div className="flex-col">
  //         {me.projects.map((p) => (
  //           <Link to={`/p/${p.slug}`} className="panel p-y-20 p-x-100 m-t-10 text-center" key={p.id}>
  //             {p.name}
  //           </Link>
  //         ))}
  //       </div>
  //     </div>
  //   </section>
  // );
}
