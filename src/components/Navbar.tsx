
import React from 'react';
import { Search, FileText, Shield } from "lucide-react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 border-b border-border/40 backdrop-blur-sm bg-background/80 fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-gradient">PlagiaRight</span>
        </div>
        
        <div className="hidden md:flex space-x-6">
          <NavLink href="/" icon={<Search className="mr-2 h-4 w-4" />} text="Check Text" />
          <NavLink href="/document" icon={<FileText className="mr-2 h-4 w-4" />} text="Check Document" />
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}

const NavLink = ({ href, icon, text }: NavLinkProps) => (
  <Link to={href} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
