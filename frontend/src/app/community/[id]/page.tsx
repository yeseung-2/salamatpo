import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/community/Avatar";
import ProgramBadge from "@/components/community/ProgramBadge";
import InfoBox from "@/components/community/InfoBox";
import PostActionBar from "@/components/community/PostActionBar";
import PageHeader from "@/components/community/PageHeader";
import { getPostById } from "@/lib/community/dummy-data";

type PostDetailPageProps = {
  params: Promise<{ id: string }>;
};

const SAMPLE_COMMENTS = [
  {
    id: "c1",
    author: "Pedro Garcia",
    content: "Thank you! I went today and got mine in 25 minutes.",
    postedAt: "1 hour ago",
    helpful: 5,
  },
  {
    id: "c2",
    author: "Lisa Torres",
    content: "Did they ask for a barangay certificate too?",
    postedAt: "45 min ago",
    helpful: 2,
  },
];

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const post = getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Post Detail" />

      <article className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {post.programs.map((program) => (
            <ProgramBadge key={program} program={program} />
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">{post.medicine}</h2>

        <div className="flex items-center gap-3">
          <Avatar name={post.username} size="lg" />
          <div>
            <p className="font-semibold text-gray-900">{post.username}</p>
            <p className="text-sm text-gray-500">
              {post.region} · {post.postedAt}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">{post.content}</p>

        <InfoBox
          waitingTime={post.waitingTime}
          cost={post.cost}
          documents={post.documents}
          healthCenter={post.healthCenter}
          pharmacy={post.pharmacy}
        />

        <Link
          href="/search"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
        >
          <MapIcon />
          Get Route
        </Link>

        <PostActionBar likes={post.likes} comments={post.comments} />

        <section className="space-y-4">
          <h3 className="text-base font-bold text-gray-900">
            Comments ({post.comments})
          </h3>

          {SAMPLE_COMMENTS.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100"
            >
              <div className="flex items-start gap-3">
                <Avatar name={comment.author} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author}
                    </p>
                    <span className="text-xs text-gray-400">
                      {comment.postedAt}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/20"
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200"
                    >
                      Helpful · {comment.helpful}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              className="h-11 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              className="rounded-xl bg-primary px-4 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        </section>
      </article>
    </div>
  );
}

function MapIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd" d="M8.157 2.257a1 1 0 011.686 0L12.586 6H15a1 1 0 011 1v9.382a1 1 0 01-1.447.894L10 14.618l-5.553 2.658A1 1 0 013 16.382V7a1 1 0 011-1h2.414L8.157 2.257zM10 10.618l3 2.382V8.618l-3-2.382-3 2.382v4.382l3-2.382z" clipRule="evenodd" />
    </svg>
  );
}
