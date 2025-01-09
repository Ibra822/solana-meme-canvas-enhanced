import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlockSelectorProps {
  selectedBlocks: number[];
  onBlockSelect: (blockIndex: number) => void;
  onClearSelection: () => void;
  totalCost: number;
  onNext: () => void;
}

const BlockSelector = ({ 
  selectedBlocks, 
  onBlockSelect, 
  onClearSelection, 
  totalCost,
  onNext 
}: BlockSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-pixel text-white/90">
          Total Cost: {totalCost.toFixed(2)} SOL
        </span>
        <Button
          onClick={onClearSelection}
          variant="outline"
          size="sm"
          className="bg-transparent border border-solana-purple/20 text-white/90 hover:bg-solana-purple/20 font-pixel text-[8px]"
        >
          <X className="w-3 h-3 mr-1" />
          Clear Selection
        </Button>
      </div>

      <div className="h-[500px] overflow-auto">
        {/* Grid content rendered by parent */}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          onClick={onNext}
          disabled={selectedBlocks.length === 0}
          className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default BlockSelector;