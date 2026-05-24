"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code className="px-1.5 py-0.5 rounded bg-white/10 text-violet-300 text-sm font-mono" {...props}>
            {children}
          </code>
        );
      }

      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-xl !bg-[#1a1a2e] !my-4 text-sm"
          showLineNumbers
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    },
    h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-white mt-6 mb-3 border-b border-white/10 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-white mt-5 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-medium text-white mt-4 mb-2">{children}</h4>,
    p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
    a: ({ href, children }) => (
      <a href={href} className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4 ml-4">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-gray-300 mb-4 ml-4">{children}</ol>,
    li: ({ children }) => <li className="text-gray-300">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-violet-500 pl-4 py-2 my-4 bg-violet-500/5 rounded-r-lg text-gray-300 italic">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="w-full text-sm text-gray-300 border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-white/5 text-white">{children}</thead>,
    th: ({ children }) => <th className="px-4 py-2 text-left font-medium border border-white/10">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 border border-white/10">{children}</td>,
    hr: () => <hr className="border-white/10 my-6" />,
    img: ({ src, alt }) => (
      <img src={src} alt={alt || ""} className="rounded-xl max-w-full h-auto my-4 border border-white/10" />
    ),
    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
    em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
