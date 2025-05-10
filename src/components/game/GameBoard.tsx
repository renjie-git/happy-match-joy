
import React, { useEffect, useState, useCallback } from "react";
import Block, { BlockType } from "./Block";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface GameBoardProps {
  rows?: number;
  columns?: number;
  onScoreUpdate: (points: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  rows = 8, 
  columns = 8,
  onScoreUpdate
}) => {
  const { toast } = useToast();
  const [board, setBoard] = useState<BlockType[][]>([]);
  const [selectedBlock, setSelectedBlock] = useState<{ row: number; col: number } | null>(null);
  const [matchedBlocks, setMatchedBlocks] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const blockTypes: BlockType[] = ["red", "blue", "green", "yellow", "purple", "pink"];
  
  const initializeBoard = useCallback(() => {
    const newBoard: BlockType[][] = [];
    
    // Generate initial random board
    for (let i = 0; i < rows; i++) {
      const row: BlockType[] = [];
      for (let j = 0; j < columns; j++) {
        const randomIndex = Math.floor(Math.random() * blockTypes.length);
        row.push(blockTypes[randomIndex]);
      }
      newBoard.push(row);
    }
    
    // Ensure no initial matches (simple implementation)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        // Check and fix horizontal matches of 3
        if (j >= 2) {
          if (newBoard[i][j] === newBoard[i][j-1] && newBoard[i][j] === newBoard[i][j-2]) {
            // Find a different block type
            let newType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            while (newType === newBoard[i][j]) {
              newType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            }
            newBoard[i][j] = newType;
          }
        }
        
        // Check and fix vertical matches of 3
        if (i >= 2) {
          if (newBoard[i][j] === newBoard[i-1][j] && newBoard[i][j] === newBoard[i-2][j]) {
            // Find a different block type
            let newType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            while (newType === newBoard[i][j]) {
              newType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
            }
            newBoard[i][j] = newType;
          }
        }
      }
    }
    
    setBoard(newBoard);
  }, [rows, columns, blockTypes]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const checkMatches = useCallback(() => {
    if (!board.length) return false;
    
    const matchedSet = new Set<string>();
    let hasMatches = false;

    // Check horizontal matches
    for (let i = 0; i < rows; i++) {
      let count = 1;
      let currentType = board[i][0];
      
      for (let j = 1; j < columns; j++) {
        if (board[i][j] === currentType) {
          count++;
        } else {
          if (count >= 3) {
            hasMatches = true;
            for (let k = j - count; k < j; k++) {
              matchedSet.add(`${i},${k}`);
            }
          }
          count = 1;
          currentType = board[i][j];
        }
      }
      
      if (count >= 3) {
        hasMatches = true;
        for (let k = columns - count; k < columns; k++) {
          matchedSet.add(`${i},${k}`);
        }
      }
    }
    
    // Check vertical matches
    for (let j = 0; j < columns; j++) {
      let count = 1;
      let currentType = board[0][j];
      
      for (let i = 1; i < rows; i++) {
        if (board[i][j] === currentType) {
          count++;
        } else {
          if (count >= 3) {
            hasMatches = true;
            for (let k = i - count; k < i; k++) {
              matchedSet.add(`${k},${j}`);
            }
          }
          count = 1;
          currentType = board[i][j];
        }
      }
      
      if (count >= 3) {
        hasMatches = true;
        for (let k = rows - count; k < rows; k++) {
          matchedSet.add(`${k},${j}`);
        }
      }
    }
    
    if (hasMatches) {
      setMatchedBlocks(matchedSet);
      // Calculate score - more matches = more points
      const points = matchedSet.size * 10;
      onScoreUpdate(points);
      
      if (matchedSet.size >= 5) {
        toast({
          title: "Great Match!",
          description: `You matched ${matchedSet.size} blocks! +${points} points`,
        });
      }
      
      // Schedule removal of matched blocks
      setTimeout(() => {
        removeMatchedBlocks(matchedSet);
      }, 600);
    }
    
    return hasMatches;
  }, [board, rows, columns, onScoreUpdate, toast]);

  const removeMatchedBlocks = useCallback((matchedSet: Set<string>) => {
    const newBoard = [...board];
    
    // For each column, process matches from bottom to top
    for (let j = 0; j < columns; j++) {
      // Count matches in this column
      const matchesInColumn: number[] = [];
      
      for (let i = 0; i < rows; i++) {
        if (matchedSet.has(`${i},${j}`)) {
          matchesInColumn.push(i);
        }
      }
      
      // Process from bottom to top
      for (let idx = matchesInColumn.length - 1; idx >= 0; idx--) {
        const matchedRow = matchesInColumn[idx];
        
        // Shift down all blocks above this match
        for (let i = matchedRow; i > 0; i--) {
          newBoard[i][j] = newBoard[i-1][j];
        }
        
        // Add new random block at the top
        const randomIndex = Math.floor(Math.random() * blockTypes.length);
        newBoard[0][j] = blockTypes[randomIndex];
      }
    }
    
    setBoard(newBoard);
    setMatchedBlocks(new Set());
    
    // Check for new matches after blocks have settled
    setTimeout(() => {
      const hasMatches = checkMatches();
      if (!hasMatches) {
        setIsProcessing(false);
      }
    }, 500);
  }, [board, blockTypes, columns, rows, checkMatches]);

  const swapBlocks = useCallback((row1: number, col1: number, row2: number, col2: number) => {
    const newBoard = [...board];
    [newBoard[row1][col1], newBoard[row2][col2]] = [newBoard[row2][col2], newBoard[row1][col1]];
    setBoard(newBoard);
  }, [board]);

  const handleBlockClick = (row: number, col: number) => {
    if (isProcessing) return;
    
    if (selectedBlock === null) {
      // First selection
      setSelectedBlock({ row, col });
    } else {
      // Second selection - check if adjacent
      const isAdjacent = 
        (Math.abs(selectedBlock.row - row) === 1 && selectedBlock.col === col) || 
        (Math.abs(selectedBlock.col - col) === 1 && selectedBlock.row === row);
      
      if (isAdjacent) {
        setIsProcessing(true);
        
        // Swap the blocks
        swapBlocks(selectedBlock.row, selectedBlock.col, row, col);
        
        // Check for matches after a brief delay to allow animation
        setTimeout(() => {
          const hasMatches = checkMatches();
          
          // If no matches, swap blocks back
          if (!hasMatches) {
            swapBlocks(row, col, selectedBlock.row, selectedBlock.col);
            setIsProcessing(false);
            
            toast({
              title: "Invalid Move",
              description: "That move didn't create a match!",
            });
          }
          
          setSelectedBlock(null);
        }, 300);
      } else {
        // Not adjacent, make this the new selection
        setSelectedBlock({ row, col });
      }
    }
  };

  const isMatched = (row: number, col: number) => {
    return matchedBlocks.has(`${row},${col}`);
  };

  return (
    <div 
      className={cn(
        "game-board",
        "grid-cols-" + columns,
        "grid-rows-" + rows
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {board.map((row, i) =>
        row.map((blockType, j) => (
          <Block
            key={`${i}-${j}`}
            type={blockType}
            selected={selectedBlock?.row === i && selectedBlock?.col === j}
            matched={isMatched(i, j)}
            onClick={() => handleBlockClick(i, j)}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;
