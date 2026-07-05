import OtpForm from "@/features/auth/components/otp-form";

const VerifyEmailPage = () => {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-sf-bg bg-[radial-gradient(circle_at_top,var(--color-sf-blue-bg),transparent_42%)] px-6 py-10">
      <OtpForm />
      <p className="text-center text-[12px] text-sf-text-sub">
        © 2026 UptimeSentinel · Privacy · Terms
      </p>
    </section>
  );
};

export default VerifyEmailPage;
