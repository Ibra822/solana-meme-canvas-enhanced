import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ImageUploadStepProps {
  onImageSelect: (file: File) => void;
  onNext: () => void;
  selectedBlocksCount: number;
}

const ImageUploadStep = ({ onImageSelect, onNext, selectedBlocksCount }: ImageUploadStepProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateAndSetImage = async (file: File) => {
    const img = new Image();
    
    img.onload = () => {
      const expectedWidth = Math.sqrt(selectedBlocksCount) * 10;
      const expectedHeight = expectedWidth;

      if (img.width !== expectedWidth || img.height !== expectedHeight) {
        toast({
          title: "Invalid Image Dimensions",
          description: `Image must be ${expectedWidth}x${expectedHeight} pixels for your selected blocks`,
          variant: "destructive",
        });
        return;
      }

      onImageSelect(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast({
        title: "Image Uploaded",
        description: "Your image has been successfully validated and uploaded",
      });
    };

    img.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load image. Please try another file.",
        variant: "destructive",
      });
    };

    img.src = URL.createObjectURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="image" className="text-white/90 font-pixel text-[8px] flex items-center gap-2">
          <Upload className="w-3 h-3" />
          Upload Your Image
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => e.target.files?.[0] && validateAndSetImage(e.target.files[0])}
          className="bg-[#2D243F]/50 border-solana-purple/20 text-[8px] font-pixel cursor-pointer file:cursor-pointer file:border-0 file:bg-solana-purple/20 file:text-white/90 file:font-pixel hover:file:bg-solana-purple/30 transition-colors h-8"
        />
      </div>

      {previewUrl && (
        <div className="mt-4">
          <Label className="text-white/90 font-pixel text-[8px] mb-2">Preview:</Label>
          <div className="border border-solana-purple/20 rounded-lg p-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={onNext}
          disabled={!previewUrl}
          className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadStep;