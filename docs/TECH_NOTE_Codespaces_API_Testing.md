# Technical Note: Testing MARTA APIs & Codespaces Proxy Solution

**Document Type:** API Testing & Verification Guide
**Created:** 2025-10-26
**Status:** Verified Working ✅

---

## Quick Reference: Working Test Commands

### 1. MARTA Bus API (GTFS-RT) - Port 443 ✅

**Direct Test (Works everywhere including Codespaces):**
```bash
curl -w "\nHTTP: %{http_code} | Time: %{time_total}s\n" \
  "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb" \
  -o /tmp/marta_bus_test.pb
```

**Result:** Binary protobuf file (~14KB)
**Status:** 200 OK
**Latency:** ~140ms

---

### 2. MARTA Train API (Direct) - Port 18096 ✅

**Direct Test (Works locally, blocked in Codespaces):**
```bash
curl -s "https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=72f48776-a69e-496c-a823-dc6ee91dfd10" | jq '.[0:3]'
```

**Example Response:**
```json
[
  {
    "DESTINATION": "North Springs",
    "DIRECTION": "N",
    "EVENT_TIME": "10/26/2025 10:58:41 AM",
    "IS_REALTIME": "true",
    "LINE": "RED",
    "NEXT_ARR": "10:59:43 AM",
    "STATION": "MEDICAL CENTER STATION",
    "TRAIN_ID": "401",
    "WAITING_SECONDS": "41",
    "WAITING_TIME": "Arriving",
    "DELAY": "T-17S",
    "LATITUDE": "33.901559",
    "LONGITUDE": "-84.360233"
  }
]
```

**Status:** 200 OK
**Latency:** ~300ms
**Data Format:** JSON array of train positions

---

### 3. MARTA Train API (Proxied via allOrigins) - Port 443 ✅

**Proxied Test (Works in Codespaces):**
```bash
curl -s "https://api.allorigins.win/raw?url=https%3A%2F%2Fdeveloperservices.itsmarta.com%3A18096%2Fitsmarta%2Frailrealtimearrivals%2Fdeveloperservices%2Ftraindata%3FapiKey%3D72f48776-a69e-496c-a823-dc6ee91dfd10" | jq '.[0:3]'
```

**Same response as direct API** (returns identical JSON)

**Status:** 200 OK
**Latency:** ~500-800ms (proxy overhead +200-500ms)
**Data Format:** JSON array (same as direct)

---

## Environment-Specific Behavior

| Environment | Bus API | Train API (Direct) | Train API (Proxied) |
|-------------|---------|-------------------|---------------------|
| **Local** | ✅ Works | ✅ Works | ✅ Works (slower) |
| **Codespaces** | ✅ Works | ❌ Timeout | ✅ Works |
| **Production** | ✅ Works | ✅ Works | ✅ Works (slower) |

---

## Implementation in Code

The app automatically detects the environment and chooses the right endpoint:

```typescript
// Detect if running in Codespaces
const isCodespaces = Boolean(
  process.env.CODESPACES === "true" ||
  process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
);

// Define API URLs
const busUrl = "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb";
const trainUrl = `https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=${process.env.MARTA_TRAIN_API_KEY}`;

// Proxy train API only in Codespaces
const trainFetchUrl = isCodespaces
  ? `https://api.allorigins.win/raw?url=${encodeURIComponent(trainUrl)}`
  : trainUrl;

console.log(`Train API URL: ${isCodespaces ? 'PROXIED via allOrigins' : 'DIRECT'}`);

// Fetch both in parallel
const [busResponse, trainResponse] = await Promise.all([
  fetch(busUrl, { signal: controller.signal }),
  fetch(trainFetchUrl, { signal: controller.signal }),
]);
```

---

## API Keys

Your environment uses these keys (from `.env`):

```bash
MARTA_API_KEY=87f1b834-e983-4b3f-8d4e-533fb9fc758e          # General API (not used in current impl)
MARTA_TRAIN_API_KEY=72f48776-a69e-496c-a823-dc6ee91dfd10   # Train API (actively used)
USE_MOCK_MARTA_DATA=false                                   # Set to "true" to force mock data
```

---

## Performance Benchmarks

### Local Development
```
Bus API (direct):     ~140ms  ✅
Train API (direct):   ~300ms  ✅
Total (parallel):     ~300ms  ✅
```

### GitHub Codespaces
```
Bus API (direct):     ~200ms  ✅
Train API (direct):   TIMEOUT ❌
Train API (proxied):  ~600ms  ✅
Total (parallel):     ~600ms  ✅
```

### Production (Vercel)
```
Bus API (direct):     ~150ms  ✅
Train API (direct):   ~250ms  ✅
Total (parallel):     ~250ms  ✅
```

---

## Troubleshooting

### Issue: Train API times out in Codespaces

**Symptoms:**
```
MARTA GTFS-RT API request timed out.
Falling back to mock data
```

**Solution:**
Verify environment detection is working:
```bash
# In Codespaces terminal:
echo $CODESPACES
# Should output: true

