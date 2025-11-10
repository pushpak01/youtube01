// test-env.js - UPDATED
require('dotenv').config({ path: '.env.local' });
console.log("Private Key:", process.env.DEPLOYER_PRIVATE_KEY ? "✅ Loaded" : "❌ Missing");
console.log("Length:", process.env.DEPLOYER_PRIVATE_KEY?.length);