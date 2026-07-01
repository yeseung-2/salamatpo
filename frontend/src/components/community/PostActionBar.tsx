"use client";

type PostActionBarProps = {
  likes: number;
  comments: number;
  compact?: boolean;
};

export default function PostActionBar({
  likes,
  comments,
  compact = false,
}: PostActionBarProps) {
  const actions = [
    { label: "Likes", count: likes, icon: LikeIcon },
    { label: "Comments", count: comments, icon: CommentIcon },
    { label: "Bookmark", icon: BookmarkIcon },
    { label: "Report", icon: ReportIcon },
  ];

  return (
    <div
      className={`flex items-center border-t border-gray-100 ${compact ? "gap-1 pt-3" : "justify-between pt-4"}`}
    >
      {actions.map(({ label, count, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className={`flex items-center gap-1.5 rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-primary ${
            compact ? "flex-1 justify-center py-2 text-xs" : "px-3 py-2 text-sm"
          }`}
        >
          <Icon />
          {count !== undefined && <span>{count}</span>}
          {!compact && <span className="hidden sm:inline">{label}</span>}
        </button>
      ))}
    </div>
  );
}

function LikeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018.985-1.4 4.5 4.5 0 018.985 1.4 4.5 4.5 0 00-4.485 4.5c0 1.153-.346 2.22-.985 3.132a22.045 22.045 0 01-2.582 1.9 20.759 20.759 0 01-1.162.682l-.019.01-.005.003h-.002a1 1 0 01-1.094-1.094l.002-.005z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  );
}
