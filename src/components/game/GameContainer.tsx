
import React, { useEffect, useState } from "react";
import GameBoard from "./GameBoard";
import ScorePanel from "./ScorePanel";

const GameContainer: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  
  // Thresholds for level ups
  const levelThresholds = [0, 500, 1000, 2000, 3500, 5000, 7000];
  
  // Check for level up
  useEffect(() => {
    for (let i = levelThresholds.length - 1; i >= 0; i--) {
      if (score >= levelThresholds[i] && level < i + 1) {
        setLevel(i + 1);
        break;
      }
    }
  }, [score, level]);
  
  const handleScoreUpdate = (points: number) => {
    setScore(prevScore => prevScore + points);
  };
  
  const handleRestart = () => {
    setScore(0);
    setLevel(1);
  };
  
  return (
    <div className="game-container max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-4 text-purple-800 drop-shadow-sm">快乐消消乐</h1>
      <p className="text-center mb-8 text-muted-foreground">Match 3 or more blocks to score points!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <GameBoard 
            rows={8} 
            columns={8} 
            onScoreUpdate={handleScoreUpdate} 
          />
        </div>
        <div>
          <ScorePanel 
            score={score} 
            level={level} 
            onRestart={handleRestart} 
          />
          
          <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">How to Play</h3>
            <ul className="text-sm space-y-2">
              <li>👉 Click a block to select it</li>
              <li>👉 Click an adjacent block to swap</li>
              <li>👉 Match 3 or more blocks of the same color</li>
              <li>👉 Score points and level up!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameContainer;
