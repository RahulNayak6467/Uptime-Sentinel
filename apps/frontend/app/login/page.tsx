import LoginForm from "@/features/auth/components/login-form";
import AuthPageShell from "@/features/auth/components/auth-page-shell";

const LoginPage = () => {
  return (
    <AuthPageShell>
      <LoginForm />
    </AuthPageShell>
  );
};

export default LoginPage;
