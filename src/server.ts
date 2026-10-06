import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await connectDatabase();

    const app = createApp();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  School Management System Backend Running`);
      console.log(`  URL: http://localhost:${PORT}`);
      console.log(`  API Base: http://localhost:${PORT}/api`);
      console.log(`  Health: http://localhost:${PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
