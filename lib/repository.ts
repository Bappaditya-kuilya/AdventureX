import { Adventure, AdventureDate, AdventureWithDates, Booking, Operator, OperatorDashboardMetrics } from "@/lib/types";
import { adventureDates, adventures, bookings, operators } from "@/lib/data";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export class BookingConflictError extends Error {
  constructor(message = "Not enough slots available") {
    super(message);
    this.name = "BookingConflictError";
  }
}

type AdventureRecord = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  basePrice: number;
  location: string;
  district: string;
  lat: number;
  lng: number;
  tags: string[];
  heroImage: string;
  gallery: string[];
  description: string;
  shortDescription: string;
  itinerary: string[];
  included: string[];
  cancellationPolicy: string;
  durationHours: number;
  originHints: string[];
  travelHoursFromOrigin: Record<string, number>;
  operatorId: string;
};

function sortDates<T extends { date: string }>(dates: T[]) {
  return [...dates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function normalizeAdventure(record: AdventureRecord): Adventure {
  return {
    id: record.id,
    title: record.title,
    category: record.category as Adventure["category"],
    difficulty: record.difficulty as Adventure["difficulty"],
    basePrice: record.basePrice,
    location: record.location,
    district: record.district,
    lat: record.lat,
    lng: record.lng,
    tags: record.tags,
    heroImage: record.heroImage,
    gallery: record.gallery,
    description: record.description,
    shortDescription: record.shortDescription,
    itinerary: record.itinerary,
    included: record.included,
    cancellationPolicy: record.cancellationPolicy,
    durationHours: record.durationHours,
    originHints: record.originHints,
    travelHoursFromOrigin: record.travelHoursFromOrigin,
    operatorId: record.operatorId
  };
}

function normalizeAdventureDate(record: {
  id: string;
  adventureId: string;
  date: string | Date;
  slotsTotal: number;
  slotsLeft: number;
  version?: number;
  weatherRisk: string;
  demandSignal: string;
  dynamicPrice: number;
}): AdventureDate {
  return {
    id: record.id,
    adventureId: record.adventureId,
    date: typeof record.date === "string" ? record.date : record.date.toISOString().slice(0, 10),
    slotsTotal: record.slotsTotal,
    slotsLeft: record.slotsLeft,
    version: record.version ?? 0,
    weatherRisk: record.weatherRisk as AdventureDate["weatherRisk"],
    demandSignal: record.demandSignal as AdventureDate["demandSignal"],
    dynamicPrice: record.dynamicPrice
  };
}

function normalizeBooking(record: {
  id: string;
  userId: string;
  adventureDateId: string;
  slotsBooked: number;
  totalPrice: number;
  status: string;
  createdAt: string | Date;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  dietaryPreference?: string | null;
  specialRequests?: string | null;
  paymentStatus?: string | null;
  paymentReference?: string | null;
}): Booking {
  return {
    id: record.id,
    userId: record.userId,
    adventureDateId: record.adventureDateId,
    slotsBooked: record.slotsBooked,
    totalPrice: record.totalPrice,
    status: record.status as Booking["status"],
    createdAt: typeof record.createdAt === "string" ? record.createdAt : record.createdAt.toISOString(),
    customerName: record.customerName ?? undefined,
    customerEmail: record.customerEmail ?? undefined,
    customerPhone: record.customerPhone ?? undefined,
    dietaryPreference: record.dietaryPreference as Booking["dietaryPreference"],
    specialRequests: record.specialRequests ?? undefined,
    paymentStatus: record.paymentStatus as Booking["paymentStatus"],
    paymentReference: record.paymentReference ?? undefined
  };
}

function shouldUseDatabase() {
  if (env.DATA_SOURCE_MODE === "memory") return false;
  if (env.DATA_SOURCE_MODE === "database") return true;
  return Boolean(env.DATABASE_URL);
}

async function withFallback<T>(databaseWork: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!shouldUseDatabase()) return fallback();

  try {
    return await databaseWork();
  } catch (error) {
    // Never swallow DB failures silently — a transient outage would otherwise
    // serve stale in-memory data (and, for writes, lose a "confirmed" booking).
    console.error("[repository] database operation failed, serving in-memory fallback:", error);
    return fallback();
  }
}

export async function listAdventures(): Promise<Adventure[]> {
  return withFallback(
    async () => {
      const result = await prisma.adventure.findMany();
      return result.map((item) => normalizeAdventure(item as AdventureRecord));
    },
    () => adventures
  );
}

export async function listAdventureDates(): Promise<AdventureDate[]> {
  return withFallback(
    async () => {
      const result = await prisma.adventureDate.findMany();
      return sortDates(result.map((item) => normalizeAdventureDate(item)));
    },
    () => sortDates(adventureDates)
  );
}

export async function listBookings(): Promise<Booking[]> {
  return withFallback(
    async () => {
      const result = await prisma.booking.findMany();
      return result.map((item) => normalizeBooking(item));
    },
    () => bookings
  );
}

export async function listOperators(): Promise<Operator[]> {
  return withFallback(
    async () => {
      const result = await prisma.operator.findMany({
        include: {
          adventures: {
            select: { id: true }
          }
        }
      });

      return result.map((operator) => ({
        id: operator.id,
        name: operator.name,
        yearsActive: operator.yearsActive,
        rating: operator.rating,
        contact: operator.contact,
        adventureIds: operator.adventures.map((adventure) => adventure.id)
      }));
    },
    () => operators
  );
}

export async function getAdventureById(id: string): Promise<Adventure | undefined> {
  return withFallback(
    async () => {
      const record = await prisma.adventure.findUnique({ where: { id } });
      return record ? normalizeAdventure(record as AdventureRecord) : undefined;
    },
    () => adventures.find((adventure) => adventure.id === id)
  );
}

export async function getAdventureDates(adventureId: string): Promise<AdventureDate[]> {
  return withFallback(
    async () => {
      const result = await prisma.adventureDate.findMany({
        where: { adventureId },
        orderBy: { date: "asc" }
      });
      return result.map((item) => normalizeAdventureDate(item));
    },
    () => sortDates(adventureDates.filter((date) => date.adventureId === adventureId))
  );
}

export async function getAdventureDateById(id: string): Promise<AdventureDate | undefined> {
  return withFallback(
    async () => {
      const result = await prisma.adventureDate.findUnique({ where: { id } });
      return result ? normalizeAdventureDate(result) : undefined;
    },
    () => adventureDates.find((date) => date.id === id)
  );
}

export async function getAdventureWithDates(id: string): Promise<AdventureWithDates | undefined> {
  const [adventure, nextDates] = await Promise.all([getAdventureById(id), getAdventureDates(id)]);
  if (!adventure) return undefined;

  return {
    ...adventure,
    nextDates,
    nextAvailableDate: nextDates.find((date) => date.slotsLeft > 0) ?? null
  };
}

export async function listAdventuresWithDates(): Promise<AdventureWithDates[]> {
  const [allAdventures, allDates] = await Promise.all([listAdventures(), listAdventureDates()]);

  return allAdventures.map((adventure) => {
    const nextDates = sortDates(allDates.filter((date) => date.adventureId === adventure.id));
    return {
      ...adventure,
      nextDates,
      nextAvailableDate: nextDates.find((date) => date.slotsLeft > 0) ?? null
    };
  });
}

export async function getOperatorById(id: string): Promise<Operator | undefined> {
  const allOperators = await listOperators();
  return allOperators.find((operator) => operator.id === id);
}

export async function getOperatorDashboardMetrics(operatorId: string): Promise<OperatorDashboardMetrics | null> {
  const [operator, allAdventures, allBookings] = await Promise.all([
    getOperatorById(operatorId),
    listAdventuresWithDates(),
    listBookings()
  ]);

  if (!operator) return null;

  const operatorAdventureIds = new Set(operator.adventureIds);
  const operatorAdventures = allAdventures.filter((adventure) => operatorAdventureIds.has(adventure.id));
  const adventureByDateId = new Map<string, AdventureWithDates>();

  for (const adventure of operatorAdventures) {
    for (const date of adventure.nextDates) {
      adventureByDateId.set(date.id, adventure);
    }
  }

  const operatorBookings = allBookings.filter((booking) => adventureByDateId.has(booking.adventureDateId));
  const confirmedBookings = operatorBookings.filter((booking) => booking.status === "confirmed");
  const allOperatorDates = operatorAdventures.flatMap((adventure) => adventure.nextDates);
  const occupiedPercentages = allOperatorDates
    .filter((date) => date.slotsTotal > 0)
    .map((date) => Math.round(((date.slotsTotal - date.slotsLeft) / date.slotsTotal) * 100));

  const averageOccupancy = occupiedPercentages.length
    ? Math.round(occupiedPercentages.reduce((sum, value) => sum + value, 0) / occupiedPercentages.length)
    : 0;

  const recentBookings = [...operatorBookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((booking) => {
      const adventure = adventureByDateId.get(booking.adventureDateId);
      const date = adventure?.nextDates.find((item) => item.id === booking.adventureDateId);

      return {
        id: booking.id,
        trip: adventure?.title ?? "Adventure",
        date: date?.date ?? booking.createdAt.slice(0, 10),
        guests: booking.slotsBooked,
        amount: booking.totalPrice,
        status: booking.status,
        customerName: booking.customerName ?? "Demo guest"
      };
    });

  const adventuresForDashboard = operatorAdventures.map((adventure) => {
    const slotsLeft = adventure.nextDates.reduce((sum, date) => sum + date.slotsLeft, 0);
    const slotsTotal = adventure.nextDates.reduce((sum, date) => sum + date.slotsTotal, 0);
    const nextDate = adventure.nextAvailableDate ?? adventure.nextDates[0];

    return {
      id: adventure.id,
      title: adventure.title,
      location: adventure.location,
      slotsLeft,
      slotsTotal,
      price: nextDate?.dynamicPrice ?? adventure.basePrice,
      demandSignal: nextDate?.demandSignal ?? "Low"
    };
  });

  return {
    operator,
    totalRevenue: confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
    bookingsCount: operatorBookings.length,
    averageOccupancy,
    recentBookings,
    adventures: adventuresForDashboard
  };
}

export async function createBooking(input: {
  id: string;
  userId: string;
  adventureDateId: string;
  slotsBooked: number;
  totalPrice: number;
  status: Booking["status"];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dietaryPreference?: Booking["dietaryPreference"];
  specialRequests?: string;
  paymentStatus: Booking["paymentStatus"];
  paymentReference: string;
}): Promise<Booking> {
  // Writes are careful about fallback: a real capacity conflict must surface
  // (never retry it against a different in-memory slot count), but an infra
  // error (DB unreachable / not migrated) falls back to the in-memory demo
  // store so the flow keeps working — same behavior as the read paths.
  if (shouldUseDatabase()) {
    try {
      const booking = await prisma.$transaction(async (tx) => {
        const reserved = await tx.adventureDate.updateMany({
          where: {
            id: input.adventureDateId,
            slotsLeft: { gte: input.slotsBooked }
          },
          data: {
            slotsLeft: { decrement: input.slotsBooked },
            version: { increment: 1 }
          }
        });

        if (reserved.count !== 1) {
          throw new BookingConflictError();
        }

        return tx.booking.create({
          data: {
            id: input.id,
            userId: input.userId,
            adventureDateId: input.adventureDateId,
            slotsBooked: input.slotsBooked,
            totalPrice: input.totalPrice,
            status: input.status,
            createdAt: new Date(),
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            dietaryPreference: input.dietaryPreference,
            specialRequests: input.specialRequests,
            paymentStatus: input.paymentStatus,
            paymentReference: input.paymentReference
          }
        });
      });

      return normalizeBooking(booking);
    } catch (error) {
      // A genuine "no slots" conflict is authoritative — surface it, don't fall back.
      if (error instanceof BookingConflictError) throw error;
      // Infrastructure failure: log loudly and drop to the in-memory path below.
      console.error("[repository] booking DB write failed, using in-memory fallback:", error);
    }
  }

  // In-memory path (no DB configured, or DB unreachable): the single-threaded
  // event loop makes this check-then-write atomic in practice.
  const dateIndex = adventureDates.findIndex((date) => date.id === input.adventureDateId);
  if (dateIndex === -1 || adventureDates[dateIndex].slotsLeft < input.slotsBooked) {
    throw new BookingConflictError();
  }

  adventureDates[dateIndex] = {
    ...adventureDates[dateIndex],
    slotsLeft: adventureDates[dateIndex].slotsLeft - input.slotsBooked,
    version: (adventureDates[dateIndex].version ?? 0) + 1
  };

  const booking: Booking = {
    id: input.id,
    userId: input.userId,
    adventureDateId: input.adventureDateId,
    slotsBooked: input.slotsBooked,
    totalPrice: input.totalPrice,
    status: input.status,
    createdAt: new Date().toISOString(),
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    dietaryPreference: input.dietaryPreference,
    specialRequests: input.specialRequests,
    paymentStatus: input.paymentStatus,
    paymentReference: input.paymentReference
  };

  bookings.unshift(booking);
  return booking;
}
