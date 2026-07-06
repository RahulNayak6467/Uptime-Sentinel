type errorProps = {
  error: string | undefined;
};

const ErrorMessage = ({ error }: errorProps) => {
  if (!error) return;
  return <p className="mt-1 text-xs text-sf-red">{error}</p>;
};

export default ErrorMessage;
