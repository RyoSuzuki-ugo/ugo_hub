"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoginForm, { LoginFormProps } from "./LoginForm";

export interface LoginPageProps extends Omit<LoginFormProps, "onSuccess"> {
  defaultReturnUrl?: string;
  // deno-lint-ignore no-explicit-any
  onSuccess?: (result: any) => void;
}

export default function LoginPage({
  defaultReturnUrl = "/",
  onSuccess,
  ...loginFormProps
}: LoginPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams?.get("returnUrl") || defaultReturnUrl;

  // deno-lint-ignore no-explicit-any
  const handleSuccess = (result: any) => {
    if (onSuccess) {
      onSuccess(result);
    } else {
      router.push(returnUrl);
    }
  };

  return <LoginForm {...loginFormProps} onSuccess={handleSuccess} />;
}
