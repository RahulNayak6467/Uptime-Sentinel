import OtpForm from "@/features/auth/components/otp-form";
import AuthPageShell from "@/features/auth/components/auth-page-shell";

const VerifyEmailPage = () => {
  return (
    <AuthPageShell>
      <OtpForm />
    </AuthPageShell>
  );
};

export default VerifyEmailPage;
