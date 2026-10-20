import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { limited } from "@/lib/rate-limit";
import { User } from "@/models/User";
import { seedDatabase } from "@/server/seed";

export const dynamic = "force-dynamic";

export async function POST(request) {
  if (await limited("setup", 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }

  const token = process.env.SETUP_TOKEN;
  if (token && request.headers.get("x-setup-token") !== token) {
    return NextResponse.json({ error: "Setup token required." }, { status: 401 });
  }

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
    const known = error.message?.startsWith("ADMIN_PASSWORD");
    return NextResponse.json(
      { error: known ? error.message : "Setup failed. Check the server log." },
      { status: known ? 400 : 500 },
    );
  }
}
