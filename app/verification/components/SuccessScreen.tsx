"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SuccessScreen = () => {
  const router = useRouter();

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        <CheckCircle className="h-14 w-14 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-primary mb-4">
        Verification Complete!
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Your account has been successfully verified. You can now access all
        features of our platform.
      </p>
      <Button
        size="lg"
        className="w-full max-w-xs"
        onClick={() => router.push("/")}
      >
        Done
      </Button>
    </motion.div>
  );
};

export default SuccessScreen;
