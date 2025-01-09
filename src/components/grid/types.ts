export interface PixelData {
  imageUrl?: string;
  link?: string;
  owner?: string;
}

export interface PixelGridProps {
  onPixelSold: () => void;
  onBuyPixelsClick: () => void;
}