import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Dealers } from "@/models/Dealer/dealer";
import bcrypt from "bcryptjs";
import { uploadCloudinary } from "@/lib/cloudinary/cloudinary";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { revalidatePath } from "next/cache";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get("email");
    const otp = formData.get("otp");
    const hashPayload = formData.get("hashPayload");

    // 1. Validate the Hash
    if (!hashPayload) return NextResponse.json({ message: "Missing authorization" }, { status: 400 });
    
    const [clientHash, expires] = hashPayload.split(".");
    
    if (Date.now() > parseInt(expires)) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    const data = `${email}.${otp}.${expires}`;
    
    if (!process.env.OTP_SECRET) {
      throw new Error("Server configuration error: OTP_SECRET is missing.");
    }

    const expectedHash = crypto.createHmac("sha256", process.env.OTP_SECRET).update(data).digest("hex");

    if (clientHash !== expectedHash) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // 2. Process Registration
    await connectDB();

    const existingUser = await Dealers.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "A user with this email already exists." }, { status: 400 });
    }

    const password = formData.get("password");
    if (!password) {
      return NextResponse.json({ message: "Password is required" }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // FIX: Clean execution path checking if file is present and populated
    const imageFile = formData.get("image");
    let imageUrl = "";
    
    if (imageFile && imageFile !== "null" && typeof imageFile !== "string" && imageFile.size > 0) {
      try {
        imageUrl = await uploadCloudinary(imageFile);
      } catch (uploadErr) {
         throw new Error("Failed to upload image to Cloudinary: " + uploadErr.message);
      }
    }

    const rawName = formData.get("name") || "dealer";
    const baseSlug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const randomHex = crypto.randomBytes(3).toString("hex");
    const finalSlug = `${baseSlug}-${randomHex}`;

    // Force City value to Saharanpur as fallback protection
    const submittedCity = formData.get("city") || "Saharanpur";

    const user = await Dealers.create({
      name: rawName,
      email,
      slug: finalSlug,
      password: hashedPassword,
      city: submittedCity,
      area: formData.get("area"),
      phone: formData.get("phone"),
      bio: formData.get("bio"),
      image: imageUrl, // Safe empty string if skipped
      isVerified: true,
    });

    const token = jwt.sign(
      {
        id: user._id.toString(), 
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: "Signup successful",
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
    
  } catch (error) {
    console.error("🔥 VERIFY OTP ERROR:", error); 
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}