type errorProps = {
  error: string;
};

const ErrorMessage = ({ error }: errorProps) => {
  return <p className="mt-1 text-xs text-sf-red">{error}</p>;
};

export default ErrorMessage;
