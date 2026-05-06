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
    <div className="min-h-screen bg-[#080808] text-white">
      
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8 lg:pt-24 lg:pb-14">
          <div className="max-w-[760px]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
              Novice
            </p>

            <h1 className="mt-4 max-w-[18ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 max-w-[58ch] text-base leading-7 text-white/60">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 pt-10 pb-16 sm:px-6 sm:pt-12 sm:pb-20 lg:px-8">
          <div className="max-w-[720px]">
            <article
              className="
                text-[15px] leading-7 text-white/70

                [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white
                [&_h3]:mt-12 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white

                [&_p]:mt-5 [&_p]:max-w-[60ch]
                [&_p:first-child]:mt-0

                [&_ul]:mt-5 [&_ul]:max-w-[60ch] [&_ul]:space-y-2
                [&_li]:leading-7

                [&_strong]:font-semibold [&_strong]:text-white
              "
            >
              {post.content}
            </article>
          </div>
        </div>
      </section>

      {/* BACK */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="max-w-[720px]">
            <Link
              href="/novice"
              className="text-sm text-white/40 underline underline-offset-4 transition hover:text-white"
            >
              ← Nazaj na novice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}