
import React from 'react';
import { X, ExternalLink, PercentCircle, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DetailedAnalysisProps {
  open: boolean;
  onClose: () => void;
  result: {
    score: number;
    fileName?: string;
    content?: string[];
    // For file checker
    plagiarizedParts?: Array<{
      text: string;
      source: string;
      matchPercent: number;
    }>;
    // For text checker
    matches?: Array<{
      text: string;
      confidence: number;
      source?: string;
    }>;
    originalContent?: Array<{
      text: string;
      originalityPercent: number;
    }>;
  } | null;
  type: 'file' | 'text';
}

const DetailedAnalysis = ({ open, onClose, result, type }: DetailedAnalysisProps) => {
  if (!result) return null;

  const plagiarizedContent = type === 'file' 
    ? result.plagiarizedParts 
    : result.matches;

  const originalContent = result.originalContent;
  const originalityScore = 100 - (result.score || 0);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detailed Plagiarism Analysis</span>
            <Badge 
              variant={result.score < 10 ? "success" : result.score < 20 ? "warning" : "destructive"}
              className="ml-2"
            >
              {result.score}% Plagiarized
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {type === 'file' && result.fileName ? (
              <>Detailed analysis for "{result.fileName}"</>
            ) : (
              <>Detailed analysis of your text</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Originality Score" 
              value={`${originalityScore}%`} 
              icon={<Edit className="text-green-400" />}
              color="text-green-400"
            />
            <StatCard 
              title="Plagiarism Score" 
              value={`${result.score}%`} 
              icon={<PercentCircle />}
              color={result.score < 10 ? "text-green-400" : result.score < 20 ? "text-yellow-400" : "text-red-400"}
            />
            <StatCard 
              title="Matched Sources" 
              value={type === 'file' 
                ? (result.plagiarizedParts?.length || 0).toString() 
                : (result.matches?.length || 0).toString()} 
              icon={<ExternalLink />}
              color="text-blue-400"
            />
            <StatCard 
              title="Word Count" 
              value={countWords(result).toString()} 
              icon={<Edit />}
              color="text-foreground"
            />
          </div>

          <Separator />

          {/* Plagiarized Content */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-destructive">Plagiarized Content</h3>
            {plagiarizedContent && plagiarizedContent.length > 0 ? (
              <div className="space-y-4">
                {plagiarizedContent.map((item, idx) => (
                  <Card key={idx} className="border border-red-500/30 bg-red-500/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">Matched Text</h4>
                          <Badge variant="destructive">
                            {type === 'file' 
                              ? `${(item as any).matchPercent}% match` 
                              : `${(item as any).confidence}% match`}
                          </Badge>
                        </div>
                        <p className="text-sm px-3 py-2 bg-background/70 rounded-md">"{item.text}"</p>
                        {item.source && (
                          <div className="text-xs flex items-center text-muted-foreground">
                            <span className="font-medium mr-1">Source:</span> 
                            <a 
                              href={item.source.startsWith('http') ? item.source : `https://${item.source}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent hover:underline inline-flex items-center"
                            >
                              {item.source} <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-green-500/10 border border-green-500/30">
                <CardContent className="p-4">
                  <p className="text-green-400">No plagiarized content detected! Your content appears to be original.</p>
                </CardContent>
              </Card>
            )}
          </div>

          <Separator />

          {/* Original Content */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-green-400">Original Content</h3>
            {originalContent && originalContent.length > 0 ? (
              <div className="space-y-4">
                {originalContent.map((item, idx) => (
                  <Card key={idx} className="border border-green-500/30 bg-green-500/5">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold">Original Text</h4>
                          <Badge className="bg-green-500 hover:bg-green-600">
                            {item.originalityPercent}% original
                          </Badge>
                        </div>
                        <p className="text-sm px-3 py-2 bg-background/70 rounded-md">"{item.text}"</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-red-500/10 border border-red-500/30">
                <CardContent className="p-4">
                  <p className="text-red-400">No original content detected! Your text appears to be entirely plagiarized.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card>
    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
      <div className={`${color} p-2 rounded-full bg-background shadow-sm mb-2`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </CardContent>
  </Card>
);

const countWords = (result: DetailedAnalysisProps['result']) => {
  if (!result) return 0;
  
  let text = '';
  
  if (result.content && Array.isArray(result.content)) {
    text = result.content.join(' ');
  } else if (result.plagiarizedParts || result.matches) {
    const contentArray = (result.plagiarizedParts || result.matches || []) as any[];
    text = contentArray.map(item => item.text).join(' ');
    
    if (result.originalContent) {
      text += ' ' + result.originalContent.map(item => item.text).join(' ');
    }
  }
  
  return text.trim().split(/\s+/).length;
};

export default DetailedAnalysis;
