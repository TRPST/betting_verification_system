"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useVerification } from "../VerificationContext";
import { useState } from "react";

const Step1Identity = () => {
  const { form, nextStep } = useVerification();
  const [isLoading, setIsLoading] = useState(false);

  const handleNextStep = async () => {
    setIsLoading(true);
    // Trigger validation immediately
    const isValid = await form.trigger("idNumber");

    if (isValid) {
      nextStep();
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Identity Verification</h2>
        <p className="text-muted-foreground">Please enter your ID number</p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>South African ID Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your 13-digit ID number"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleNextStep();
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This should be your 13-digit South African ID number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            className="w-full"
            onClick={handleNextStep}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Continue"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default Step1Identity;
