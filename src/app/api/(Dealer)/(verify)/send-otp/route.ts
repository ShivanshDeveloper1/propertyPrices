import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    // Check if env variables are actually loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.OTP_SECRET) {
      console.error("Missing Environment Variables!");
      return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Create a 5-minute expiration timestamp
    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;

    // 2. Create a secure hash of the email, OTP, and expiration
    const data = `${email}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", process.env.OTP_SECRET).update(data).digest("hex");

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      html: `<div style="font-family: sans-serif; padding: 20px;">
               <h2>Reset Your Password</h2>
               <p>Your 6-digit code is: <b style="font-size: 24px; color: #2563eb;">${otp}</b></p>
               <p>This code expires in 5 minutes.</p>
             </div>`,
    });

    return NextResponse.json({ success: true, hashPayload: `${hash}.${expires}` });
  } catch (error) {
    // THIS IS THE MOST IMPORTANT PART: Log the error to your terminal!
    console.error("🔥 SEND OTP ERROR:", error); 
    
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Failed to send email." 
    }, { status: 500 });
  }
}