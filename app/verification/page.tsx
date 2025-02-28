"use client";

import { motion } from "framer-motion";
import ReactCanvasConfetti from "react-canvas-confetti";
import { VerificationProvider } from "./VerificationContext";
import VerificationHeader from "./components/VerificationHeader";
import ProgressSteps from "./components/ProgressSteps";
import VerificationCard from "./components/VerificationCard";

// Create a separate component for the confetti
const ConfettiCanvas = () => {
  const { confettiRef } = require("./VerificationContext").useVerification();

  return (
    <ReactCanvasConfetti
      ref={confettiRef}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    />
  );
};

export default function Verification() {
  return (
    <VerificationProvider>
      <div className="min-h-screen bg-background py-8 pb-10 px-3 sm:py-12 sm:px-6 lg:px-8">
        <ConfettiCanvas />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <VerificationHeader />
          <div className="px-1 sm:px-4">
            <ProgressSteps />
          </div>
          <VerificationCard />
        </motion.div>
      </div>
    </VerificationProvider>
  );
}
