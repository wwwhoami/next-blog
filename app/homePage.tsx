"use client";

import PostCard from "@/components/post/PostCard";
import fetcher from "@/lib/fetcher";
import { Post } from "@/types/Post";
import { useInfiniteLoading } from "src/hooks/useInfiniteLoading";
import { SWRInfiniteKeyLoader } from "swr/infinite";

type Props = {
  fallbackData: Post[][];
};

const PAGE_SIZE = 8;

const getKey: SWRInfiniteKeyLoader = (
  pageIndex: number,
  previousPageData: Post[],
) => {
  if (previousPageData && !previousPageData.length) return null;

  return `${process.env.NEXT_PUBLIC_API_URL}/post?take=${PAGE_SIZE}&skip=${
    pageIndex * PAGE_SIZE
  }`;
};

export default function HomePage({ fallbackData }: Props) {
  const { ref, isLoadingMore, isRefreshing, data } = useInfiniteLoading(
    getKey,
    fetcher,
    fallbackData,
  );
  const posts = data?.flatMap((page) => page) ?? [];

  return (
    <>
      <h1 className="p-3 text-4xl font-semibold border-b-4">Latest Posts</h1>
      <div className="grid gap-5 my-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts?.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
      <div ref={ref}>
        {isLoadingMore ? "Loading..." : isRefreshing ? "Refreshing..." : ""}
      </div>
    </>
  );
}
