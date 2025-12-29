/**
 * Deterministic time helper for test mode
 * Reads x-test-now-ms header if TEST_MODE is enabled
 */
export function getCurrentTimeMs(request?: Request): number {
  if (process.env.TEST_MODE === "1" && request) {
    const testNowHeader = request.headers.get("x-test-now-ms");
    if (testNowHeader) {
      const parsed = parseInt(testNowHeader, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}

