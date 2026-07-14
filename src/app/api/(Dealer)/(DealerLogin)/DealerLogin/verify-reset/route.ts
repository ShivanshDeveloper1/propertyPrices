import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Dealers } from "@/models/Dealer/dealer";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    // 1. Parse JSON body (since frontend sends JSON.stringify)
    const { email, otp, hashPayload, newPassword } = await req.json();

    // 2. Validate the Hash payload
    if (!hashPayload) {
      return NextResponse.json({ message: "Missing authorization" }, { status: 400 });
    }
    
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

    // 3. Process Password Update
    await connectDB();

    // Find the existing dealer
    const existingUser = await Dealers.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "No account found with this email." }, { status: 404 });
    }

    if (!newPassword) {
      return NextResponse.json({ message: "New password is required" }, { status: 400 });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    existingUser.password = hashedPassword;
    await existingUser.save(); 
    
    // Alternatively, you can use: 
    // await Dealers.updateOne({ email }, { $set: { password: hashedPassword } });

    // 4. Return Success
    // Since your frontend redirects to login after a successful reset, we don't need to set a JWT cookie here.
    return NextResponse.json({ 
      success: true, 
      message: "Password reset successful." 
    });
    
  } catch (error) {
    console.error("🔥 VERIFY OTP ERROR:", error); 
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}