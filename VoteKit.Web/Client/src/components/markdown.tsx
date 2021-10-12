import ReactMarkdown from "react-markdown";
import "../css/markdown.scss";

export function Markdown({ children, className = "" }) {
  return (
    <ReactMarkdown
      className={`markdown ${className}`}
      skipHtml={true}
      linkTarget="_blank"
      children={children}
    />
  );
}

const identityRenderer = (props) => {
  return <>{props.children}</>;
};

export function MarkdownSummary({ children, className = "" }) {
  return (
    <p className={`markdown ${className}`}>
      <ReactMarkdown
        components={{
          ol: identityRenderer,
          ul: identityRenderer,
          li: (props) => {
            return <> {props.children} </>;
          },
          p: identityRenderer,
          blockquote: identityRenderer,
          a: identityRenderer,
        }}
        skipHtml={true}
      >
        {children}
      </ReactMarkdown>
    </p>
  );
}
