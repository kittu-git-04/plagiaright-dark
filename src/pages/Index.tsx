
import React from 'react';
import TextChecker from '@/components/TextChecker';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { FileText, Search, Shield, Award, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gradient leading-tight">
              Academic Integrity <br className="hidden sm:block" />Starts with Originality
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              PlagiaRight uses advanced AI technology to detect potential plagiarism and 
              ensure your work maintains the highest standards of originality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="text-md">
                <Search className="mr-2 h-5 w-5" />
                Check Your Text
              </Button>
              <Button size="lg" variant="outline" className="text-md" asChild>
                <Link to="/document">
                  <FileText className="mr-2 h-5 w-5" />
                  Upload Document
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-secondary/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Powerful Features for Content Originality</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Advanced Detection"
                description="Our technology scans billions of web pages, academic journals, and publications to ensure comprehensive plagiarism detection."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Fast Results"
                description="Get accurate results within seconds, allowing you to efficiently check and revise your work as needed."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Academic Standards"
                description="Ensure your work meets the highest academic standards with our advanced detection algorithms designed for scholarly content."
              />
            </div>
          </div>
        </section>
        
        {/* Text Checker Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Check Your Text</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Paste your text below to check for potential plagiarism. Our system will analyze your content 
              against millions of sources to ensure originality.
            </p>
            
            <TextChecker />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-8 rounded-lg glass-card text-center h-full flex flex-col items-center">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
