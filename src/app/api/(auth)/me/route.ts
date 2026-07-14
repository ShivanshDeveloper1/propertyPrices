import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET() {
  try {
    // 1. AWAIT the cookies() function!
    const cookieStore = await cookies(); 
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ authenticated: false });
    }

    // 3. Return user data
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.id,
        name: decoded.name || "",
        email: decoded.email || "",
        phone: decoded.phone || "",
      },
    });
  } catch (error) {
    console.error("JWT Verification Error in /api/me:", error.message);
    
    return NextResponse.json({
      authenticated: false,
    });
  }
}