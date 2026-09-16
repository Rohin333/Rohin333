const RETRYABLE = [
  'NetworkError',
  'tooManyRequests',
  'FIELD_LIMIT_EXCEEDED',
  'REQUEST_TIMEOUT',
  'INTERNAL_SERVER_ERROR',
  'Internal Server Error',
  'Request timed out',
  'Rate limit',
  'Concurrency limit',
  'fetch resource',
  'Failed to fetch',
  'NetworkError',
  'Load failed',
  'ECONNRESET',
  'socket hang up'
];

function isRetryable(error) {
  const msg = error?.message || '';
  return RETRYABLE.some(code => msg.includes(code));
}

export function withRetry(fn, { maxRetries = 4, baseDelay = 2500 } = {}) {
  return async (...args) => {
    let lastError;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (e) {
        lastError = e;
        if (attempt < maxRetries && isRetryable(e)) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
          console.warn(`Retry ${attempt + 1}/${maxRetries} in ${Math.round(delay)}ms...`);
          await new Promise(r => setTimeout(r, delay));
        } else {
          throw e;
        }
      }
    }
    throw lastError;
  };
}
