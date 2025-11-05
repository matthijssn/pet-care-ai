const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const env = process.env;

function writeEnvFile(targetPath, isProd) {
  const content = `export const environment = {
  production: ${isProd},
  baseUrl: '${env.BASE_URL || 'http://localhost:3000'}'
};
`;
  fs.writeFileSync(targetPath, content, { encoding: 'utf8' });
  console.log(`Wrote environment file to ${targetPath}`);
}

const outDir = path.resolve(__dirname, '..', 'src', 'environments');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

writeEnvFile(path.join(outDir, 'environment.development.ts'), false);
writeEnvFile(path.join(outDir, 'environment.ts'), true);
