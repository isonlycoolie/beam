import { Copy } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
  return (
    <div className="codeBlock">
      <div className="codeBlockHeader">
        <span>{language.toLowerCase()}</span>
        <button aria-label="Copy code" className="iconButton" type="button">
          <Copy size={15} />
        </button>
      </div>
      <Highlight code={code} language={language} theme={themes.nightOwl}>
        {({ className, getLineProps, getTokenProps, style, tokens }) => (
          <pre className={className} style={style}>
            {tokens.map((line, index) => (
              <span
                {...getLineProps({ line })}
                className="codeLine"
                key={index}
              >
                <span className="lineNumber">{index + 1}</span>
                <span>
                  {line.map((token, tokenIndex) => (
                    <span
                      {...getTokenProps({ token })}
                      key={`${index}-${tokenIndex}`}
                    />
                  ))}
                </span>
              </span>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
