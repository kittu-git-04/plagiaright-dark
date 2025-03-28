
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, File, RefreshCw, X, FileText, Check, PercentCircle } from "lucide-react";
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
    content?: string[];
    plagiarizedParts?: {
      text: string;
      source: string;
      matchPercent: number;
    }[];
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

  const simulateFileRead = async (file: File): Promise<string[]> => {
    // This would normally use a real file reading method based on file type
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate extracting content
        const paragraphs = [
          "The concept of artificial intelligence has evolved significantly over the past decades, transforming from theoretical discussions to practical applications.",
          "Machine learning algorithms now power many aspects of our daily lives, from recommendation systems to autonomous vehicles and natural language processing.",
          "The ethical implications of AI deployment continue to be debated among experts, with concerns about privacy, bias, and job displacement at the forefront.",
          "Despite these challenges, the potential benefits of responsibly developed AI technologies remain substantial across healthcare, climate science, and education."
        ];
        resolve(paragraphs);
      }, 1500);
    });
  };

  const simulateCheck = async () => {
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
    
    // Simulate content extraction
    const contentProgress = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 5, 40));
    }, 200);
    
    try {
      // Simulate file content reading
      const content = await simulateFileRead(file);
      
      clearInterval(contentProgress);
      setProgress(40);
      
      // Simulate plagiarism checking
      const checkProgress = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(checkProgress);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 300);
      
      // Simulate check delay with more realistic timing
      setTimeout(() => {
        clearInterval(checkProgress);
        setProgress(100);
        
        // Generate more detailed mock result
        setTimeout(() => {
          setIsChecking(false);
          
          // Generate a plagiarism score between 0 and 40%
          const score = Math.floor(Math.random() * 40);
          
          // Create plagiarized parts if the score is above 0
          const plagiarizedParts = score > 0 
            ? generatePlagiarizedParts(content, score) 
            : [];
          
          setResult({
            score,
            matches: plagiarizedParts.length,
            fileName: file.name,
            content,
            plagiarizedParts
          });
          
          toast({
            title: "Plagiarism check complete",
            description: `Analysis found ${score}% potentially plagiarized content.`,
            variant: score > 20 ? "destructive" : score > 10 ? "default" : "default",
          });
        }, 800);
      }, 3000);
    } catch (error) {
      clearInterval(contentProgress);
      setIsChecking(false);
      toast({
        title: "Error processing file",
        description: "There was an error reading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generatePlagiarizedParts = (content: string[], totalScore: number) => {
    if (totalScore === 0) return [];
    
    const parts = [];
    const numParts = Math.ceil(totalScore / 10);
    const usedIndices = new Set();
    
    for (let i = 0; i < numParts; i++) {
      let randomIndex;
      // Ensure we don't pick the same paragraph twice
      do {
        randomIndex = Math.floor(Math.random() * content.length);
      } while (usedIndices.has(randomIndex) && usedIndices.size < content.length);
      
      usedIndices.add(randomIndex);
      
      // Take a portion of the paragraph as the plagiarized part
      const text = content[randomIndex];
      const startPos = Math.floor(Math.random() * (text.length / 2));
      const endPos = startPos + Math.floor(Math.random() * (text.length - startPos - 10) + 10);
      const plagiarizedText = text.substring(startPos, endPos);
      
      // Create a random source
      const domains = ["academia.edu", "research.net", "scholar.org", "university.edu", "journal.com"];
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const source = `https://www.${randomDomain}/article-${Math.floor(Math.random() * 10000)}`;
      
      parts.push({
        text: plagiarizedText,
        source,
        matchPercent: Math.floor(Math.random() * 30) + 70 // 70-99% match
      });
    }
    
    return parts;
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
                  <span>
                    {progress < 40 
                      ? "Extracting content..." 
                      : progress < 95 
                        ? "Analyzing document..." 
                        : "Finalizing report..."}
                  </span>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Plagiarism Check Results</h3>
                    <div className="flex items-center mt-2 sm:mt-0">
                      <PercentCircle className={`h-5 w-5 mr-2 ${
                        result.score < 10 
                          ? 'text-green-400' 
                          : result.score < 20 
                            ? 'text-yellow-400' 
                            : 'text-red-400'
                      }`} />
                      <span className={`font-medium text-lg ${
                        result.score < 10 
                          ? 'text-green-400' 
                          : result.score < 20 
                            ? 'text-yellow-400' 
                            : 'text-red-400'
                      }`}>{result.score}% Plagiarized</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">File:</span>
                      <span className="font-medium">{result.fileName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Originality Score:</span>
                      <span className={`font-medium ${
                        result.score < 10 
                          ? 'text-green-400' 
                          : result.score < 20 
                            ? 'text-yellow-400' 
                            : 'text-red-400'
                      }`}>{100 - result.score}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Matched Sources:</span>
                      <span className="font-medium">{result.matches}</span>
                    </div>
                    
                    {result.plagiarizedParts && result.plagiarizedParts.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium">Potential Plagiarized Content:</h4>
                        {result.plagiarizedParts.map((part, idx) => (
                          <div key={idx} className="p-3 bg-secondary/50 rounded-md border border-border">
                            <p className="text-sm mb-2">"{part.text}"</p>
                            <div className="flex justify-between text-xs">
                              <a href={part.source} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                                {part.source}
                              </a>
                              <span className={part.matchPercent > 85 ? 'text-red-400' : 'text-yellow-400'}>
                                {part.matchPercent}% match
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-4 flex gap-3 flex-wrap">
                      <Button className="flex-1" variant={result.score > 10 ? "default" : "outline"}>
                        Download Full Report
                      </Button>
                      <Button className="flex-1" variant="outline">
                        View Detailed Analysis
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
