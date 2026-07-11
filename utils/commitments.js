export function getExpiryPreset(preset) {
  const d = new Date();
  if (preset === "today") d.setHours(23, 59, 59, 999);
  if (preset === "tomorrow") {
    d.setDate(d.getDate() + 1);
    d.setHours(23, 59, 59, 999);
  }
  if (preset === "week") {
    d.setDate(d.getDate() + 7);
    d.setHours(23, 59, 59, 999);
  }
  return d.toISOString();
}
