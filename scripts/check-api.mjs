const BASE_URL = process.env.MOCKAPI_URL?.replace(/\/+$/, '');
let failures = 0;
let createdRecordId;

if (!BASE_URL) {
  console.error('FAIL configuration: set MOCKAPI_URL to the MockAPI project base URL.');
  process.exit(1);
}

async function request(method, path, body) {
  if (!path.startsWith('/') || path.startsWith('//')) {
    throw new Error(`API path must start with exactly one slash: ${path}`);
  }

  const url = `${BASE_URL}${path}`;
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    console.log(`${response.ok ? 'HTTP' : 'FAIL'} ${method} ${url} — HTTP ${response.status}`);
    if (!response.ok && text) console.log(`  Response: ${text.slice(0, 500)}`);
    return { ok: response.ok, status: response.status, data, url };
  } catch (error) {
    console.log(`FAIL ${method} ${url} — NETWORK ERROR: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, status: 0, data: null, url };
  }
}

function check(condition, label, status) {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}${status === undefined ? '' : ` — HTTP ${status}`}`);
  if (!condition) failures += 1;
}

function hasExpectedShape(record) {
  return Boolean(
    record
    && typeof record.id === 'string'
    && typeof record.locationId === 'string'
    && typeof record.location?.name === 'string'
    && typeof record.location?.region === 'string'
    && record.current !== null
    && typeof record.current === 'object'
    && Array.isArray(record.hourly)
    && record.hourly.length === 24
    && Array.isArray(record.daily)
    && record.daily.length === 7
    && Array.isArray(record.alerts),
  );
}

try {
  const allRecordsResult = await request('GET', '/weather');
  const allRecords = allRecordsResult.data;
  const validRecords = allRecordsResult.ok && Array.isArray(allRecords)
    && allRecords.every(hasExpectedShape);
  check(validRecords, 'GET /weather returned records with expected fields and forecast lengths', allRecordsResult.status);
  if (Array.isArray(allRecords)) {
    console.log(`Weather record count: ${allRecords.length}`);
    console.log(`Weather locationIds: ${allRecords.map((record) => record.locationId).join(', ')}`);
  }

  const kimberleyResult = await request('GET', '/weather?locationId=kimberley');
  const kimberley = Array.isArray(kimberleyResult.data)
    ? kimberleyResult.data.find((record) => record.locationId === 'kimberley')
    : null;
  check(
    kimberleyResult.ok && hasExpectedShape(kimberley)
      && kimberley.hourly.length === 24 && kimberley.daily.length === 7,
    'Filtered Kimberley record has 24 hourly and 7 daily entries',
    kimberleyResult.status,
  );

  const testLocationId = `api-check-${Date.now()}`;
  const postResult = await request('POST', '/saved', {
    locationId: testLocationId,
    location: {
      id: testLocationId,
      name: 'Nimbus API Check',
      region: 'Test',
      country: 'XX',
      lat: 0,
      lon: 0,
    },
  });
  if (postResult.ok && postResult.data && typeof postResult.data.id === 'string') {
    createdRecordId = postResult.data.id;
  }
  check(
    postResult.ok && postResult.data?.locationId === testLocationId
      && typeof postResult.data?.id === 'string',
    'POST /saved creates a record with a MockAPI record id',
    postResult.status,
  );

  const savedResult = await request('GET', '/saved');
  const savedRecords = Array.isArray(savedResult.data) ? savedResult.data : [];
  check(
    savedResult.ok && Boolean(createdRecordId)
      && savedRecords.some((record) => record.id === createdRecordId && record.locationId === testLocationId),
    'GET /saved returns the posted test record',
    savedResult.status,
  );

  if (createdRecordId) {
    const deleteResult = await request('DELETE', `/saved/${encodeURIComponent(createdRecordId)}`);
    check(deleteResult.ok, 'DELETE /saved/:id deletes by MockAPI record id', deleteResult.status);
    if (deleteResult.ok) createdRecordId = undefined;
  } else {
    check(false, 'DELETE /saved/:id skipped because POST did not return a record id', 'N/A');
  }
} finally {
  if (createdRecordId) {
    const cleanupResult = await request('DELETE', `/saved/${encodeURIComponent(createdRecordId)}`);
    if (!cleanupResult.ok) failures += 1;
  }
}

if (failures > 0) {
  console.error(`API check finished with ${failures} failure(s).`);
  process.exitCode = 1;
} else {
  console.log('All API checks passed.');
}
