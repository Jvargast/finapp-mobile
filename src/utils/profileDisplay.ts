export const formatMemberSince = (value?: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const text = new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
  }).format(date);

  return text.charAt(0).toUpperCase() + text.slice(1);
};
