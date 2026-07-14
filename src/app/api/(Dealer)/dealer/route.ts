import { connectDB } from '@/lib/mongodb';
import { Dealers } from '@/models/Dealer/dealer'; // Corrected import to match your schema export
import { NextResponse } from 'next/server';
import { uploadCloudinary } from "@/lib/cloudinary/cloudinary";// Adjust this path to where your Cloudinary function is
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    // 1. Get exact fields sent from frontend
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const city = formData.get('city');
    const area = formData.get('area');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const imageFile = formData.get('image');

    // 2. Validation
    if (!name || !email || !password || !city) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 3. Check if exists
    const existingAgent = await Dealers.findOne({ email });
    if (existingAgent) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    // 4. Handle Image Upload to Cloudinary FIRST
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadCloudinary(imageFile); // Returns the secure_url
    }

    // 5. Hash Password for Security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save to MongoDB
    await Dealers.create({
      name,
      email,
      password: hashedPassword,
      city,
      area,
      phone,
      bio,
      image: imageUrl // Save the Cloudinary URL here
    });

    return NextResponse.json({ 
      message: "Dealer registered successfully!",
      success: true 
    }, { status: 201 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}