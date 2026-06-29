export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Trekking" | "Camping" | "Waterfalls" | "Forts" | "Glamping" | "Water Sports";
export type DemandSignal = "Low" | "Medium" | "High";
export type WeatherRisk = "Low" | "Moderate" | "High";
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export type Adventure = {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  basePrice: number;
  location: string;
  district: string;
  originHints: string[];
  travelHoursFromOrigin: Record<string, number>;
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
  operatorId: string;
  rating?: number;
  reviewsCount?: number;
};

export type AdventureDate = {
  id: string;
  adventureId: string;
  date: string;
  slotsTotal: number;
  slotsLeft: number;
  version: number;
  weatherRisk: WeatherRisk;
  demandSignal: DemandSignal;
  dynamicPrice: number;
};

export type Operator = {
  id: string;
  name: string;
  yearsActive: number;
  rating: number;
  contact: string;
  adventureIds: string[];
};

export type Booking = {
  id: string;
  userId: string;
  adventureDateId: string;
  slotsBooked: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  dietaryPreference?: "veg" | "non-veg" | "vegan" | "no-preference";
  specialRequests?: string;
  paymentStatus?: "mock_succeeded";
  paymentReference?: string;
};

export type RecommendationInput = {
  duration: "weekend" | "long-weekend" | "week";
  budget: 5000 | 10000 | 15000;
  vibe: "adrenaline" | "nature" | "chill";
  origin?: string;
};

export type RecommendationBreakdown = {
  budgetFit: number;
  travelFit: number;
  weatherFit: number;
  difficultyFit: number;
  availabilityFit: number;
  vibeFit: number;
};

export type AdventureWithDates = Adventure & {
  nextDates: AdventureDate[];
  nextAvailableDate: AdventureDate | null;
};

export type Recommendation = {
  adventure: AdventureWithDates;
  score: number;
  weekendConfidenceScore: number;
  breakdown: RecommendationBreakdown;
  reasons: string[];
  travelHours: number;
};

export type OperatorRecentBooking = {
  id: string;
  trip: string;
  date: string;
  guests: number;
  amount: number;
  status: BookingStatus;
  customerName: string;
};

export type OperatorAdventureMetric = {
  id: string;
  title: string;
  location: string;
  slotsLeft: number;
  slotsTotal: number;
  price: number;
  demandSignal: DemandSignal;
};

export type OperatorDashboardMetrics = {
  operator: Operator;
  totalRevenue: number;
  bookingsCount: number;
  averageOccupancy: number;
  recentBookings: OperatorRecentBooking[];
  adventures: OperatorAdventureMetric[];
};
