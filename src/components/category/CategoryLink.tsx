import Link from "next/link";

type Props = {
  name: string;
  hexColor?: string | null;
};

const CategoryLink = ({ name, hexColor }: Props) => {
  return (
    <Link
      href={`/blog?category=${name}`}
      passHref
      className={`rounded-lg px-2 py-1 text-c font-bold hover-ring focus-ring`}
      style={{
        ["--tw-ring-color" as any]: hexColor,
        ["color" as any]: hexColor,
      }}
    >
      {name}
    </Link>
  );
};

export default CategoryLink;
