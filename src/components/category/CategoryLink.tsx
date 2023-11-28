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
      className={`text-c hover-ring focus-ring rounded-lg px-2 py-1 font-bold`}
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
