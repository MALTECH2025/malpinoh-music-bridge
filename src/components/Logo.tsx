
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

  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}
    >
      <div className="flex items-center gap-1 text-brand-purple">
        <Music size={iconSize[size]} />
        <MusicWave isPlaying={true} className="h-4" />
      </div>
      <span className="bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
        MalpinohDistro
      </span>
    </Link>
  );
};

export default Logo;
