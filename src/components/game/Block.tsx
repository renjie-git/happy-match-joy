
import React from "react";
import { cn } from "@/lib/utils";
import { Apple, Banana, Cherry, Grape, Heart, CircleOff, Cookie } from "lucide-react";

export type BlockType = "red" | "blue" | "green" | "yellow" | "purple" | "pink";

const blockIcons = {
  "red": Heart,
  "blue": CircleOff,  // Replacing Lemon with CircleOff
  "green": Apple,
  "yellow": Banana,
  "purple": Grape,
  "pink": Cookie,     // Replacing Strawberry with Cookie
};

const blockColors = {
  "red": "bg-game-red text-white",
  "blue": "bg-game-blue text-white",
  "green": "bg-game-green text-white",
  "yellow": "bg-game-yellow text-white",
  "purple": "bg-game-purple text-white",
  "pink": "bg-game-pink text-white",
};

interface BlockProps {
  type: BlockType;
  selected?: boolean;
  matched?: boolean;
  onClick?: () => void;
}

const Block: React.FC<BlockProps> = ({ 
  type, 
  selected = false,
  matched = false,
  onClick 
}) => {
  const Icon = blockIcons[type];
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "block aspect-square flex items-center justify-center",
        blockColors[type],
        selected && "ring-4 ring-white ring-opacity-70 scale-110 z-10",
        matched && "animate-swirl"
      )}
    >
      <Icon size={24} className={cn("transition-transform", selected && "scale-110")} />
    </div>
  );
};

export default Block;
