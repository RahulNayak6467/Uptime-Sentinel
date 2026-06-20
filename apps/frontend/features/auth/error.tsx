type errorProps = {
  error: string | undefined;
};

const ErrorMessage = ({ error }: errorProps) => {
  if (!error) return;
  return <p className="text-sf-red text-sm mt-1">{error}</p>;
};

export default ErrorMessage;
