import OtpForm from "@/features/auth/components/otp-form";

const VerifyEmailPage = () => {
  return (
    <section className="w-full h-screen flex flex-col gap-4 justify-center items-center bg-sf-bg">
      <OtpForm />
      <p className="text-center text-[12px] text-sf-text-sub">
        © 2026 StatusForge · Privacy · Terms
      </p>
    </section>
  );
};

export default VerifyEmailPage;
