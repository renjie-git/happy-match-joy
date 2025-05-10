
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ScorePanelProps {
  score: number;
  level: number;
  onRestart: () => void;
}

const ScorePanel: React.FC<ScorePanelProps> = ({ score, level, onRestart }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-purple-600">Level {level}</h2>
            <p className="text-4xl font-bold text-purple-800">{score}</p>
            <p className="text-sm text-muted-foreground">points</p>
          </div>
          <Button 
            onClick={onRestart}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScorePanel;
