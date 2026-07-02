export const formatDurationMinutes = (totalMinutes: number): string => {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) return "—";

  const roundedMinutes = Math.round(totalMinutes);

  if (roundedMinutes < 60) {
    return `${roundedMinutes} min`;
  }

  const totalHours = Math.floor(roundedMinutes / 60);
  const remainingMinutes = roundedMinutes % 60;

  if (totalHours < 24) {
    return remainingMinutes === 0
      ? `${totalHours} hr`
      : `${totalHours} hr ${remainingMinutes} min`;
  }

  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  return remainingHours === 0
    ? `${days} d`
    : `${days} d ${remainingHours} hr`;
};
