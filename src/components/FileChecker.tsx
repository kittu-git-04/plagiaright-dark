
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, File, RefreshCw, X, FileText, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

const FileChecker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | {
    score: number;
    matches: number;
    fileName: string;
  }>(null);
  
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
      setResult(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const simulateCheck = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file before checking for plagiarism.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    setProgress(0);
    setResult(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsChecking(false);
            // Generate mock result
            const score = Math.floor(Math.random() * 30); // 0-30% plagiarism
            setResult({
              score,
              matches: score > 0 ? Math.ceil(Math.random() * 5) : 0,
              fileName: file.name
            });
          }, 800);
          return 100;
        }
        return newProgress;
      });
    }, 600);
  };

  const resetCheck = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="glass-card animate-fade-in">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Document for Plagiarism Check</h2>
          
          <div className="space-y-4">
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                }`}
              >
                <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Supports PDF, DOC, DOCX, and TXT files (max. 10MB)
                </p>
                <label>
                  <Button variant="outline" type="button">
                    <FileText className="mr-2 h-4 w-4" />
                    Browse Files
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <Card className="p-4 bg-secondary/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-background">
                      <File className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetCheck}
                    disabled={isChecking}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={simulateCheck} 
                disabled={!file || isChecking}
                className="flex-1 sm:flex-none"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Check for Plagiarism
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetCheck} 
                disabled={isChecking || !file}
                className="flex-1 sm:flex-none"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Upload New File
              </Button>
            </div>
            
            {isChecking && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analyzing document...</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {result && (
              <div className="mt-6 animate-scale-in">
                <Card className={`p-6 ${
                  result.score < 10 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : result.score < 20 
                      ? 'bg-yellow-500/10 border-yellow-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <h3 className="font-semibold text-lg mb-4">Plagiarism Check Results</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{result.fileName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Similarity Score:</span>
                      <span className={`font-medium ${
                        result.score < 10 
                          ? 'text-green-400' 
                          : result.score < 20 
                            ? 'text-yellow-400' 
                            : 'text-red-400'
                      }`}>{result.score}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Matched Sources:</span>
                      <span className="font-medium">{result.matches}</span>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full" variant="outline">
                        View Detailed Report
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileChecker;