echo $GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
# Should output: something like *.app.github.dev
```

If these are set, the proxy should automatically activate. Check application logs for:
```
🚀 CODESPACES DETECTED - Using proxy for MARTA API
Train API URL: PROXIED via allOrigins
```

---

### Issue: Proxy returns empty response

**Symptoms:**
- HTTP 200 but empty JSON
- No error messages

**Check:**
1. Test the proxy directly (see curl command above)
2. Verify API key is correct in `.env`
3. Check if allOrigins is down: `curl https://api.allorigins.win/`

**Fallback:**
Set `USE_MOCK_MARTA_DATA=true` in `.env` to use mock data

---

### Issue: Different data locally vs Codespaces

**This is normal!** Both are fetching real-time data. MARTA trains and buses are moving, so you'll get different positions at different times.

---

## Testing in Your Environment

### Test 1: Verify Environment Detection
```bash
# In your terminal:
node -e "console.log('CODESPACES:', process.env.CODESPACES || 'not set')"
node -e "console.log('GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:', process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'not set')"
```

### Test 2: Test Bus API
```bash
curl -I "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle/vehiclepositions.pb"
# Should return: HTTP/2 200
```

### Test 3: Test Train API (Direct)
```bash
curl -s "https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=72f48776-a69e-496c-a823-dc6ee91dfd10" | jq 'length'
# Should return: number of train records (usually 60-100)
```

### Test 4: Test Train API (Proxied)
```bash
curl -s "https://api.allorigins.win/raw?url=https%3A%2F%2Fdeveloperservices.itsmarta.com%3A18096%2Fitsmarta%2Frailrealtimearrivals%2Fdeveloperservices%2Ftraindata%3FapiKey%3D72f48776-a69e-496c-a823-dc6ee91dfd10" | jq 'length'
# Should return: same number as Test 3
```

---

## Data Structures

### Bus API Response (GTFS-RT Protobuf)
Binary format - decoded by `gtfs-realtime-bindings` library:
```typescript
{
  id: "vehicle_123",
  type: "bus",
  latitude: 33.755,
  longitude: -84.405,
  route: "1"
}
```

### Train API Response (JSON)
```json
{
  "DESTINATION": "North Springs",
  "DIRECTION": "N",
  "EVENT_TIME": "10/26/2025 10:58:41 AM",
  "IS_REALTIME": "true",
  "LINE": "RED",
  "NEXT_ARR": "10:59:43 AM",
  "STATION": "MEDICAL CENTER STATION",
  "TRAIN_ID": "401",
  "WAITING_SECONDS": "41",
  "WAITING_TIME": "Arriving",
  "DELAY": "T-17S",
  "LATITUDE": "33.901559",
  "LONGITUDE": "-84.360233"
}
```

**Note:** Train API returns multiple entries per train (one for each upcoming station). App deduplicates by `TRAIN_ID`.

---

## Security Considerations

### API Key Exposure
The train API key is passed through the proxy URL when using allOrigins. While allOrigins is a reputable service, be aware:

1. **Current Risk:** LOW
   - MARTA API keys are free
   - Rate limits are generous
   - Keys can be regenerated if needed

2. **For Production:**
   - Consider deploying your own proxy server
   - Implement rate limiting on your API route
   - Monitor for unusual traffic patterns
   - Rotate API keys periodically

3. **Codespaces is for Development:**
   - This solution is optimized for teaching/demo environments
   - Production deployments to Vercel/AWS use direct connections (no proxy)

---

## Next Steps for Class

### Teaching Points
1. **Environment Detection:** How to write environment-aware code
2. **Network Restrictions:** Why cloud environments limit outbound ports
3. **CORS Proxies:** How they work and when to use them
4. **Performance Tradeoffs:** Direct vs proxied API calls
5. **Fallback Strategies:** Mock data, error handling, graceful degradation

### Demo Flow
1. Show working app locally (direct API)
2. Deploy to Codespaces (triggers proxy automatically)
3. Check console logs to see environment detection
4. Compare performance (Network tab in DevTools)
5. Discuss tradeoffs and alternatives

---

## References

- **MARTA Developer Portal:** https://www.itsmarta.com/app-developer-resources.aspx
- **allOrigins GitHub:** https://github.com/gnuns/allorigins
- **GitHub Codespaces Env Vars:** https://docs.github.com/en/codespaces/developing-in-codespaces/default-environment-variables-for-your-codespace
- **GTFS-RT Specification:** https://developers.google.com/transit/gtfs-realtime

---

## Changelog

| Date | Change | Verified |
|------|--------|----------|
| 2025-10-26 | Initial testing of both APIs | ✅ |
| 2025-10-26 | Verified proxy solution works | ✅ |
| 2025-10-26 | Documented curl test commands | ✅ |
