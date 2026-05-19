import * as mongoose from 'mongoose';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Seeds legados (6 segmentos) usados APENAS por este script para preservar a
// taxonomia antiga ao migrar dados pré-existentes. O runtime usa os 3 defaults
// definidos em `client-segments/constants/curated-icons.ts`.
const LEGACY_SEGMENT_SEEDS = [
  { name: 'VIP',       icon: 'Crown',     color: 'var(--color-gold-bg)',  order: 0 },
  { name: 'Gold',      icon: 'Award',     color: 'var(--color-gold-bg)',  order: 1 },
  { name: 'Silver',    icon: 'Star',      color: 'var(--secondary)',      order: 2 },
  { name: 'Bronze',    icon: 'Gem',       color: 'var(--muted)',          order: 3 },
  { name: 'Corporate', icon: 'Briefcase', color: 'var(--color-blue-bg)',  order: 4 },
  { name: 'Leisure',   icon: 'Palmtree',  color: 'var(--color-green-bg)', order: 5 },
];

// ─── Load .env ────────────────────────────────────────────────────────────────

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI não encontrado em .env');
  process.exit(1);
}

// Mapeia o enum antigo (lowercase string) para o nome do segmento default semente
const OLD_TO_DEFAULT_NAME: Record<string, string> = {
  vip: 'VIP',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  corporate: 'Corporate',
  leisure: 'Leisure',
};

async function migrate() {
  await mongoose.connect(MONGODB_URI!);
  console.log('✅  MongoDB conectado\n');

  const db = mongoose.connection.db!;
  const agencies = db.collection('agencies');
  const segments = db.collection('clientsegments');
  const clients = db.collection('clients');

  const allAgencies = await agencies.find({}, { projection: { _id: 1, name: 1 } }).toArray();
  console.log(`🏢  ${allAgencies.length} agência(s) encontradas\n`);

  let totalSegmentsCreated = 0;
  let totalClientsMigrated = 0;

  for (const agency of allAgencies) {
    const agencyId = agency._id;
    console.log(`→ Agência ${agency.name ?? agencyId}`);

    // 1. Cria seeds se ainda não existem
    const existing = await segments.find({ agencyId }).toArray();
    const byName = new Map<string, mongoose.Types.ObjectId>(
      existing.map((s) => [s.name as string, s._id as mongoose.Types.ObjectId]),
    );

    for (const seed of LEGACY_SEGMENT_SEEDS) {
      if (byName.has(seed.name)) continue;
      const inserted = await segments.insertOne({
        agencyId,
        name: seed.name,
        icon: seed.icon,
        color: seed.color,
        order: seed.order,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      byName.set(seed.name, inserted.insertedId as mongoose.Types.ObjectId);
      totalSegmentsCreated++;
      console.log(`   + segmento "${seed.name}" criado`);
    }

    // 2. Migra clientes da agência: enum antigo → segmentId
    const agencyClients = await clients
      .find({ agencyId }, { projection: { _id: 1, segment: 1, segmentId: 1 } })
      .toArray();

    for (const c of agencyClients) {
      if (c.segmentId) continue; // já migrado

      const oldKey = (c.segment as string | undefined)?.toLowerCase() ?? 'bronze';
      const defaultName = OLD_TO_DEFAULT_NAME[oldKey] ?? 'Bronze';
      const segId = byName.get(defaultName) ?? byName.get('Bronze');
      if (!segId) {
        console.warn(`   ! cliente ${c._id} sem segmento mapeável (oldKey=${oldKey})`);
        continue;
      }

      await clients.updateOne(
        { _id: c._id },
        { $set: { segmentId: segId }, $unset: { segment: '' } },
      );
      totalClientsMigrated++;
    }

    console.log(`   ✓ ${agencyClients.length} cliente(s) processados\n`);
  }

  console.log(`\n✅  Migração concluída`);
  console.log(`   ${totalSegmentsCreated} segmento(s) criados`);
  console.log(`   ${totalClientsMigrated} cliente(s) migrados\n`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error('❌  Erro na migração:', err);
  process.exit(1);
});
