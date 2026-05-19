import * as mongoose from 'mongoose';
import * as path from 'path';
import * as dotenv from 'dotenv';

// ─── Load .env ────────────────────────────────────────────────────────────────

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI não encontrado em .env');
  process.exit(1);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function sync() {
  await mongoose.connect(MONGODB_URI!);
  console.log('✅  MongoDB conectado\n');

  const db = mongoose.connection.db!;
  const clients    = db.collection('clients');
  const viagens    = db.collection('viagens');
  const passengers = db.collection('passengers');

  const allClients = await clients.find({}, { projection: { _id: 1 } }).toArray();
  console.log(`📋  ${allClients.length} clientes encontrados\n`);

  let updated = 0;

  for (const client of allClients) {
    const tripCount      = await viagens.countDocuments({ clientId: client._id });
    const passengerCount = await passengers.countDocuments({ clientId: client._id });

    await clients.updateOne(
      { _id: client._id },
      { $set: { tripCount, passengerCount } },
    );

    if (tripCount > 0 || passengerCount > 0) {
      console.log(`  ✓ ${client._id}  →  viagens: ${tripCount}  passageiros: ${passengerCount}`);
    }
    updated++;
  }

  console.log(`\n✅  ${updated} clientes sincronizados!\n`);
  await mongoose.disconnect();
}

sync().catch((err) => {
  console.error('❌  Erro no sync:', err);
  process.exit(1);
});
