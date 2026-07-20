const STORAGE_VERSION = 2;

export function createTripStore(trip) {
  const key = `atlas:${trip.id}:v${STORAGE_VERSION}`;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '{}');
      return {
        checks: value.checks || {},
        selectedDayId: value.selectedDayId || trip.days[0]?.id || null
      };
    } catch {
      return { checks: {}, selectedDayId: trip.days[0]?.id || null };
    }
  }

  function write(nextState) {
    localStorage.setItem(key, JSON.stringify({
      ...nextState,
      tripId: trip.id,
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString()
    }));
  }

  function reset() {
    localStorage.removeItem(key);
  }

  return { key, read, write, reset };
}
