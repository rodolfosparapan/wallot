import { useAuthStore } from '@/stores/authStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5140';
const IS_DEV   = process.env.NODE_ENV !== 'production';

// ── In-memory error log ──────────────────────────────────────────────────────
// Capped ring buffer (50 entries). Access via getApiErrorLog() from a debug
// screen. Future: flush to POST /api/client-logs on app background/close.

export interface ApiErrorEntry {
  timestamp: string;
  method:    string;
  path:      string;
  status:    number | null;  // null = network failure (no HTTP response)
  message:   string;
}

const ERROR_LOG_MAX = 50;
const _errorLog: ApiErrorEntry[] = [];

function recordError(entry: ApiErrorEntry): void {
  if (_errorLog.length >= ERROR_LOG_MAX) _errorLog.shift();
  _errorLog.push(entry);

  if (IS_DEV) {
    console.error(
      `[API] ${entry.method} ${entry.path} → ${entry.status ?? 'NETWORK_ERR'}: ${entry.message}`
    );
  }
}

/** Returns a snapshot of recent API errors (newest last). */
export function getApiErrorLog(): ReadonlyArray<ApiErrorEntry> {
  return [..._errorLog];
}

// ── HTTP client ──────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token  = useAuthStore.getState().token;
  const method = (options.method ?? 'GET').toUpperCase();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (networkErr) {
    // fetch() threw — device offline or server unreachable
    const message = networkErr instanceof Error ? networkErr.message : 'Network error';
    recordError({ timestamp: new Date().toISOString(), method, path, status: null, message });
    throw new Error(message);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    let message: string;

    if (body?.errors) {
      const messages = Object.values(body.errors as Record<string, string[]>).flat();
      message = messages.join('\n');
    } else {
      message = body?.message ?? body?.title ?? `HTTP ${res.status}`;
    }

    recordError({ timestamp: new Date().toISOString(), method, path, status: res.status, message });
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};
