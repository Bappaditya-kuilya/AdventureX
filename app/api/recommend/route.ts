import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendations";
import { recommendationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = recommendationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid recommendation input" }, { status: 400 });
  }

  const recommendations = await getRecommendations(parsed.data);
  return NextResponse.json({ recommendations });
}
