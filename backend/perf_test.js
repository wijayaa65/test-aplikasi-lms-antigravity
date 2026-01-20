const http = require('http');

function measure(label, path) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = http.get(`http://localhost:5000${path}`, (res) => {
            res.on('data', () => { }); // Consume stream
            res.on('end', () => {
                const duration = Date.now() - start;
                console.log(`${label}: ${duration}ms (Status: ${res.statusCode})`);
                resolve(duration);
            });
        });
        req.on('error', (e) => {
            console.error(`${label}: Error ${e.message}`);
            resolve(9999);
        });
    });
}

async function test() {
    console.log('--- Performance Test ---');
    // Pre-warm (if any lazy loading)
    await measure('Warmup Health', '/health');

    const d1 = await measure('Health Check', '/health');
    const d2 = await measure('Courses List', '/api/courses');

    // Simulate Login token? We need a token to test protected routes. 
    // For MOCK mode, maybe we can skip auth or use a simulated token if the backend mock middleware allows it?
    // The backend `authenticateToken` middleware verifies JWT. The mock db bypass doesn't bypass auth middleware.
    // We need to login first to get a token.

    // Login to get token
    const loginData = JSON.stringify({ email: 'student@demo.com', password: 'demo123' });
    const token = await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve(JSON.parse(body).token));
        });
        req.write(loginData);
        req.end();
    });

    if (token) {
        // Measure Dashboard (Enrollments)
        const d3 = await measureWithAuth('Dashboard Data (Enrollments)', '/api/enrollments/my', token);
    } else {
        console.log('Login failed, skipping dashboard test');
    }

    if (d2 < 200) {
        console.log('\nSUCCESS: Response time is instant (< 200ms).');
    } else {
        console.log('\nFAIL: Response time is slow (> 200ms). Did the server restart with MOCK_DB=true?');
    }
}

function measureWithAuth(label, path, token) {
    return new Promise((resolve) => {
        const start = Date.now();
        const req = http.get({
            hostname: 'localhost',
            port: 5000,
            path: path,
            headers: { 'Authorization': `Bearer ${token}` }
        }, (res) => {
            res.on('data', () => { });
            res.on('end', () => {
                const duration = Date.now() - start;
                console.log(`${label}: ${duration}ms (Status: ${res.statusCode})`);
                resolve(duration);
            });
        });
        req.on('error', (e) => {
            console.error(`${label}: Error ${e.message}`);
            resolve(9999);
        });
    });
}

// Update test call
test();
