import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Next Blog",
  description: "This is an about page for Next Blog",
};

export default function AboutPage() {
  return (
    <>
      <h1 className="pb-5 text-5xl font-bold border-b-4">About</h1>
      <div className="px-10 py-6 mt-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-5 text-2xl">NextBlog</h2>
        <p className="mb-3">This is a blog built with NextJs and Markdown</p>
        <p>
          <span className="font-bold">Version 1.0.0</span>
        </p>
      </div>
    </>
  );
}
