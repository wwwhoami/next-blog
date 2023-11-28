"use_client";

import fetcher from "@/lib/fetcher";
import { Category } from "@/types/Category";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import CategoryLabel from "./CategoryLabel";

const categoryFetcher = async (url: string) => {
  return fetcher<Omit<Category, "description">[]>(url);
};

const categoryCombinationsFetcher = async (url: string) => {
  return fetcher<string[][]>(url);
};

type Props = {};

const CategorySelect = ({}: Props) => {
  const router = useRouter();
  const query = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const selectedCategoriesNotLoadedFromQuery = useRef(true);

  const { data: categories } = useSWR<Omit<Category, "description">[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    categoryFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  );

  const searchQuery = query.has("searchQuery")
    ? `?searchTerm=${query.get("searchQuery")}`
    : "";
  const { data: categoryCombinations } = useSWR<string[][]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category/combo${searchQuery}`,
    categoryCombinationsFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  );

  const availableCategories = useMemo(() => {
    const hasCombination = categoryCombinations?.map((categories) =>
      selectedCategories?.length
        ? selectedCategories?.every((selected) => categories.includes(selected))
        : true,
    );

    return categoryCombinations
      ?.flatMap((categories, index) => {
        if (hasCombination?.length && hasCombination[index])
          return categories.filter(
            (category) => !selectedCategories?.includes(category),
          );
      })
      .filter((e): e is string => e !== undefined);
  }, [categoryCombinations, selectedCategories]);

  useEffect(() => {
    if (query.has("category") && selectedCategoriesNotLoadedFromQuery) {
      setSelectedCategories(String(query.get("category")).split(" "));
      selectedCategoriesNotLoadedFromQuery.current = false;
    }
  }, [query]);

  useEffect(() => {
    const selectedCategoryQuery = selectedCategories.join(" ");
    const queryToSet = new URLSearchParams(query);

    if (selectedCategories.length === 0) queryToSet.delete("category");
    else queryToSet.set("category", selectedCategoryQuery);

    router.push(`/blog?${queryToSet.toString()}`, {
      shallow: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  return (
    <>
      <div className="col-span-full mb-6 mt-3 text-2xl font-medium text-black">
        Search posts by topics
      </div>
      <div className="-mb-4 -mr-4 flex flex-wrap">
        {categories?.map((category, index) => (
          <CategoryLabel
            key={index}
            name={category.name}
            hexColor={category.hexColor}
            setSelectedCategories={setSelectedCategories}
            available={availableCategories?.some(
              (availableCategory) => availableCategory === category.name,
            )}
            selected={selectedCategories?.some(
              (selectedCategory) => selectedCategory === category.name,
            )}
          />
        ))}
      </div>
    </>
  );
};

export default CategorySelect;
