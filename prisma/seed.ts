import { EventType, InstitutionType, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const imgFor = (title: string, w = 600, h = 400) =>
  `https://picsum.photos/seed/${encodeURIComponent(slugify(title))}/${w}/${h}`;

async function main() {
  await prisma.favorite.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.user.deleteMany({});

  // korisnici
  const hashed = await bcrypt.hash('lozinka123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@kultura.rs',
      password: hashed,
      name: 'Administrator',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: 'organizator@kultura.rs',
      password: hashed,
      name: 'Maja Organizator',
      role: Role.ORGANIZER,
      isActive: true,
    },
  });

  const visitor = await prisma.user.create({
    data: {
      email: 'posetilac@kultura.rs',
      password: hashed,
      name: 'Marko Posetilac',
      role: Role.VISITOR,
      isActive: true,
    },
  });

  // institucije
  const narodniMuzej = await prisma.institution.create({
    data: {
      name: 'Narodni muzej',
      description:
        'Najstarija muzejska institucija u Srbiji sa bogatom zbirkom.',
      type: InstitutionType.MUSEUM,
      address: 'Trg republike 1, Beograd',
      contactEmail: 'info@narodnimuzej.rs',
      imageUrl: imgFor('Narodni muzej'),
    },
  });

  const msu = await prisma.institution.create({
    data: {
      name: 'Muzej savremene umetnosti',
      description: 'Zbirke i izložbe savremene umetnosti iz regiona i sveta.',
      type: InstitutionType.MUSEUM,
      address: 'Ušće 10, Blok 15, Beograd',
      contactEmail: 'kontakt@msu.rs',
      imageUrl: imgFor('Muzej savremene umetnosti'),
    },
  });

  const atelje212 = await prisma.institution.create({
    data: {
      name: 'Atelje 212',
      description: 'Pozorište sa bogatim repertoarom savremenih drama.',
      type: InstitutionType.THEATER,
      address: 'Svetogorska 12, Beograd',
      contactEmail: 'office@atelje212.rs',
      imageUrl: imgFor('Atelje 212'),
    },
  });

  const galerijaRemont = await prisma.institution.create({
    data: {
      name: 'Galerija Remont',
      description: 'Prostor savremene umetničke produkcije i izlaganja.',
      type: InstitutionType.GALLERY,
      address: 'Maršala Birjuzova 7, Beograd',
      contactEmail: 'remont@remont.net',
      imageUrl: imgFor('Galerija Remont'),
    },
  });

  const daysFromNow = (d: number) => {
    const now = new Date();
    now.setDate(now.getDate() + d);
    now.setSeconds(0, 0);
    return now;
  };

  // događaji
  const e1Title = 'Koncert Beogradske filharmonije: Veče klasike';
  const e1 = await prisma.event.create({
    data: {
      title: e1Title,
      description: 'Simfonijski program sa delima Mocarta i Betovena.',
      dateTime: daysFromNow(7),
      type: EventType.CONCERT,
      capacity: 350,
      imageUrl: imgFor(e1Title),
      createdById: organizer.id,
      institutionId: narodniMuzej.id,
    },
  });

  const e2Title = 'Izložba: Savremena srpska umetnost 1990–2025';
  const e2 = await prisma.event.create({
    data: {
      title: e2Title,
      description: 'Pregled najznačajnijih radova savremene srpske umetnosti.',
      dateTime: daysFromNow(14),
      type: EventType.EXHIBITION,
      capacity: 200,
      imageUrl: imgFor(e2Title),
      createdById: organizer.id,
      institutionId: msu.id,
    },
  });

  const e3Title = 'Predstava: Hamlet (Atelje 212)';
  const e3 = await prisma.event.create({
    data: {
      title: e3Title,
      description: 'Šekspirov klasik u savremenoj režiji.',
      dateTime: daysFromNow(3),
      type: EventType.THEATER,
      capacity: 180,
      imageUrl: imgFor(e3Title),
      createdById: organizer.id,
      institutionId: atelje212.id,
    },
  });

  const e4Title = 'Festival dokumentarnog filma: Istinite priče';
  const e4 = await prisma.event.create({
    data: {
      title: e4Title,
      description: 'Selekcija domaćih i međunarodnih dokumentaraca.',
      dateTime: daysFromNow(21),
      type: EventType.FESTIVAL,
      capacity: 500,
      imageUrl: imgFor(e4Title),
      createdById: organizer.id,
      institutionId: narodniMuzej.id,
    },
  });

  const e5Title = 'Izložba grafike: Linija i senka';
  const e5 = await prisma.event.create({
    data: {
      title: e5Title,
      description: 'Savremene grafičke tehnike mladih autora.',
      dateTime: daysFromNow(10),
      type: EventType.EXHIBITION,
      capacity: 120,
      imageUrl: imgFor(e5Title),
      createdById: organizer.id,
      institutionId: galerijaRemont.id,
    },
  });

  // favoriti / rezervacije
  await prisma.favorite.create({
    data: { userId: visitor.id, eventId: e1.id },
  });
  await prisma.reservation.create({
    data: { userId: visitor.id, eventId: e1.id },
  });

  await prisma.favorite.create({
    data: { userId: visitor.id, eventId: e3.id },
  });

  console.log('✅ Seed (srpski podaci) uspešno ubačen.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Greška u seed-u:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
