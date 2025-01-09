import { PixelData } from './types';

interface GridChunkProps {
  chunkIndex: number;
  chunkStartX: number;
  chunkStartY: number;
  GRID_SIZE: number;
  CHUNK_SIZE: number;
  BLOCK_SIZE: number;
  takenPixels: Map<number, PixelData>;
  isSelecting: boolean;
  handlePixelClick: (index: number) => void;
}

const GridChunk = ({
  chunkIndex,
  chunkStartX,
  chunkStartY,
  GRID_SIZE,
  CHUNK_SIZE,
  BLOCK_SIZE,
  takenPixels,
  isSelecting,
  handlePixelClick,
}: GridChunkProps) => {
  const pixels = [];

  for (let y = 0; y < CHUNK_SIZE; y++) {
    for (let x = 0; x < CHUNK_SIZE; x++) {
      const pixelIndex = (chunkStartY + y) * GRID_SIZE + (chunkStartX + x);
      const blockStartX = Math.floor((pixelIndex % GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
      const blockStartY = Math.floor(Math.floor(pixelIndex / GRID_SIZE) / BLOCK_SIZE) * BLOCK_SIZE;
      const blockStartIndex = blockStartY * GRID_SIZE + blockStartX;
      
      const pixelData = takenPixels.get(blockStartIndex);
      const isBlockStart = pixelIndex === blockStartIndex;
      
      pixels.push(
        <div
          key={pixelIndex}
          className={`pixel ${takenPixels.has(blockStartIndex) ? 'taken' : ''} ${
            isBlockStart ? 'block-start' : ''
          } ${isSelecting ? 'selecting' : ''}`}
          onClick={() => handlePixelClick(pixelIndex)}
          style={{
            backgroundImage: pixelData?.imageUrl ? `url(${pixelData.imageUrl})` : 'none',
            backgroundSize: `${BLOCK_SIZE}px ${BLOCK_SIZE}px`,
            backgroundPosition: `${-(pixelIndex % BLOCK_SIZE)}px ${-(Math.floor((pixelIndex % (GRID_SIZE * BLOCK_SIZE)) / GRID_SIZE))}px`,
            border: 'none'
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${(chunkStartX / GRID_SIZE) * 100}%`,
        top: `${(chunkStartY / GRID_SIZE) * 100}%`,
        width: `${(CHUNK_SIZE / GRID_SIZE) * 100}%`,
        height: `${(CHUNK_SIZE / GRID_SIZE) * 100}%`,
        display: 'grid',
        gridTemplateColumns: `repeat(${CHUNK_SIZE}, 1fr)`,
        gap: 0
      }}
    >
      {pixels}
    </div>
  );
};

export default GridChunk;