export function validateEmail(email: string): string | null {
  if (!email) return 'E-posta adresi gerekli';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Geçerli bir e-posta adresi girin';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Şifre gerekli';
  if (password.length < 8)
    return 'Şifre en az 8 karakter olmalıdır';
  return null;
}

export function validateName(name: string): string | null {
  if (!name || name.trim().length < 2) return 'Ad en az 2 karakter olmalıdır';
  return null;
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 5000);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sn`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} dk`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hrs} sa ${remMins} dk`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
