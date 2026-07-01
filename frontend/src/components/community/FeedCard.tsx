import Link from "next/link";
import Avatar from "./Avatar";
import ProgramBadge from "./ProgramBadge";
import InfoBox from "./InfoBox";
import PostActionBar from "./PostActionBar";
import type { CommunityPost } from "@/lib/community/types";

type FeedCardProps = {
  post: CommunityPost;
};

export default function FeedCard({ post }: FeedCardProps) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <Link href={`/community/${post.id}`} className="block">
        <div className="flex items-start gap-3">
          <Avatar name={post.username} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{post.username}</p>
                <p className="text-xs text-gray-500">
                  {post.region} · {post.postedAt}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.programs.map((program) => (
            <ProgramBadge key={program} program={program} />
          ))}
        </div>

        <h3 className="mt-3 text-lg font-bold text-gray-900">{post.medicine}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{post.content}</p>

        {post.image && (
          <div className="mt-3 overflow-hidden rounded-2xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt="" className="h-40 w-full object-cover" />
          </div>
        )}
      </Link>

      <div className="mt-4">
        <InfoBox
          waitingTime={post.waitingTime}
          cost={post.cost}
          documents={post.documents}
          healthCenter={post.healthCenter}
          pharmacy={post.pharmacy}
        />
      </div>

      <PostActionBar likes={post.likes} comments={post.comments} compact />
    </article>
  );
}
