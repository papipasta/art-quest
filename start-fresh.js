const { spawn } = require('child_process');

console.log('🚀 Starting fresh ART QUEST server...');

// 環境変数を設定
process.env.PORT = '3009';
process.env.BROWSER = 'none';
process.env.FAST_REFRESH = 'false';

// react-scripts を起動
const server = spawn('npx', ['react-scripts', 'start'], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

server.on('exit', (code) => {
  console.log(`🛑 Server exited with code ${code}`);
});

console.log('✅ Server starting on http://localhost:3009');