const MonitorError = ({ message }: { message: string }) => {
  return (
    <div className="w-full rounded-sf border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-800 dark:bg-red-950/30">
      <p className="text-[13px] text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
};

export default MonitorError;
