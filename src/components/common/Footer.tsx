export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
            Kabutrigger
          </p>
          <p className="mb-4">株式市場の"動き出す瞬間"をトリガーで掴め。</p>
          <p className="text-xs">
            © {new Date().getFullYear()} Kabutrigger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

