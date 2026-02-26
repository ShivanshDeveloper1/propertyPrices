"use client";
import React from "react";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <main className=" bg-gradient-to-b from-[#0a0a0f] via-[#0c1a2b] to-[#0a0a0f] ">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center gap-6 flex-col text-center px-4"
      >
        {/* Trust Badge */}
        <motion.div
          animate={{
            borderColor: [
              "rgba(226, 232, 240, 1)",
              "rgba(96, 165, 250, 1)",
              "rgba(226, 232, 240, 1)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="border border-slate-200 px-3 py-1 text-gray-300 flex items-center gap-2 rounded-full shadow-sm text-xs sm:text-sm"
        >
          <BadgeCheck size={16} strokeWidth={2.5} className="text-blue-600" />
          <p className="font-medium">Trusted by 1,000,000+ professionals</p>
        </motion.div>

        {/* Main Heading */}
        <motion.p
          variants={itemVariants}
          className="font-bold text-3xl sm:text-5xl md:text-7xl max-w-5xl text-gray-300 leading-snug sm:leading-tight"
        >
          Level Up Your Property Game – Real Estate Freedom Starts with Just One
          Plot
        </motion.p>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 max-w-md sm:max-w-xl text-white sm:text-lg"
        >
         Practical tips on how to invest in properties and earn a good amount of money
        </motion.p>

        {/* Stars */}
        <motion.div variants={itemVariants} className="flex items-center gap-1">
          <span className="text-gray-300 text-lg sm:text-xl">★★★★★</span>
        </motion.div>
      </motion.section>

      {/* Blog Card Section */}
     
    </main>
  );
};

export default HomePage;
