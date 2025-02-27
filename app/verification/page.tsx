"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Loader2, 
  Camera, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  FileText,
  User,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Webcam from "react-webcam";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ReactCanvasConfetti from "react-canvas-confetti";

const formSchema = z.object({
  idNumber: z
    .string()
    .length(13, "South African ID numbers must be 13 digits")
    .regex(/^\d+$/, "ID number must contain only digits"),
});

export default function Verification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    id?: boolean;
    selfie?: boolean;
  }>({});
  const webcamRef = useRef<Webcam | null>(null);
  const confettiRef = useRef<any>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
    },
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setSelfieImage(imageSrc);
      setShowCamera(false);
      setValidationErrors((prev) => ({ ...prev, selfie: false }));
    }
  }, [webcamRef]);

  const retakeSelfie = () => {
    setSelfieImage(null);
    setShowCamera(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setValidationErrors((prev) => ({ ...prev, id: false }));
  };

  const fireConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current({
        spread: 70,
        startVelocity: 30,
        particleCount: 100,
        origin: { y: 0.6 },
      });
    }
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      const isValid = form.formState.isValid;
      if (!isValid) {
        form.trigger("idNumber");
      }
      return isValid;
    } else if (step === 2) {
      const isFileValid = !!file;
      setValidationErrors((prev) => ({ ...prev, id: !isFileValid }));
      if (!isFileValid) {
        toast.error("Please upload your ID document");
      }
      return isFileValid;
    } else if (step === 3) {
      const isSelfieValid = !!selfieImage;
      setValidationErrors((prev) => ({ ...prev, selfie: !isSelfieValid }));
      if (!isSelfieValid) {
        toast.error("Please take a selfie for verification");
      }
      return isSelfieValid;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const submitVerification = async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsVerifying(true);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idNumber: form.getValues("idNumber"),
          fileName: file?.name,
          selfieImage,
        }),
      });

      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Final face verification step
      const faceResponse = await fetch("/api/face-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selfieImage,
        }),
      });

      setIsVerifying(false);
      setIsSuccess(true);
      fireConfetti();
    } catch (error) {
      setIsVerifying(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const steps = [
    { title: "Identity Verification", icon: User },
    { title: "Document Upload", icon: FileText },
    { title: "Facial Verification", icon: Camera },
    { title: "Final Verification", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Account Verification</h1>
          <p className="text-muted-foreground mt-2">
            Complete your account verification in just a few steps to start betting
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center w-full max-w-2xl justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index + 1 < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index + 1 === currentStep 
                        ? 'border-2 border-primary bg-background text-primary' 
                        : 'border-2 border-muted bg-muted/20 text-muted-foreground'
                  }`}
                >
                  {index + 1 < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                <span className={`text-sm mt-2 ${
                  index + 1 === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`h-[2px] w-24 mt-4 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <>
                {/* Step 1: Identity Information */}
                {currentStep === 1 && (
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
                      <form className="space-y-6">
                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>South African ID Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your 13-digit ID number" {...field} />
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
                          onClick={nextStep}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {/* Step 2: Document Upload */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold">Document Upload</h2>
                      <p className="text-muted-foreground">Upload your ID document or passport</p>
                    </div>

                    <div className="space-y-4">
                      <div 
                        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                          validationErrors.id 
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/10' 
                            : file ? 'border-green-500 bg-green-50 dark:bg-green-950/10' : 'border-border'
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
                          <span className={`text-lg font-medium ${
                            validationErrors.id 
                              ? 'text-red-500' 
                              : file ? 'text-green-500' : 'text-primary'
                          }`}>
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
                        <Button
                          type="button"
                          onClick={nextStep}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Facial Verification */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold">Facial Verification</h2>
                      <p className="text-muted-foreground">Take a selfie for identity verification</p>
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
                              className={`px-8 py-6 ${validationErrors.selfie ? 'border-2 border-red-500' : ''}`}
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
                                  height: 480
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
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!selfieImage}
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Final Verification */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold">Final Verification</h2>
                      <p className="text-muted-foreground">We're verifying your information with relevant authorities</p>
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
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Document:</span>
                            <span className="font-medium">{file?.name}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Facial Verification:</span>
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
                          <Button
                            type="button"
                            onClick={submitVerification}
                          >
                            Submit for Verification
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </>
            ) : (
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
                  Your account has been successfully verified. You can now access all features of our platform.
                </p>
                <Button
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={() => router.push("/")}
                >
                  Done
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}