"use client";

import Link from "next/link";
import PageHeader from "@/components/community/PageHeader";
import ProgramBadge from "@/components/community/ProgramBadge";
import Avatar from "@/components/community/Avatar";
import { QUESTIONS } from "@/lib/community/dummy-data";

export default function QAPage() {
  return (
    <div>
      <PageHeader title="Q&A Board" />

      <p className="mb-5 text-sm text-gray-500">
        Ask about documents, eligibility, and free medicine access.
      </p>

      <Link
        href="/community/write"
        className="mb-5 flex h-12 w-full items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 text-sm font-semibold text-primary transition hover:bg-primary/10"
      >
        + Ask a Question
      </Link>

      <div className="space-y-4">
        {QUESTIONS.map((question) => (
          <article
            key={question.id}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-gray-900">
                {question.title}
              </h3>
              {question.hasBestAnswer && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Best Answer
                </span>
              )}
            </div>

            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {question.body}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <ProgramBadge key={tag} program={tag} />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <Avatar name={question.author} size="sm" />
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {question.author}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {question.region} · {question.postedAt}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700"
              >
                {question.answers} answers
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
