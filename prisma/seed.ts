import { PrismaClient } from "@prisma/client";
import { adventureDates, adventures, bookings, operators } from "@/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.adventureDate.deleteMany();
  await prisma.adventure.deleteMany();
  await prisma.operator.deleteMany();

  for (const operator of operators) {
    await prisma.operator.create({
      data: {
        id: operator.id,
        name: operator.name,
        yearsActive: operator.yearsActive,
        rating: operator.rating,
        contact: operator.contact
      }
    });
  }

  for (const adventure of adventures) {
    await prisma.adventure.create({
      data: {
        id: adventure.id,
        title: adventure.title,
        category: adventure.category,
        difficulty: adventure.difficulty,
        basePrice: adventure.basePrice,
        location: adventure.location,
        district: adventure.district,
        lat: adventure.lat,
        lng: adventure.lng,
        tags: adventure.tags,
        heroImage: adventure.heroImage,
        gallery: adventure.gallery,
        description: adventure.description,
        shortDescription: adventure.shortDescription,
        itinerary: adventure.itinerary,
        included: adventure.included,
        cancellationPolicy: adventure.cancellationPolicy,
        durationHours: adventure.durationHours,
        travelHoursFromOrigin: adventure.travelHoursFromOrigin,
        originHints: adventure.originHints,
        operatorId: adventure.operatorId
      }
    });
  }

  for (const date of adventureDates) {
    await prisma.adventureDate.create({
      data: {
        id: date.id,
        adventureId: date.adventureId,
        date: new Date(date.date),
        slotsTotal: date.slotsTotal,
        slotsLeft: date.slotsLeft,
        weatherRisk: date.weatherRisk,
        demandSignal: date.demandSignal,
        dynamicPrice: date.dynamicPrice
      }
    });
  }

  for (const booking of bookings) {
    await prisma.booking.create({
      data: {
        id: booking.id,
        userId: booking.userId,
        adventureDateId: booking.adventureDateId,
        slotsBooked: booking.slotsBooked,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: new Date(booking.createdAt)
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
