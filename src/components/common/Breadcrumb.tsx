import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-zinc-400 dark:text-zinc-600">/</span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-900 dark:text-zinc-100">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

