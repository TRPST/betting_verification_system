"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useVerification } from "../VerificationContext";
import { FileText } from "lucide-react";

const Step4Final = () => {
  const { isVerifying, form, file, setCurrentStep, submitVerification } =
    useVerification();

  // Function to truncate filename if it's too long
  const formatFileName = (fileName: string | undefined) => {
    if (!fileName) return "";

    // For mobile screens, truncate more aggressively
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const maxLength = isMobile ? 20 : 30;

    if (fileName.length <= maxLength) return fileName;

    const extension = fileName.split(".").pop() || "";
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."));

    return `${nameWithoutExt.substring(
      0,
      maxLength - extension.length - 3
    )}...${extension}`;
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Final Verification</h2>
        <p className="text-muted-foreground">
          We're verifying your information with relevant authorities
        </p>
      </div>

      {isVerifying ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-muted rounded-full"></div>
            <div className="w-20 h-20 border-4 border-t-primary rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="mt-6 text-lg font-medium">Verifying your identity...</p>
          <p className="text-muted-foreground">This may take a few moments</p>
        </div>
      ) : (
        <>
          <div className="bg-muted/20 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ID Number:</span>
              <span className="font-medium">{form.getValues("idNumber")}</span>
            </div>

            <div className="flex justify-between items-start sm:items-center">
              <span className="text-muted-foreground pt-1 sm:pt-0">
                Document:
              </span>
              <div className="flex items-center max-w-[60%] sm:max-w-[70%]">
                <FileText className="h-4 w-4 text-primary mr-1.5 flex-shrink-0 hidden sm:block" />
                <span className="font-medium text-right break-words">
                  {file ? formatFileName(file.name) : "No file uploaded"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Facial Verification:
              </span>
              <span className="font-medium text-green-500">Completed</span>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(3)}
            >
              Back
            </Button>
            <Button type="button" onClick={submitVerification}>
              Submit for Verification
            </Button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Step4Final;
