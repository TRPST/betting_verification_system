"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Clock,
  CheckCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState({
    identity: false,
    document: false,
    facial: false,
    final: false, // Add state for final verification
  });
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleStartVerification = () => {
    setIsNavigating(true);
    router.push("/verification");
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <section
          className="relative py-20 px-4 sm:px-6 lg:px-8"
          style={{ paddingBottom: 300 }}
        >
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
                Automated Account Verification
              </h1>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Fast, secure, and compliant identity verification for South
                African betting platforms. Get verified in minutes, not days.
              </p>

              {/* Mobile CTA Button - Only visible on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 sm:hidden"
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg"
                  onClick={handleStartVerification}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Verification
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Features Grid */}
              <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-card rounded-lg shadow-lg"
                >
                  <Shield className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold">Secure Process</h3>
                  <p className="mt-2 text-muted-foreground">
                    Bank-grade security protocols protecting your personal
                    information
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-card rounded-lg shadow-lg"
                >
                  <Clock className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Quick Verification
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Get verified in minutes with our automated system
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-card rounded-lg shadow-lg"
                >
                  <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Fully Compliant
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Meets all South African regulatory requirements
                  </p>
                </motion.div>
              </div>

              {/* Desktop CTA Button - Hidden on mobile */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 hidden sm:block"
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg"
                  onClick={handleStartVerification}
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Verification
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
