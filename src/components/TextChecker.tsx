
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, FilePlus2, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

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
  }>(null);
  
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
            setResult({
              score,
              matches: score > 0 ? generateMockMatches(text) : []
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

  const resetCheck = () => {
    setText('');
    setResult(null);
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
                  <h3 className="font-semibold text-lg">Plagiarism Check Results</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.score < 10 
                      ? 'bg-green-500/20 text-green-400' 
                      : result.score < 20 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {result.score}% Match
                  </div>
                </div>
                
                {result.matches.length > 0 ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      We found {result.matches.length} potential instance{result.matches.length !== 1 ? 's' : ''} of matching content:
                    </p>
                    
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextChecker;
