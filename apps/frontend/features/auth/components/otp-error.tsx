const OtpError = ({ message }: { message: string }) => {
  return (
    <div className="w-full px-3 py-2.5 rounded-sf bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
      <p className="text-[13px] text-center text-red-600 dark:text-red-400">
        {message}
      </p>
    </div>
  );
};

export default OtpError;
