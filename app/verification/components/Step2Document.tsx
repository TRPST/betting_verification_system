"use client";

import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerification } from "../VerificationContext";

const Step2Document = () => {
  const { validationErrors, file, handleFileChange, setCurrentStep, nextStep } =
    useVerification();

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Document Upload</h2>
        <p className="text-muted-foreground">
          Upload your ID document or passport
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
            validationErrors.id
              ? "border-red-500 bg-red-50 dark:bg-red-950/10"
              : file
              ? "border-green-500 bg-green-50 dark:bg-green-950/10"
              : "border-border"
          }`}
        >
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            {validationErrors.id ? (
              <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
            ) : file ? (
              <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            )}
            <span
              className={`text-lg font-medium ${
                validationErrors.id
                  ? "text-red-500"
                  : file
                  ? "text-green-500"
                  : "text-primary"
              }`}
            >
              {file ? "Document Uploaded" : "Click to upload"}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {file ? file.name : "Smart ID, ID Book or Passport"}
            </span>
          </label>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep(1)}
          >
            Back
          </Button>
          <Button type="button" onClick={nextStep}>
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step2Document;
