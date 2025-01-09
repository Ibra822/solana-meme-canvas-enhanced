interface GridDimensions {
  width: number;
  height: number;
}

export const calculatePixelPrice = (index: number, dimensions: GridDimensions): number => {
  const { width, height } = dimensions;
  const row = Math.floor(index / width);
  const col = index % width;

  // Define zone boundaries (as percentages)
  const centerStartX = width * 0.3;
  const centerEndX = width * 0.7;
  const centerStartY = height * 0.3;
  const centerEndY = height * 0.7;

  // Check which zone the pixel belongs to
  if (row >= centerStartY && row <= centerEndY && col >= centerStartX && col <= centerEndX) {
    return 1.0; // Central area
  } else if (row < height * 0.2) {
    return 0.7; // Top area
  } else if (col > width * 0.8) {
    return 0.5; // Right side
  } else if (col < width * 0.2) {
    return 0.3; // Left side
  } else {
    return 0.1; // Bottom area
  }
};