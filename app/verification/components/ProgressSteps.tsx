"use client";

import { CheckCircle } from "lucide-react";
import { User, FileText, Camera, Shield } from "lucide-react";
import { useVerification } from "../VerificationContext";

const steps = [
  { title: "Identity Verification", icon: User },
  { title: "Document Upload", icon: FileText },
  { title: "Facial Verification", icon: Camera },
  { title: "Final Verification", icon: Shield },
];

const ProgressSteps = () => {
  const { currentStep, isSuccess } = useVerification();

  return (
    <div className="mb-8 sm:mb-12">
      {/* Desktop view (horizontal steps) - hidden on mobile */}
      <div className="hidden sm:flex justify-center">
        <div className="flex items-center w-full max-w-2xl justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index + 1 < currentStep ||
                  (index + 1 === steps.length && isSuccess)
                    ? "bg-green-500 text-white"
                    : index + 1 === currentStep
                    ? "border-2 border-primary bg-background text-primary"
                    : "border-2 border-muted bg-muted/20 text-muted-foreground"
                }`}
              >
                {index + 1 < currentStep ||
                (index + 1 === steps.length && isSuccess) ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <step.icon className="h-6 w-6" />
                )}
              </div>
              <span
                className={`text-sm mt-2 ${
                  index + 1 === currentStep
                    ? "text-primary font-medium"
                    : index + 1 < currentStep ||
                      (index + 1 === steps.length && isSuccess)
                    ? "text-green-500 font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile view (vertical steps) - hidden on desktop */}
      <div className="sm:hidden">
        <div className="flex flex-col space-y-4 px-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg ${
                index + 1 === currentStep
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  index + 1 < currentStep ||
                  (index + 1 === steps.length && isSuccess)
                    ? "bg-green-500 text-white"
                    : index + 1 === currentStep
                    ? "border-2 border-primary bg-background text-primary"
                    : "border-2 border-muted bg-muted/20 text-muted-foreground"
                }`}
              >
                {index + 1 < currentStep ||
                (index + 1 === steps.length && isSuccess) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <span
                  className={`text-sm font-medium ${
                    index + 1 === currentStep
                      ? "text-primary"
                      : index + 1 < currentStep ||
                        (index + 1 === steps.length && isSuccess)
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {index + 1 === currentStep && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Step {index + 1} of {steps.length}
                  </div>
                )}
              </div>
              {(index + 1 < currentStep ||
                (index + 1 === steps.length && isSuccess)) && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
