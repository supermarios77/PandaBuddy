import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const LectureContent = ({ content }: { content: string }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-10 mb-6 text-gray-800 dark:text-gray-300" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-300" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-300" {...props} />,
          p: ({ node, ...props }) => <p className="text-lg my-4 text-gray-700 dark:text-gray-300" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside my-4 space-y-3 text-lg text-gray-700 dark:text-gray-200" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside my-4 space-y-3 text-lg text-gray-700 dark:text-gray-200" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4 text-lg text-gray-700 dark:text-gray-300" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-xl text-gray-600 dark:text-white" {...props} />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            // @ts-ignore
            return !props.inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-md my-4 text-lg"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 px-1 py-0.5 rounded-sm text-lg text-gray-800 dark:text-white" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default LectureContent;