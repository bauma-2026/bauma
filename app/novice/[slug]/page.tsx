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

  const [title, subtitle] = post.title.split(" — ");

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8 lg:pb-14 lg:pt-32">
          <div className="max-w-[760px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
              Zapis
            </p>

            <h1 className="mt-4 max-w-[16ch] text-[44px] font-semibold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 max-w-[22ch] text-2xl font-medium leading-[1.15] tracking-[-0.01em] text-white/48 sm:text-3xl">
                {subtitle}
              </p>
            )}

            {post.excerpt && (
              <p className="mt-5 max-w-[50ch] text-base leading-[1.65] text-white/50">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <article
            className="
              max-w-[680px]
              text-[15px] leading-7 text-white/62

              [&_p]:mt-6 [&_p]:max-w-[62ch]
              [&_p:first-child]:mt-0

              [&_h2]:mt-14 [&_h2]:max-w-[18ch]
              [&_h2]:text-3xl [&_h2]:font-semibold
              [&_h2]:leading-[1.05] [&_h2]:tracking-[-0.025em]
              [&_h2]:text-white

              [&_h3]:mt-12 [&_h3]:max-w-[24ch]
              [&_h3]:text-2xl [&_h3]:font-semibold
              [&_h3]:leading-[1.12] [&_h3]:tracking-[-0.01em]
              [&_h3]:text-white

              [&_ul]:mt-6 [&_ul]:grid [&_ul]:gap-3
              [&_ul]:max-w-[62ch]

              [&_li]:relative [&_li]:pl-5 [&_li]:leading-7
              [&_li]:text-white/55
              [&_li]:before:absolute [&_li]:before:left-0
              [&_li]:before:top-[0.78em]
              [&_li]:before:h-1.5 [&_li]:before:w-1.5
              [&_li]:before:rounded-full [&_li]:before:bg-white/25

              [&_strong]:font-semibold [&_strong]:text-white
            "
          >
            {post.content}
          </article>
        </div>
      </section>

      {/* BACK */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/novice"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition duration-200 hover:text-white"
          >
            ← Nazaj na zapise
          </Link>
        </div>
      </section>
    </div>
  );
}