
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ImageUpload from "@/components/upload/ImageUpload";
import ResultsDisplay from "@/components/results/ResultsDisplay";
import HowItWorks from "@/components/info/HowItWorks";
import { detectSets } from "@/services/api";
import { toast } from "sonner";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface SetCard {
  Count: number;
  Color: string;
  Fill: string;
  Shape: string;
  Coordinates: number[];
}

interface SetInfo {
  set_indices: number[];
  cards: SetCard[];
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [detectedSets, setDetectedSets] = useState<SetInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleImageSelected = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      toast.info("Processing image...", {
        description: "This may take a few moments."
      });
      
      const result = await detectSets(file);
      
      setResultImage(result.resultImage);
      setDetectedSets(result.sets);
      setActiveTab("results");
      
      if (result.sets.length > 0) {
        toast.success(`Found ${result.sets.length} SET${result.sets.length > 1 ? "s" : ""}!`);
      } else {
        toast.info("No SETs found in this image.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setError(error instanceof Error ? error.message : "We couldn't process your image. Please try again with a clearer photo.");
      toast.error("Failed to process image", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResultImage(null);
    setDetectedSets([]);
    setActiveTab("upload");
    setError(null);
  };

  return (
    <Layout>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4 py-5 md:py-6"
      >
        <motion.div 
          className="text-center mb-5 md:mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 sf-pro-display">
            SET Game Detector
          </h1>
          <p className="text-muted-foreground mb-3 max-w-lg mx-auto sf-pro-text text-xs md:text-sm">
            Upload a photo of your SET game layout
          </p>
        </motion.div>
        
        {error && (
          <Alert variant="destructive" className="mb-5 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReset} 
                className="self-end flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="max-w-5xl mx-auto">
          {activeTab === "upload" ? (
            <div className="flex flex-col gap-6 md:gap-12">
              <div className="max-w-md mx-auto w-full">
                <ImageUpload 
                  onImageSelected={handleImageSelected}
                  isProcessing={isProcessing}
                />
              </div>
              
              <div className="mt-6 md:mt-8 w-full">
                <HowItWorks />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-7">
                <ResultsDisplay
                  resultImage={resultImage}
                  sets={detectedSets}
                  onReset={handleReset}
                />
              </div>
              
              <div className="md:col-span-5 mt-3 md:mt-0">
                <HowItWorks />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default Index;
