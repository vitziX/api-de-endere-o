export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function sanitizeCEP(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidCEP(value: string): boolean {
  const digits = sanitizeCEP(value);
  return digits.length === 8;
}
