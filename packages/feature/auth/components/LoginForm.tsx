"use client";

import { useState } from "react";
import { operatorService } from "@next-monorepo/api-client";

export interface LoginFormProps {
  title?: string;
  subtitle?: string;
  defaultLoginId?: string;
  defaultPassword?: string;
  // deno-lint-ignore no-explicit-any
  onSuccess: (result: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function LoginForm({
  title = "Ugo Portal",
  subtitle = "ログイン",
  defaultLoginId = "r-suzuki@ugo.plus",
  defaultPassword = "Test12345678",
  onSuccess,
  onError,
  className = "",
}: LoginFormProps) {
  const [loginId, setLoginId] = useState(defaultLoginId);
  const [loginPw, setLoginPw] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await operatorService.login({
        loginId,
        loginPw,
      });

      console.log("Login successful:", result);
      onSuccess(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "ログインに失敗しました";
      console.error("Login failed:", err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 ${className}`}
    >
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
            {title}
          </h1>
          <h2 className="text-center text-xl text-gray-600">{subtitle}</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="loginId" className="sr-only">
                ログインID
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="ログインID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
