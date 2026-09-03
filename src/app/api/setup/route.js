import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { seedDatabase } from "@/server/seed";

export async function POST() {
  try {
    await connectDb();
    const existing = await User.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Setup has already been run. Sign in as admin instead." },
        { status: 409 },
      );
    }
    const result = await seedDatabase();
    return NextResponse.json({
      ok: true,
      message: `Admin ready at ${result.adminEmail}. Sign in, then change that password.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
