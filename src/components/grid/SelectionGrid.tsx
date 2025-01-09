import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PixelData } from './types';

interface SelectionGridProps {
  takenPixels: Map<number, PixelData>;
  onSelectionConfirm: (selectedBlocks: number[]) => void;
  onClose: () => void;
}

const GRID_SIZE = 1000;
const BLOCK_SIZE = 10;

const SelectionGrid = ({ takenPixels, onSelectionConfirm, onClose }: SelectionGridProps) => {
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const totalCost = selectedBlocks.length * 0.1; // 0.1 SOL per block

  const isBlockAvailable = (startIndex: number): boolean => {
    const startX = startIndex % GRID_SIZE;
    const startY = Math.floor(startIndex / GRID_SIZE);

    for (let y = 0; y < BLOCK_SIZE; y++) {
      for (let x = 0; x < BLOCK_SIZE; x++) {
        const pixelIndex = (startY + y) * GRID_SIZE + (startX + x);
        if (takenPixels.has(pixelIndex)) return false;
      }
    }
    return true;
  };

  const handleBlockClick = (blockStartIndex: number) => {
    if (!isBlockAvailable(blockStartIndex)) {
      toast({
        title: "Block already taken",
        description: "This block has already been purchased.",
        variant: "destructive",
      });
      return;
    }

    setSelectedBlocks(prev => {
      if (prev.includes(blockStartIndex)) {
        return prev.filter(b => b !== blockStartIndex);
      }
      return [...prev, blockStartIndex];
    });
  };

  const clearSelection = () => {
    setSelectedBlocks([]);
    toast({
      title: "Selection cleared",
      description: "All blocks have been deselected",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Label className="text-white/90 font-pixel text-[10px]">Selected Blocks: {selectedBlocks.length}</Label>
          <p className="text-white/70 font-pixel text-[8px]">Total Cost: {totalCost} SOL</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          className="bg-transparent border border-solana-purple/20 text-white/90 hover:bg-solana-purple/20 font-pixel text-[8px]"
        >
          Clear Selection
        </Button>
      </div>

      <div 
        className="pixel-grid relative w-full aspect-square overflow-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1px)`,
          gap: 0,
          maxHeight: '60vh'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const blockStartX = Math.floor((index % GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
          const blockStartY = Math.floor(Math.floor(index / GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
          const blockStartIndex = blockStartY * GRID_SIZE + blockStartX;
          const isStart = index === blockStartIndex;
          const isSelected = selectedBlocks.includes(blockStartIndex);
          const pixelData = takenPixels.get(blockStartIndex);

          return (
            <div
              key={index}
              className={`pixel ${pixelData ? 'taken' : ''} ${isStart ? 'block-start' : ''} ${
                isSelected ? 'selecting' : ''
              }`}
              onClick={() => isStart && handleBlockClick(blockStartIndex)}
              style={{
                backgroundImage: pixelData?.imageUrl ? `url(${pixelData.imageUrl})` : 'none',
                backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
                backgroundPosition: `${-(index % BLOCK_SIZE)}px ${-(Math.floor((index % (GRID_SIZE * BLOCK_SIZE)) / GRID_SIZE))}px`,
              }}
            />
          );
        })}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="bg-transparent border border-solana-purple/20 text-white/90 hover:bg-solana-purple/20 font-pixel text-[8px]"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (selectedBlocks.length === 0) {
              toast({
                title: "No blocks selected",
                description: "Please select at least one block to continue",
                variant: "destructive",
              });
              return;
            }
            onSelectionConfirm(selectedBlocks);
          }}
          className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px]"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default SelectionGrid;