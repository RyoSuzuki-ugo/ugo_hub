import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  operatorService,
  type OperatorWithRelations,
} from "@repo/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/shared-ui/components/alert-dialog";

interface AuthContextType {
  operator: OperatorWithRelations | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  operator: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [operator, setOperator] = useState<OperatorWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);
  const [expiryMinutes, setExpiryMinutes] = useState(0);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // 定期的なトークンチェック（1分ごと）
  useEffect(() => {
    if (pathname === "/login") return;

    const interval = setInterval(() => {
      console.log("Checking token validity...");
      if (operatorService.isTokenExpired()) {
        console.warn("Token has expired. Redirecting to login...");
        localStorage.removeItem("user-token");
        localStorage.removeItem("operator_data");
        navigate(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (operatorService.isTokenExpiringSoon(10 * 60 * 1000)) {
        // 10分前
        const remainingTime = operatorService.getTokenRemainingTime();
        const minutes = Math.floor(remainingTime / 60000);
        console.warn(`Token will expire in ${minutes} minutes`);

        // 一度だけダイアログを表示
        if (!hasShownWarning) {
          setExpiryMinutes(minutes);
          setShowExpiryDialog(true);
          setHasShownWarning(true);
        }
      }
    }, 60000); // 1分ごとにチェック

    return () => clearInterval(interval);
  }, [pathname, navigate, hasShownWarning]);

  useEffect(() => {
    const checkAuth = () => {
      // ログインページの場合は認証チェックをスキップ
      if (pathname === "/login") {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("user-token");
        if (!token) {
          navigate(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        // トークンの有効性をチェック
        if (!operatorService.validateToken()) {
          console.warn("Token is invalid or expired");
          localStorage.removeItem("user-token");
          localStorage.removeItem("operator_data");
          navigate(`/login?returnUrl=${encodeURIComponent(pathname)}`);
          return;
        }

        // トークンがもうすぐ期限切れの場合は警告
        if (operatorService.isTokenExpiringSoon()) {
          const remainingTime = operatorService.getTokenRemainingTime();
          const minutes = Math.floor(remainingTime / 60000);
          console.warn(`Token expires in ${minutes} minutes`);
          // TODO: トークンリフレッシュまたは警告表示の実装
        }

        // localStorageからoperator情報を取得
        const operatorData = localStorage.getItem("operator_data");
        console.log(
          "Loaded operator data from localStorage:",
          operatorData,
          operatorData !== undefined
        );
        if (operatorData !== "undefined" && operatorData) {
          setOperator(JSON.parse(operatorData));
        }

        // オプション: APIから最新のoperator情報を取得
        // const currentOperator = await operatorService.getCurrentOperator();
        // setOperator(currentOperator);
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem("user-token");
        localStorage.removeItem("operator_data");
        navigate(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, navigate]);

  const logout = async () => {
    try {
      await operatorService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user-token");
      localStorage.removeItem("operator_data");
      navigate("/login");
    }
  };

  // ログインページの場合は常に表示
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // 認証チェック中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">認証確認中...</div>
      </div>
    );
  }

  // トークンがない場合は何も表示しない（リダイレクト処理中）
  const token =
    typeof window !== "undefined" ? localStorage.getItem("user-token") : null;
  if (!token && pathname !== "/login") {
    return null;
  }

  const handleContinue = () => {
    setShowExpiryDialog(false);
  };

  const handleLogoutNow = async () => {
    setShowExpiryDialog(false);
    await logout();
  };

  return (
    <AuthContext.Provider value={{ operator, loading, logout }}>
      {children}

      <AlertDialog open={showExpiryDialog} onOpenChange={setShowExpiryDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>セッション期限切れの警告</AlertDialogTitle>
            <AlertDialogDescription>
              あと{expiryMinutes}分でセッションの有効期限が切れます。
              <br />
              期限が切れると自動的にログアウトされます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleContinue}>
              継続する
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutNow}>
              今すぐログアウト
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
}
