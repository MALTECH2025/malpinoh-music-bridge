
import { Music } from "lucide-react";
import { Link } from "react-router-dom";
import MusicWave from "./MusicWave";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const Logo = ({ size = "medium", className = "" }: LogoProps) => {
  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  const iconSizes = {
    small: 24,
    medium: 32,
    large: 48,
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}
    >
      <img 
        src="/lovable-uploads/73d53c0c-7084-4da6-b01e-36e78e3ad480.png" 
        alt="MalpinohDistro Logo" 
        className={`w-${iconSizes[size] === 24 ? "6" : iconSizes[size] === 32 ? "8" : "12"} h-${iconSizes[size] === 24 ? "6" : iconSizes[size] === 32 ? "8" : "12"}`}
      />
      <span className="bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
        MalpinohDistro
      </span>
    </Link>
  );
};

export default Logo;
