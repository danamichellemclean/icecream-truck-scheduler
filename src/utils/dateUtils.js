// All dates stored as "YYYY-MM-DD", times as "HH:MM"

export function today() {
  return toDateString(new Date());
}

export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(str) {
  // Parse "YYYY-MM-DD" as local date (not UTC)
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(str) {
  if (!str) return '';
  const date = parseDate(str);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(str) {
  if (!str) return '';
  const date = parseDate(str);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTime(str) {
  if (!str) return '';
  const [h, m] = str.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function monthName(year, month) {
  return new Date(year, month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

export function isToday(str) {
  return str === today();
}

export function isPast(str) {
  return str < today();
}

export function isFuture(str) {
  return str > today();
}

export function formatCurrency(amount) {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
