import { useState, useRef, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import PurchaseModal from './PurchaseModal';
import { calculatePixelPrice } from '../utils/pixelPricing';
import GridChunk from './grid/GridChunk';
import { PixelData, PixelGridProps } from './grid/types';
import { websocketService } from '../services/websocketService';

const GRID_SIZE = 1000;
const BLOCK_SIZE = 10;
const CHUNK_SIZE = 100;

const PixelGrid = ({ onPixelSold, onBuyPixelsClick }: PixelGridProps) => {
  const [takenPixels, setTakenPixels] = useState<Map<number, PixelData>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPixelIndex, setSelectedPixelIndex] = useState<number | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isSelecting, setIsSelecting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [visibleChunks, setVisibleChunks] = useState<number[]>([]);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    websocketService.connect();

    // Subscribe to pixel updates
    const unsubscribe = websocketService.subscribe(message => {
      if (message.type === 'pixelUpdate') {
        setTakenPixels(prev => {
          const newMap = new Map(prev);
          newMap.set(message.data.index, message.data.pixelData);
          return newMap;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const calculateVisibleChunks = () => {
      if (!gridRef.current) return;
      const grid = gridRef.current;
      const rect = grid.getBoundingClientRect();
      const chunks: number[] = [];
      
      const startChunkX = Math.floor(grid.scrollLeft / CHUNK_SIZE);
      const startChunkY = Math.floor(grid.scrollTop / CHUNK_SIZE);
      const endChunkX = Math.ceil((grid.scrollLeft + rect.width) / CHUNK_SIZE);
      const endChunkY = Math.ceil((grid.scrollTop + rect.height) / CHUNK_SIZE);

      for (let y = startChunkY; y < endChunkY; y++) {
        for (let x = startChunkX; x < endChunkX; x++) {
          if (x < GRID_SIZE / CHUNK_SIZE && y < GRID_SIZE / CHUNK_SIZE) {
            chunks.push(y * (GRID_SIZE / CHUNK_SIZE) + x);
          }
        }
      }
      setVisibleChunks(chunks);
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateVisibleChunks);
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('scroll', handleScroll);
      calculateVisibleChunks();
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

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

  const handlePixelClick = (index: number) => {
    if (!isSelecting) {
      const blockStartX = Math.floor((index % GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
      const blockStartY = Math.floor(Math.floor(index / GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
      const blockStartIndex = blockStartY * GRID_SIZE + blockStartX;
      
      const pixelData = takenPixels.get(blockStartIndex);
      if (pixelData?.link) {
        window.open(pixelData.link, '_blank');
        return;
      }
    }

    const blockStartX = Math.floor((index % GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
    const blockStartY = Math.floor(Math.floor(index / GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
    const blockStartIndex = blockStartY * GRID_SIZE + blockStartX;

    if (!isBlockAvailable(blockStartIndex)) {
      toast({
        title: "Block already taken",
        description: "This block has already been purchased.",
        variant: "destructive",
      });
      return;
    }

    const price = calculatePixelPrice(blockStartIndex, { width: GRID_SIZE, height: GRID_SIZE });
    setCurrentPrice(price);
    setSelectedPixelIndex(blockStartIndex);
    setIsModalOpen(true);
    setIsSelecting(false);
  };

  useEffect(() => {
    if (onBuyPixelsClick) {
      setIsSelecting(true);
      toast({
        title: "Select a block",
        description: "Click on a 10x10 block to purchase it",
      });
    }
  }, [onBuyPixelsClick]);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        ref={gridRef}
        className="pixel-grid relative w-full aspect-square"
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#fff',
          border: '1px solid rgba(153, 69, 255, 0.3)',
          boxShadow: '0 0 20px rgba(153, 69, 255, 0.1)'
        }}
      >
        <div 
          className="absolute"
          style={{
            width: `${GRID_SIZE}px`,
            height: `${GRID_SIZE}px`,
            transform: `scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {visibleChunks.map(chunkIndex => {
            const chunkStartX = (chunkIndex % (GRID_SIZE / CHUNK_SIZE)) * CHUNK_SIZE;
            const chunkStartY = Math.floor(chunkIndex / (GRID_SIZE / CHUNK_SIZE)) * CHUNK_SIZE;
            
            return (
              <GridChunk
                key={chunkIndex}
                chunkIndex={chunkIndex}
                chunkStartX={chunkStartX}
                chunkStartY={chunkStartY}
                GRID_SIZE={GRID_SIZE}
                CHUNK_SIZE={CHUNK_SIZE}
                BLOCK_SIZE={BLOCK_SIZE}
                takenPixels={takenPixels}
                isSelecting={isSelecting}
                handlePixelClick={handlePixelClick}
              />
            );
          })}
        </div>
      </div>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsSelecting(false);
        }}
        pixelSize={BLOCK_SIZE}
        price={currentPrice}
        selectedPixelIndex={selectedPixelIndex}
        onSelectPixels={() => setIsSelecting(true)}
        takenPixels={takenPixels}
      />
    </div>
  );
};

export default PixelGrid;