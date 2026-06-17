type errorProps = {
  error: string;
};

const ErrorMessage = ({ error }: errorProps) => {
  return <p className="text-red-500 text-sm mt-1">{error}</p>;
};

export default ErrorMessage;
