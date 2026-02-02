import dotenv from 'dotenv';
import App from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

const application = new App();
const server = application.getApp();

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 Book Inventory API - Ready to serve requests`);
});
