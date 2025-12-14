import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ⚡K
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Kabutrigger
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/news"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              ニュース一覧
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

