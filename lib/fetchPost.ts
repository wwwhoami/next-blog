import { Post } from "@/types/Post";
import fetcher from "./fetcher";

export const fetchPosts = async (url: RequestInfo) => {
  return fetcher<Post[]>(url.toString());
};
