"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, RefreshCw, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { useVerification } from "../VerificationContext";

const Step3Facial = () => {
  const {
    validationErrors,
    showCamera,
    selfieImage,
    setShowCamera,
    webcamRef,
    capture,
    retakeSelfie,
    setCurrentStep,
    nextStep,
  } = useVerification();

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">Facial Verification</h2>
        <p className="text-muted-foreground">
          Take a selfie for identity verification
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {!showCamera && !selfieImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <Button
                type="button"
                size="lg"
                className={`px-8 py-6 ${
                  validationErrors.selfie ? "border-2 border-red-500" : ""
                }`}
                onClick={() => setShowCamera(true)}
              >
                {validationErrors.selfie ? (
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                ) : (
                  <Camera className="mr-2 h-5 w-5" />
                )}
                Take a Selfie
              </Button>
            </motion.div>
          )}

          {showCamera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-lg overflow-hidden border-2 border-border">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full"
                  videoConstraints={{
                    facingMode: "user",
                    width: 640,
                    height: 480,
                  }}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  size="lg"
                  className="px-8"
                  onClick={capture}
                >
                  Capture Photo
                </Button>
              </div>
            </motion.div>
          )}

          {selfieImage && !showCamera && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="rounded-lg overflow-hidden border-2 border-green-500">
                <img
                  src={selfieImage}
                  alt="Captured selfie"
                  className="w-full"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={retakeSelfie}
                  className="mr-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        <Button type="button" onClick={nextStep} disabled={!selfieImage}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default Step3Facial;
