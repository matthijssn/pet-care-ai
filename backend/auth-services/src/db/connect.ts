import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pet-care-ai';

/**
 * Maakt verbinding met de MongoDB-database via Mongoose.
 * Zorgt voor logging en foutafhandeling.
 */
export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI, {
      // Optioneel: extra settings voor stabiliteit
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ Verbonden met MongoDB: ${MONGO_URI}`);
  } catch (error) {
    console.error('❌ Fout bij verbinden met MongoDB:', error);
    process.exit(1); // Stop de app als DB niet bereikbaar is
  }
}

/**
 * Sluit de verbinding netjes af (bijv. bij SIGTERM).
 */
export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('🔌 MongoDB-verbinding gesloten.');
  } catch (error) {
    console.error('❌ Fout bij sluiten van MongoDB-verbinding:', error);
  }
}