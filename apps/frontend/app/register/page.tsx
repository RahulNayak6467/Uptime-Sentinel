import RegisterForm from "@/features/auth/components/register-form";
import AuthPageShell from "@/features/auth/components/auth-page-shell";

const RegisterPage = () => {
  return (
    <AuthPageShell>
      <RegisterForm />
    </AuthPageShell>
  );
};

export default RegisterPage;
