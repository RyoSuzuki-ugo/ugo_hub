"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { operator, logout } = useAuth();
  const pathname = usePathname();

  // teleopeとflowページではヘッダーを非表示
  const hideHeader = pathname === "/teleope" || pathname === "/flow";

  if (hideHeader) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <nav className="flex space-x-4">
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  ポータル
                </Link>
                <Link
                  href="/app1?serialNo=UC04AA-Z21560019"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                >
                  App1
                </Link>
                <Link
                  href="/app2"
                  className="text-blue-600 hover:text-blue-800"
                >
                  App2
                </Link>
                <Link
                  href="/flow"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                >
                  Flow
                </Link>
                <Link
                  href="/teleope"
                  className="text-blue-600 hover:text-blue-800"
                  target="_blank"
                >
                  Teleope
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {operator && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">ログイン中:</p>
                  <p className="font-medium">
                    {operator.firstName} {operator.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{operator.loginId}</p>
                </div>
              )}
              <button
                type="button"
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
