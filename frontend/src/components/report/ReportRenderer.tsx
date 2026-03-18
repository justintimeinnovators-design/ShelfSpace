"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
type ReportRendererProps = {
  content: string;
};

/**
 * Report Renderer.
 * @param { content } - { content } value.
 */
export default function ReportRenderer({ content }: ReportRendererProps) {
  return (
    <div className="report-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
/**
 * Code.
 * @param { className, children, ...props } - { class Name, children, ...props } value.
 */
          code({ className, children, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
/**
 * Pre.
 * @param { children } - { children } value.
 */
          pre({ children }) {
            return <pre className="report-pre">{children}</pre>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
