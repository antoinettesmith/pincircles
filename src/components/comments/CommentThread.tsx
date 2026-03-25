"use client";

import { useState } from "react";
import { CommentContent } from "./CommentContent";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string };
  replies?: Comment[];
}

interface CommentThreadProps {
  comment: Comment;
  pinId: string;
  currentUsername?: string;
  onReply: (content: string, parentId: string) => Promise<void>;
  depth?: number;
}

export function CommentThread({
  comment,
  pinId,
  currentUsername,
  onReply,
  depth = 0,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || loading) return;
    setLoading(true);
    try {
      await onReply(replyText.trim(), comment.id);
      setReplyText("");
      setShowReplyForm(false);
    } finally {
      setLoading(false);
    }
  };

  const isNested = depth > 0;

  return (
    <div className={isNested ? "ml-6 mt-3 pl-4 border-l-2 border-circle-light" : ""}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-circle-primary/20 flex items-center justify-center text-sm font-medium text-circle-primary">
          {comment.user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{comment.user.username}</span>
            <span className="text-xs text-circle-accent">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 mt-0.5">
            <CommentContent content={comment.content} />
          </p>
          <div className="mt-2">
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="text-xs text-circle-primary font-medium hover:underline"
              >
                Reply
              </button>
            ) : (
              <form onSubmit={handleReply} className="mt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user.username}... (use @username to mention)`}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-circle-border focus:ring-2 focus:ring-circle-primary mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading || !replyText.trim()}
                    className="px-3 py-1.5 rounded-full bg-circle-primary text-white text-xs font-medium hover:bg-circle-secondary disabled:opacity-50"
                  >
                    {loading ? "Posting..." : "Reply"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                    className="px-3 py-1.5 rounded-full border border-circle-border text-xs font-medium hover:bg-circle-surface"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              pinId={pinId}
              currentUsername={currentUsername}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
