const convertGregorianTimeToShamsiTime = (
  dateTime: string | Date | null | undefined,
  showTime: boolean = true,
  numericMonth = false
) => {
  if (!dateTime) return '';
  const time = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
  const persianTime = time.toLocaleDateString('fa-IR', {
    hour: 'numeric',
    minute: '2-digit',
    month: numericMonth ? 'numeric' : 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const persianDate = time.toLocaleDateString('fa-IR', {
    month: numericMonth ? 'numeric' : 'long',
    day: '2-digit',
    year: 'numeric',
  });

  if (dateTime) {
    if (!showTime) return `${persianDate}`;
    return `${persianTime.split('ساعت').join(' - ')}`;
  }
  return '';
};

export default convertGregorianTimeToShamsiTime;
