"use client";
import { ArrowRight, Mail, Loader2, X, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const Page = () => {
  const router = useRouter(); 
  const inputRef = useRef(null);
  
  // -- State Management --
  const [preview, setPreview] = useState(null);
  const [hashPayload, setHashPayload] = useState(""); 
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); 
  const [status, setStatus] = useState("idle"); 
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [savedFormData, setSavedFormData] = useState(null);
  const [emailDisplay, setEmailDisplay] = useState("");
  const [phoneError, setPhoneError] = useState(false); // State for phone validation

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  // Step 1: Send OTP
  const handleForm = async (e) => {
    e.preventDefault();
    setPhoneError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const phone = formData.get("phone");

    // Phone validation check
    if (!phone || phone.trim() === "") {
      setPhoneError(true);
      return;
    }
    
    setSavedFormData(formData);
    setEmailDisplay(email);
    setStatus("loading");

    try {
      const res = await fetch('/api/send-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
  
      if (res.ok) {
        setHashPayload(data.hashPayload);
        setShowOtpModal(true);
        setStatus("idle");
      } else {
        alert(data.message || "Failed to send OTP");
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Something went wrong. Please try again.");
    }
  };

// Step 2: Verify OTP & Register
const verifyOtp = async () => {
  if (!otp || otp.length < 6) return;
  setIsVerifying(true);

  try {
    savedFormData.append("otp", otp);
    savedFormData.set("hashPayload", hashPayload);

    const res = await fetch('/api/verify-otp', {
      method: "POST",
      body: savedFormData 
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Save name, email, AND phone directly into localStorage
      if (data.user) {
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userPhone", data.user.phone); 
      }

      setShowOtpModal(false);
      setShowSuccess(true); 
      
      setTimeout(() => {
        router.push('/admin/UploadProp');
      }, 2000);

    } else {
      alert(data.message || "Invalid OTP");
    }
  } catch (error) {
    console.error("Verification error:", error);
    alert("Something went wrong during verification.");
  } finally {
    setIsVerifying(false);
  }
};
  return (
    <>
      <main className="relative w-full min-h-screen">
        {/* Background Image */}
        <Image
          src="/AgentPage.jpeg"
          alt="Background"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content Layout Wrapper */}
        <div className="relative z-20 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12 min-h-screen max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-12">
          
          {/* LEFT SIDE */}
          <div className="text-center lg:text-left text-white max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-2xl">
              Best Property Clients Available
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-200">
              Get genuine buyers and sellers for your real estate business.
            </p>
          </div>

          {/* RIGHT SIDE: FORM */}
          <form
            onSubmit={handleForm}
            className="w-full max-w-md rounded-xl flex flex-col gap-4 p-6 sm:p-8 bg-white border border-t-blue-600 border-t-4 shadow-2xl"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black">
                Register as a Broker Free
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Already have an account?{" "}
                <Link href="/AgentLogin" className="text-blue-600 hover:underline font-semibold">
                  Login
                </Link> 
              </p>
            </div>

            {/* Profile Photo Area (Optional) */}
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full border border-dotted border-black mx-auto cursor-pointer overflow-hidden relative"
                onClick={() => inputRef.current.click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-xs font-bold text-black bg-gray-50">
                    <span className="text-lg">+</span>
                    <span className="text-[10px] font-normal text-gray-500">Optional</span>
                  </div>
                )}
              </div>
            </div>

            <input
              type="file"
              name="image" 
              ref={inputRef}
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />

            <input
              type="text"
              name="name"
              required
              placeholder="Enter Your Name"
              className="placeholder:text-gray-600 text-black rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 transition-colors"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Enter Your Email"
              className="placeholder:text-gray-600 text-black rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 transition-colors"
            />
            
            <input
              type="password"
              name="password"
              required
              placeholder="Create a Password"
              className="placeholder:text-gray-600 text-black rounded-xl border border-gray-300 p-3 outline-none focus:border-blue-500 transition-colors"
            />

            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="phone" 
                placeholder="Enter Your Phone Number"
                className={`placeholder:text-gray-600 text-black rounded-xl border p-3 outline-none transition-colors focus:border-blue-500 ${
                  phoneError ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {phoneError && (
                <span className="text-xs text-red-600 font-semibold px-1">
                  Phone number is required!
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {/* Hidden fixed Input for Backend */}
              <input type="hidden" name="city" value="Saharanpur" />
              
              {/* Disabled Display Input box so user sees it but cannot modify it */}
              <div className="bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 p-3 flex-1 select-none flex items-center text-sm">
                Saharanpur (Fixed)
              </div>
              
              <input
                type="text"
                name="area"
                required
                placeholder="Area"
                className="placeholder:text-gray-600 text-black font-bold min-w-0 rounded-xl border border-gray-300 p-3 flex-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              className="bg-blue-600 text-white font-bold p-4 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex justify-center items-center gap-2"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <><Loader2 className="animate-spin w-5 h-5" /> Sending OTP...</>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Info Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <Image
              src="/man.avif"
              width={500}
              height={600}
              alt="Dealer"
              className="rounded-3xl object-cover w-full h-[500px]"
            />
          </div>

          <div className="flex-1">
            <span className="text-green-600 font-semibold uppercase tracking-widest">
              Trusted Brokers
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight">
              Dealers That Earn Lakhs In The City
            </h2>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              Connect with genuine buyers and sellers in your city and grow your property business faster than ever.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <p className="text-zinc-700">Verified property leads</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <p className="text-zinc-700">Personalized dealer support</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <p className="text-zinc-700">High-quality local clients</p>
              </div>
            </div>

            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-10 bg-green-600 hover:bg-green-700 transition px-8 py-4 rounded-xl text-white font-semibold"
            >
              Become A Broker
            </button>
          </div>
        </div>
      </section>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in duration-300 relative">
            
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Check your email</h2>
              <p className="text-sm text-slate-500 mt-3 px-2 leading-relaxed">
                We've sent a 6-digit verification code to <br/>
                <span className="font-bold text-slate-800">{emailDisplay}</span>
              </p>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="w-full text-center text-4xl tracking-[0.5em] font-black border-2 border-slate-100 bg-slate-50 p-5 rounded-2xl focus:border-blue-500 focus:ring-0 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-300"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
              />

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowOtpModal(false)}
                  disabled={isVerifying}
                  className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={verifyOtp}
                  disabled={isVerifying || otp.length < 6}
                  className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-70 disabled:shadow-none"
                >
                  {isVerifying ? <Loader2 className="animate-spin w-5 h-5" /> : "Verify Code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show success */}
      {showSuccess && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Registration Successful!</h2>
            <p className="text-slate-500 mt-3 mb-6">Your account has been created. Redirecting you to the dashboard...</p>
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        </div>
      )}
    </>
  );
};

export default Page;