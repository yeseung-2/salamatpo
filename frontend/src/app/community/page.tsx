"use client";

import { useMemo, useState } from "react";
import CommunitySearchBar from "@/components/community/CommunitySearchBar";
import FilterChips from "@/components/community/FilterChips";
import FeedCard from "@/components/community/FeedCard";
import FloatingActionButton from "@/components/community/FloatingActionButton";
import CommunityShortcuts from "@/components/community/CommunityShortcuts";
import { COMMUNITY_POSTS } from "@/lib/community/dummy-data";
import type { FilterChip } from "@/lib/community/types";

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterChip>("All");

  const filteredPosts = useMemo(() => {
    return COMMUNITY_POSTS.filter((post) => {
      const matchesFilter =
        activeFilter === "All" || post.category === activeFilter;

      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.medicine.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.region.toLowerCase().includes(query) ||
        post.pharmacy?.toLowerCase().includes(query) ||
        post.healthCenter?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <div className="-mx-1 space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">Community</h2>
        <p className="text-sm text-gray-500">
          Share free medicine experiences and help others find the right path.
        </p>
      </div>

      <CommunitySearchBar value={search} onChange={setSearch} />

      <FilterChips active={activeFilter} onChange={setActiveFilter} />

      <CommunityShortcuts />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Experiences</h3>
          <span className="text-xs text-gray-500">{filteredPosts.length} posts</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl bg-gray-50 p-8 text-center ring-1 ring-gray-100">
            <p className="text-sm font-medium text-gray-700">No posts found</p>
            <p className="mt-1 text-xs text-gray-500">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => <FeedCard key={post.id} post={post} />)
        )}
      </div>

      <FloatingActionButton href="/community/write" label="Write Post" />
    </div>
  );
}
