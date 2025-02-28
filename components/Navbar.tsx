"use client";

import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname === "/admin";
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAdminNavigation = () => {
    if (isAdmin) return;

    setIsNavigating(true);
    router.push("/admin");

    // Reset the state after a short delay to handle quick navigation back
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-primary">VerifyMe</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Button
              variant={isAdmin ? "default" : "ghost"}
              size="sm"
              onClick={handleAdminNavigation}
              disabled={isNavigating}
            >
              {isNavigating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-5 w-5 mr-2" />
                  Admin
                </>
              )}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
