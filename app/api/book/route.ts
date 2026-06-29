import { NextResponse } from "next/server";
import { BookingConflictError, createBooking, getAdventureById, getAdventureDateById } from "@/lib/repository";
import { bookingSchema } from "@/lib/validation";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = bookingSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid booking request" }, { status: 400 });
  }

  const [adventure, adventureDate] = await Promise.all([
    getAdventureById(parsed.data.adventureId),
    getAdventureDateById(parsed.data.adventureDateId)
  ]);

  if (!adventure) {
    return NextResponse.json({ error: "Adventure not found" }, { status: 404 });
  }

  if (!adventureDate || adventureDate.adventureId !== adventure.id) {
    return NextResponse.json({ error: "Adventure date not found" }, { status: 404 });
  }

  if (adventureDate.date !== parsed.data.date) {
    return NextResponse.json({ error: "Invalid date selection" }, { status: 400 });
  }

  if (parsed.data.participants > adventureDate.slotsLeft) {
    return NextResponse.json({ error: "Cannot exceed available slots" }, { status: 409 });
  }

  const bookingId = `AX-${adventure.id.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const paymentReference = `py_demo_${Date.now()}`;
  const totalPrice = adventureDate.dynamicPrice * parsed.data.participants;

  try {
    const booking = await createBooking({
      id: bookingId,
      userId: "demo-user",
      adventureDateId: adventureDate.id,
      slotsBooked: parsed.data.participants,
      totalPrice,
      status: "confirmed",
      customerName: parsed.data.name,
      customerEmail: parsed.data.email,
      customerPhone: parsed.data.phone,
      dietaryPreference: parsed.data.dietaryPreference,
      specialRequests: parsed.data.specialRequests,
      paymentStatus: "mock_succeeded",
      paymentReference
    });

    // Fire the confirmation email. The sender never throws and no-ops without a
    // configured API key, so this can't fail an otherwise successful booking.
    const email = await sendBookingConfirmationEmail({
      to: parsed.data.email,
      customerName: parsed.data.name,
      bookingId: booking.id,
      adventureTitle: adventure.title,
      location: adventure.location,
      date: adventureDate.date,
      participants: parsed.data.participants,
      totalPrice,
      paymentReference
    });

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      booking,
      emailSent: email.sent,
      details: {
        adventure: adventure.title,
        date: adventureDate.date,
        participants: parsed.data.participants,
        totalPrice,
        paymentStatus: "Mock (Stripe test mode)",
        paymentReference
      }
    });
  } catch (error) {
    if (error instanceof BookingConflictError) {
      return NextResponse.json(
        { error: "Booking failed. This trip filled up before your confirmation." },
        { status: 409 }
      );
    }

    throw error;
  }
}
