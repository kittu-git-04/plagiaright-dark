
import React from 'react';
import FileChecker from '@/components/FileChecker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Document = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 text-gradient">Document Plagiarism Checker</h1>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Upload your document to check for plagiarism against millions of academic papers, websites, and publications. 
            Our advanced AI technology provides accurate results to ensure your work is original.
          </p>
          
          <div className="py-4">
            <FileChecker />
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Academic Documents" 
              description="Check essays, dissertations, theses, and research papers for proper citation and originality."
            />
            <FeatureCard 
              title="Multiple Formats" 
              description="Support for PDF, DOCX, DOC, and TXT files to accommodate all your document needs."
            />
            <FeatureCard 
              title="Detailed Reports" 
              description="Get comprehensive reports with highlighted matching text and source identification."
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => (
  <div className="p-6 rounded-lg glass-card">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default Document;
