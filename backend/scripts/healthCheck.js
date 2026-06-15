import http from 'http';
import pool from '../config/db.js';

async function performHealthCheck() {
  console.log('Running SeedBank Backend Health Check...');
  const healthStatus = {
    database: 'UNKNOWN',
    api: 'UNKNOWN',
    timestamp: new Date().toISOString()
  };

  let hasError = false;

  // 1. Check database connectivity
  try {
    const start = Date.now();
    await pool.query('SELECT 1');
    const latency = Date.now() - start;
    healthStatus.database = {
      status: 'UP',
      latencyMs: latency
    };
    console.log(`[PASS] Database connectivity verified (latency: ${latency}ms)`);
  } catch (error) {
    hasError = true;
    healthStatus.database = {
      status: 'DOWN',
      error: error.message
    };
    console.error('[FAIL] Database connection check failed:', error.message);
  }

  // 2. Check API endpoint health (local ping)
  const port = process.env.PORT || 5000;
  const checkApi = () => {
    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: port,
        path: '/health',
        method: 'GET',
        timeout: 2000
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve({ status: 'UP', statusCode: res.statusCode });
          } else {
            resolve({ status: 'DOWN', statusCode: res.statusCode, response: body });
          }
        });
      });

      req.on('error', (err) => {
        resolve({ status: 'DOWN', error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 'DOWN', error: 'Request timeout' });
      });

      req.end();
    });
  };

  try {
    const apiRes = await checkApi();
    healthStatus.api = apiRes;
    if (apiRes.status === 'UP') {
      console.log('[PASS] Local API HTTP server is reachable and returned OK');
    } else {
      hasError = true;
      console.error('[FAIL] Local API HTTP server returned unhealthy state:', apiRes);
    }
  } catch (error) {
    hasError = true;
    healthStatus.api = { status: 'DOWN', error: error.message };
    console.error('[FAIL] Local API check failed:', error.message);
  }

  // Done checking
  console.log('\n--- HEALTH CHECK SUMMARY ---');
  console.log(JSON.stringify(healthStatus, null, 2));
  console.log('----------------------------');

  // Close db connection
  await pool.end();

  if (hasError) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

performHealthCheck();
