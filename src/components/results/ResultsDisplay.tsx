import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, RefreshCw, Eye, Sparkles, 
  ChevronDown, ChevronRight, ListFilter, X, 
  Camera, Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import SetCard from "./SetCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

interface ResultsDisplayProps {
  resultImage: string | null;
  sets: SetInfo[];
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultImage,
  sets,
  onReset,
}) => {
  const isMobile = useIsMobile();
  const [showSetDetails, setShowSetDetails] = useState(false);
  
  const downloadImage = () => {
    if (!resultImage) return;
    
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "set-detection-result.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="relative">
        <Card className="ios-card overflow-hidden">
          <CardHeader className="p-3 md:p-4 pb-0">
            <CardTitle className="text-base md:text-lg flex justify-between items-center sf-pro-display">
              <span className="flex items-center">
                <Eye className="h-4 w-4 text-primary mr-2" />
                Results
              </span>
              
              {sets.length > 0 && (
                <Badge className="bg-set-purple text-white border-0 rounded-full px-3 py-1 shadow-sm text-sm inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="sf-pro-display font-medium">{sets.length} {sets.length === 1 ? "SET" : "SETs"} detected</span>
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            {resultImage && (
              <div className="relative overflow-hidden">
                <img
                  src={resultImage}
                  alt="Detected sets"
                  className={`w-full h-auto object-contain max-h-[70vh] ${isMobile ? 'px-1 py-2' : ''}`}
                />
                
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    variant="secondary"
                    size={isMobile ? "sm" : "default"}
                    onClick={onReset}
                    className="gap-1 rounded-full bg-background/90 backdrop-blur-sm text-xs md:text-sm shadow-md"
                  >
                    <RefreshCw className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span className="sf-pro-text">New</span>
                  </Button>
                  
                  <Button
                    variant="default"
                    size={isMobile ? "sm" : "default"}
                    onClick={downloadImage}
                    className="gap-1 rounded-full bg-primary/90 backdrop-blur-sm text-xs md:text-sm shadow-md"
                  >
                    <Download className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span className="sf-pro-text">Save</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {sets.length > 0 && (
          <>
            {isMobile ? (
              // Mobile: Show only SET count badge in a more prominent position
              <div className="mt-4 px-2">
                <Card className="ios-card border-0 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-center">
                      <Badge 
                        className="bg-set-purple/95 text-white border-0 rounded-xl px-4 py-2 
                                text-sm shadow-md w-full justify-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span className="sf-pro-display font-medium">
                          {sets.length} {sets.length === 1 ? "SET" : "SETs"} detected
                        </span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Desktop: Button to show/hide SET details panel
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSetDetails(!showSetDetails)}
                  className="w-full py-3 mb-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 gap-2 ios-card"
                >
                  <Sparkles className="h-4 w-4 text-set-purple" />
                  <span>{showSetDetails ? "Hide" : "View"} SET Details</span>
                  {showSetDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                
                <AnimatePresence>
                  {showSetDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="ios-card border border-gray-100 shadow-sm hover:shadow-sm overflow-hidden">
                        <CardHeader className="p-3 md:p-4 pb-2 border-b border-gray-50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base md:text-lg sf-pro-display flex items-center">
                              <Sparkles className="h-4 w-4 text-set-purple mr-2" />
                              SET Details
                            </CardTitle>
                            
                            <Badge variant="outline" className="bg-set-purple/10 text-set-purple border-set-purple/20">
                              {sets.length} Set{sets.length > 1 ? "s" : ""}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 md:p-4 pt-3 relative">
                          <ScrollArea className="h-[340px]">
                            <div className="space-y-3 pr-2">
                              {sets.map((set, index) => (
                                <SetCard key={index} set={set} index={index} />
                              ))}
                            </div>
                            <ScrollBar />
                          </ScrollArea>
                          
                          {sets.length > 2 && (
                            <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent flex items-center justify-center">
                              <Badge variant="outline" className="bg-background text-xs flex items-center gap-1 shadow-sm pointer-events-auto">
                                <ChevronDown className="h-3 w-3" />
                                <span>Scroll to see more sets</span>
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
      
      {sets.length === 0 && resultImage && (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 shadow-sm w-full max-w-sm">
            <div className="text-orange-500 mb-2">
              <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.995 16H12.004" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-gray-700 sf-pro-text text-sm font-medium text-center">
              No SET cards detected
            </p>
            <p className="text-gray-500 sf-pro-text text-xs mt-1 text-center">
              Please try taking a clearer picture of your SET game board
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ChevronUp = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export default ResultsDisplay;
