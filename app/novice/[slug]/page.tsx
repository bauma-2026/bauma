import { notFound } from "next/navigation";
import Link from "next/link";
import { news } from "@/lib/content";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return news.map((item) => ({
    slug: item.slug,
  }));
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;
  const post = news.find((item) => item.slug === slug);

  if (!post) return notFound();

  return (
    <>
      {/* HERO */}
    <section className="border-b border-neutral-200 bg-white">
  <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-8 sm:px-6 sm:pt-20 sm:pb-10 lg:px-8 lg:pt-24 lg:pb-12">
    <div className="max-w-[760px]">
      <p className="text-meta">
        Novice
      </p>

      <h1 className="mt-3 max-w-[18ch] text-h1 text-neutral-950">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="mt-4 max-w-[58ch] text-body">
          {post.excerpt}
        </p>
      )}
    </div>
  </div>
</section>

      {/* CONTENT */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-14 lg:px-8 lg:pt-12 lg:pb-16">
          <div className="max-w-[760px]">
     <article
  className="
    text-body-lg
    max-w-none

    [&_h2]:mt-12 [&_h2]:text-h2 [&_h2]:text-neutral-950
    [&_h3]:mt-10 [&_h3]:text-h2 [&_h3]:text-neutral-950

    [&_p]:mt-5 [&_p]:max-w-[62ch]
    [&_p:first-child]:mt-0

    [&_ul]:mt-5 [&_ul]:max-w-[62ch] [&_ul]:space-y-2
    [&_li]:leading-8

    [&_strong]:font-semibold [&_strong]:text-neutral-950
  "
>
  {post.content}
</article>
          </div>
        </div>
      </section>

      {/* BACK */}
   <section className="border-t border-neutral-200 bg-white">
  <div className="mx-auto w-full max-w-[1120px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
    <div className="max-w-[760px]">
      <Link
        href="/novice"
        className="text-body text-neutral-500 underline underline-offset-4 transition-colors hover:text-neutral-900"
      >
        ← Nazaj na novice
      </Link>
    </div>
  </div>
</section>
    </>
  );
}