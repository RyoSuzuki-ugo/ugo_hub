import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm, { LoginFormProps } from "./LoginForm";

export interface LoginPageProps extends Omit<LoginFormProps, "onSuccess"> {
  defaultReturnUrl?: string;
  onSuccess?: (result: any) => void;
}

export default function LoginPage({
  defaultReturnUrl = "/dashboard",
  onSuccess,
  ...loginFormProps
}: LoginPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || defaultReturnUrl;

  const handleSuccess = (result: any) => {
    if (onSuccess) {
      onSuccess(result);
    } else {
      navigate(returnUrl);
    }
  };

  return <LoginForm {...loginFormProps} onSuccess={handleSuccess} />;
}
