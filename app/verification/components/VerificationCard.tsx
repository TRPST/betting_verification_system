"use client";

import { AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useVerification } from "../VerificationContext";
import Step1Identity from "./Step1Identity";
import Step2Document from "./Step2Document";
import Step3Facial from "./Step3Facial";
import Step4Final from "./Step4Final";
import SuccessScreen from "./SuccessScreen";

const VerificationCard = () => {
  const { currentStep, isSuccess } = useVerification();

  return (
    <Card className="p-8">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <>
            {currentStep === 1 && <Step1Identity />}
            {currentStep === 2 && <Step2Document />}
            {currentStep === 3 && <Step3Facial />}
            {currentStep === 4 && <Step4Final />}
          </>
        ) : (
          <SuccessScreen />
        )}
      </AnimatePresence>
    </Card>
  );
};

export default VerificationCard;
