type Options = {
  cache?: "force-cache" | "no-store";
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
};

export default async function fetcher<T>(
  url: string,
  options: Options = {
    cache: "force-cache",
  },
) {
  const res = await fetch(url, options);

  if (!res.ok) {
    console.error(await res.json());
    throw new Error(await res.json());
  }

  const data: T = await res.json();

  return data;
}
