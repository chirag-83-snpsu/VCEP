/**
 * Safe AI Provider Smoke Test (Step 4)
 * Evaluates server-side connection with: "What is 2 + 2?"
 * Zero credentials or tokens are printed to console.
 */

import { runProviderSmokeTest, resolveProviderConfig } from '../lib/vivi/vivi-providers.server.ts';

console.log('================================================================');
console.log('VCEP VIVI AI — SAFE SERVER-SIDE PROVIDER SMOKE TEST (STEP 4)');
console.log('================================================================\n');

const config = resolveProviderConfig();
console.log('1. Active Provider Configuration:');
console.log(`   - Provider Type: ${config.provider}`);
console.log(`   - Model Identifier: ${config.model}`);
console.log(`   - Endpoint: ${config.endpoint || 'Cloudflare Native Edge Binding'}`);
console.log(`   - Credentials Present: ${config.available ? 'YES (Securely Loaded)' : 'NO (Missing Credentials)'}`);
console.log(`   - Config Source: ${config.source}\n`);

console.log('2. Executing Minimal Smoke Test Query: "What is 2 + 2?"...');
const result = await runProviderSmokeTest();

console.log('\n3. Smoke Test Diagnostic Outcome:');
console.log(`   - Outcome: ${result.success ? 'SUCCESS (200 OK)' : 'FAILED / BLOCKED'}`);
console.log(`   - HTTP Status: ${result.status}`);
console.log(`   - Provider Error Code: ${result.providerErrorCode || 'NONE'}`);
console.log(`   - Configured Model: ${result.model}`);
console.log(`   - Request Duration: ${result.durationMs}ms`);
console.log(`   - Retryable: ${result.retryable}`);
if (result.responseText) {
  console.log(`   - Generated Response Text: "${result.responseText.replace(/\n+/g, ' ')}"`);
}
if (result.error) {
  console.log(`   - Sanitized Error Detail: "${result.error}"`);
}

console.log('\n================================================================');
if (result.success) {
  console.log('SMOKE TEST PASSED: Real AI inference connection is healthy!');
} else {
  console.log('SMOKE TEST FAILED: Provider connection is unconfigured or blocked.');
}
console.log('================================================================\n');
