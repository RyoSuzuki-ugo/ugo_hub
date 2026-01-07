import { useState } from "react";
import { operatorService } from "@repo/api-client";
import { Button } from "@repo/shared-ui/components/button";
import { Input } from "@repo/shared-ui/components/input";
import { Label } from "@repo/shared-ui/components/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/shared-ui/components/card";

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
    <div className={`min-h-screen flex items-center justify-center bg-background ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
          <CardDescription className="text-center">{subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="loginId">ログインID</Label>
              <Input
                id="loginId"
                name="loginId"
                type="text"
                required
                placeholder="ログインID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="パスワード"
                value={loginPw}
                onChange={(e) => setLoginPw(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
