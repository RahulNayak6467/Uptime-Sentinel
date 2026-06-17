const EmailAddressInput = () => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" for="userEmail">
        Email address
      </label>
      <input
        className="text-[14px] border border-sf-border bg-sf-surface px-2 py-2 rounded-[6px]"
        type="email"
        id="userEmail"
        name="email"
        placeholder="name@example.com"
        required
      />
    </div>
  );
};

export default EmailAddressInput;
