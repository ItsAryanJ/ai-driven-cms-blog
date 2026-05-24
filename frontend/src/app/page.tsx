import Link from "next/link";
import { cookies } from "next/headers";

async function getPosts() {
  try {
    const res = await fetch(
      "http://backend:8000/api/posts?page=1&page_size=10",
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return [];

    const data = await res.json();

    return data.items || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  return (
    <main className="min-h-screen bg-black text-white px-10 py-20">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-3">
              BlogCMS
            </h1>

            <p className="text-gray-400">
              AI Driven Blog Platform
            </p>
          </div>

          <div className="flex gap-4">
            {!token ? (
              <Link
                href="/login"
                className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  href="/admin"
                  className="px-5 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                >
                  Dashboard
                </Link>

                <Link
                  href="/logout"
                  className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-semibold mb-6">
          Latest Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500">
            No published posts found
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition"
              >
                <h3 className="text-xl font-bold">
                  {post.title}
                </h3>

                <p className="text-gray-400 mt-2">
                  {post.excerpt}
                </p>

                <p className="text-sm text-gray-500 mt-4">
                  By {post.author?.email}
                </p>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}