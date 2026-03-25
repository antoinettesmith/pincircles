"use client";

/**
 * Renders comment content with @username mentions styled as mentions
 * Format: @username in text is highlighted (e.g. "Hey @bob check this out")
 */
export function CommentContent({ content }: { content: string }) {
  const parts = content.split(/(@\w+)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("@")) {
          return (
            <span
              key={i}
              className="text-circle-primary font-medium"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
