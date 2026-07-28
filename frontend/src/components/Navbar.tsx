import Link from "next/link";
import { House } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <House className="h-7 w-7 text-indigo-600" />

          <span className="text-2xl font-bold text-gray-900">
            NyumbaLink
          </span>
        </Link>
      </nav>
    </header>
  );
}