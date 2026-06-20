type errorProps = {
  error: string;
};

const ErrorMessage = ({ error }: errorProps) => {
  return <p className="text-sf-red text-sm mt-1">{error}</p>;
};

export default ErrorMessage;
