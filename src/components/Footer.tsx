
import React from 'react';
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full py-8 px-6 border-t border-border/40 bg-background">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-gradient">PlagiaRight</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Advanced plagiarism detection for academic integrity, content creators, and professionals.
              Ensure your work is original with our powerful AI-driven tools.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} PlagiaRight. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-foreground">Product</h3>
            <ul className="space-y-2">
              <FooterLink text="Features" />
              <FooterLink text="Pricing" />
              <FooterLink text="API" />
              <FooterLink text="Integrations" />
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4 text-foreground">Resources</h3>
            <ul className="space-y-2">
              <FooterLink text="Documentation" />
              <FooterLink text="Blog" />
              <FooterLink text="Support" />
              <FooterLink text="Contact" />
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
      {text}
    </a>
  </li>
);

export default Footer;
