// app/api/dealer/[id]/route.ts
import { connectDB } from '@/lib/mongodb';
import { Dealers } from '@/models/Dealer/dealer';
import { NextResponse } from 'next/server';

// 1. Update params type to Promise
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();

    // 2. Await the params here as well
    const { id } = await params;

    // 3. Use the awaited 'id'
    const dealer = await Dealers.findById(id);

    if (!dealer) {
      return NextResponse.json({ message: "Dealer not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      dealer, 
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error("API Error fetching single dealer:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}