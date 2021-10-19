import TextareaAutosize from "react-textarea-autosize";
import { useProject } from "../../state";

export function ProjectWidgetSettings() {
  let project = useProject();
  let baseUrl = location.origin;

  let embedCode = [
    `<script>`,
    `  window.votekit = (window.votekit || {`,
    `    queue: [], `,
    `    on: function(n,x) { window.votekit.queue.push("on", [n,x]) }),`,
    `    render: function(s,o) { window.votekit.queue.push("render", [s,o]) })`,
    `  }`,
    `</script>`,
    `<script src="${baseUrl}/client/widget.js" />`
  ].join("\r\n");

  return <div className="project-settings-widget group-settings-content">
    <div className="panel-title">Widget Setup</div>
    <div>
      <p className="m-b-10">Please insert the following code into your website head to initialize the widget loader.</p>
      <TextareaAutosize className="embed-code" value={embedCode}/>
    </div>

    <div className="m-t-40">
      <h4>Display Widget</h4>
      <p className="m-y-10">If you wish to trigger the widget using a link, you can do so by adding <code>data-votekit</code> attribute.</p>
      <TextareaAutosize className="embed-code m-y-10" value={`<a data-votekit href="${baseUrl}">Roadmap</a>`}/>
      <p className="m-y-10">Or you can trigger it programmatically</p>
      <TextareaAutosize className="embed-code m-y-10" value={`<script>\r\n  votekit.render("${baseUrl}");\r\n</script>`}/>
    </div>

    <div className="flex">
      <a href={baseUrl} data-votekit="true" className="btn m-l-auto">Test The Widget</a>
    </div>

    <div className="m-t-40">
      <h4 className="flex">User Identification (SSO) <span className="text-muted m-l-auto">optional</span></h4>
      <p className="m-y-10">If you wish to provide your own user data to VoteKit, you can do so with the SSO feature. You users will seamlessly be
        logged into the VoteKit interface using this feature.</p>
      <h5 className="m-y-10">Your SSO Secret:</h5>
      <TextareaAutosize className="embed-code m-y-10" value={project.ssoConfig.ssoKey}/>
      <h5 className="m-y-10 m-t-30">Create a JWT token using the given secret (sample node.js code):</h5>
      <TextareaAutosize className="embed-code m-y-10" value={[
        `const jwt = require('jsonwebtoken');`,
        ``,
        `const user = {`,
        '  id: "<USER_ID>",',
        '  email: "<USER_EMAIL>",',
        '  name: "<USER_NAME>" //optional',
        '  // you can have additional attributes',
        `};`,
        '',
        `const ssoToken = jwt.sign(user, '${project.ssoConfig.ssoKey}', { algorithm: 'HS256' });`,
      ].join("\r\n")}/>

      <h5 className="m-y-10 m-t-30">Provide the token to render method:</h5>
      <TextareaAutosize className="embed-code m-y-10" value={`<script>\r\n  votekit.render("${baseUrl}", { ssoToken: "<TOKEN>" });\r\n</script>`}/>
      <p className="m-y-10">You can also use the link</p>
      <TextareaAutosize className="embed-code m-y-10" value={`<a data-votekit data-votekit-sso-token="<TOKEN>" href="${baseUrl}">Roadmap</a>`}/>
    </div>

  </div>
}
