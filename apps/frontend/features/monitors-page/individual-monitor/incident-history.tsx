const IncidentHistory = () => {
  return (
    <div className="sf-panel mt-5 p-5 pb-6">
      <h3 className="text-[14px] font-semibold font-sans text-sf-text">
        Incident history
      </h3>
      <div className="w-full px-4 flex justify-center items-center mt-4 h-20 border border-dashed">
        <p className="text-sf-label font-sans font-semibold text-sf-text-muted">
          No incidents recorded for this monitor
        </p>
      </div>
    </div>
  );
};

export default IncidentHistory;
