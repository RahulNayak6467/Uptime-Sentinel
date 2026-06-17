import RegisterForm from "@/features/auth/components/register-form";

const RegisterPage = () => {
  return (
    <section className="w-full h-screen flex flex-col gap-4 justify-center items-center bg-sf-bg">
      <RegisterForm />
      <p className="text-center text-[12px] text-sf-text-sub">
        © 2026 StatusForge · Privacy · Terms
      </p>
    </section>
  );
};

export default RegisterPage;
