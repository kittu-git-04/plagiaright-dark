import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, FilePlus2, RefreshCw, Edit, Download, LineChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import DetailedAnalysis from './DetailedAnalysis';
import { generatePdfReport } from '@/utils/reportGenerator';

const TextChecker = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | {
    score: number;
    matches: Array<{
      text: string;
      confidence: number;
      source?: string;
    }>;
    originalContent?: Array<{
      text: string;
      originalityPercent: number;
    }>;
  }>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  
  const { toast } = useToast();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (result) setResult(null);
  };

  const simulateCheck = () => {
    if (!text.trim()) {
      toast({
        title: "No text to check",
        description: "Please enter some text before checking for plagiarism.",
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
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsChecking(false);
            // Generate mock result
            const score = Math.floor(Math.random() * 30); // 0-30% plagiarism
            const matches = score > 0 ? generateMockMatches(text) : [];
            const originalContent = generateMockOriginalContent(text, matches);
            
            setResult({
              score,
              matches,
              originalContent
            });
            
            toast({
              title: "Analysis complete",
              description: `Found ${score}% potentially plagiarized content and ${100-score}% original content.`,
              variant: score > 20 ? "destructive" : "default",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const generateMockMatches = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    if (sentences.length === 0) return [];
    
    const numberOfMatches = Math.min(Math.ceil(sentences.length * 0.3), 3);
    const matches = [];
    
    const usedIndices = new Set();
    for (let i = 0; i < numberOfMatches; i++) {
      let index;
      do {
        index = Math.floor(Math.random() * sentences.length);
      } while (usedIndices.has(index) && usedIndices.size < sentences.length);
      
      usedIndices.add(index);
      
      matches.push({
        text: sentences[index].trim(),
        confidence: Math.floor(Math.random() * 50) + 50,
        source: `example${i + 1}.com/content-${Math.floor(Math.random() * 1000)}`
      });
    }
    
    return matches;
  };

  const generateMockOriginalContent = (text: string, matches: Array<{text: string, confidence: number, source?: string}>) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length === 0) return [];
    
    const matchTextSet = new Set(matches.map(match => match.text));
    const originalContent = [];
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length > 0 && !matchTextSet.has(trimmedSentence)) {
        originalContent.push({
          text: trimmedSentence,
          originalityPercent: Math.floor(Math.random() * 20) + 80 // 80-99% originality
        });
      }
    }
    
    return originalContent;
  };

  const resetCheck = () => {
    setText('');
    setResult(null);
  };

  const handleViewDetailedAnalysis = () => {
    if (result) {
      setShowDetailedAnalysis(true);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    
    toast({
      title: "Generating report",
      description: "Preparing your plagiarism report for download...",
    });
    
    try {
      const pdfUrl = await generatePdfReport(result, 'text');
      
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = "plagiarism-analysis-report.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Report downloaded",
        description: "Your plagiarism analysis report has been successfully downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error generating report",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="glass-card animate-fade-in">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Check Text for Plagiarism</h2>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your text here to check for plagiarism..."
              className="min-h-[200px] bg-background/50"
              value={text}
              onChange={handleTextChange}
              disabled={isChecking}
            />
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={simulateCheck} 
                disabled={isChecking} 
                className="flex-1 sm:flex-none"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check for Plagiarism
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetCheck} 
                disabled={isChecking}
                className="flex-1 sm:flex-none"
              >
                <FilePlus2 className="mr-2 h-4 w-4" />
                New Check
              </Button>
            </div>
            
            {isChecking && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning content...</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {result && (
              <div className="mt-6 space-y-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Content Analysis Results</h3>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.score < 10 
                        ? 'bg-green-500/20 text-green-400' 
                        : result.score < 20 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.score}% Plagiarized
                    </div>
                    <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                      {100 - result.score}% Original
                    </div>
                  </div>
                </div>
                
                {/* Tabs for Plagiarized vs Original Content */}
                <div className="mt-6">
                  <div className="flex space-x-2 border-b border-border mb-4">
                    <button 
                      className="py-2 px-4 font-medium focus:outline-none relative text-destructive"
                      onClick={() => document.getElementById('text-plagiarized')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Plagiarized Content
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-destructive"></span>
                    </button>
                    <button 
                      className="py-2 px-4 font-medium focus:outline-none relative text-green-400"
                      onClick={() => document.getElementById('text-original')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Original Content
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400"></span>
                    </button>
                  </div>
                </div>
                
                {/* Plagiarized Content */}
                <div id="text-plagiarized" className="space-y-4">
                  <h4 className="text-sm font-medium text-destructive">Plagiarized Content:</h4>
                  
                  {result.matches.length > 0 ? (
                    <div className="space-y-4">
                      {result.matches.map((match, i) => (
                        <Card key={i} className="bg-secondary/30 border border-border/50">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Matched Text:</p>
                                <p className="text-sm text-muted-foreground">&quot;{match.text}&quot;</p>
                                
                                {match.source && (
                                  <p className="text-xs text-accent mt-2">
                                    Possible source: {match.source}
                                  </p>
                                )}
                              </div>
                              <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                                match.confidence < 70 
                                  ? 'bg-yellow-500/20 text-yellow-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {match.confidence}% match
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-green-500/10 border border-green-500/30">
                      <CardContent className="p-4">
                        <p className="text-green-400">
                          No plagiarism detected! Your content appears to be original.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Original Content */}
                <div id="text-original" className="space-y-4">
                  <h4 className="text-sm font-medium text-green-400">Original Content:</h4>
                  
                  {result.originalContent && result.originalContent.length > 0 ? (
                    <div className="space-y-4">
                      {result.originalContent.map((content, i) => (
                        <Card key={i} className="bg-secondary/30 border border-green-500/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Original Text:</p>
                                <p className="text-sm text-muted-foreground">&quot;{content.text}&quot;</p>
                              </div>
                              <div className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400">
                                {content.originalityPercent}% original
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-red-500/10 border border-red-500/30">
                      <CardContent className="p-4">
                        <p className="text-red-400">
                          No original content detected! Your text appears to be entirely plagiarized.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                <div className="pt-4 flex gap-3 flex-wrap">
                  <Button 
                    className="flex-1" 
                    onClick={handleDownloadReport}
                    disabled={!result}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                  <Button 
                    className="flex-1" 
                    variant="outline" 
                    onClick={handleViewDetailedAnalysis}
                    disabled={!result}
                  >
                    <LineChart className="mr-2 h-4 w-4" />
                    View Detailed Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Detailed Analysis Dialog */}
      <DetailedAnalysis 
        open={showDetailedAnalysis} 
        onClose={() => setShowDetailedAnalysis(false)} 
        result={result} 
        type="text"
      />
    </div>
  );
};

export default TextChecker;
