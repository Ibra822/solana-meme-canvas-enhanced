import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LinkInputStepProps {
  onLinkSubmit: (link: string) => void;
  onNext: () => void;
  imagePreviewUrl: string | null;
}

const LinkInputStep = ({ onLinkSubmit, onNext, imagePreviewUrl }: LinkInputStepProps) => {
  const [link, setLink] = useState('');

  const validateAndSubmitLink = () => {
    try {
      const url = new URL(link);
      if (!url.protocol.startsWith('http')) {
        throw new Error('URL must start with http:// or https://');
      }
      onLinkSubmit(link);
      onNext();
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="link" className="text-white/90 font-pixel text-[8px] flex items-center gap-2">
          <Link className="w-3 h-3" />
          Enter Your Link
        </Label>
        <Input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://your-website.com"
          className="bg-[#2D243F]/50 border-solana-purple/20 text-[8px] font-pixel h-8"
        />
      </div>

      {imagePreviewUrl && (
        <div className="mt-4">
          <Label className="text-white/90 font-pixel text-[8px] mb-2">Preview:</Label>
          <div className="border border-solana-purple/20 rounded-lg p-2">
            <img 
              src={imagePreviewUrl} 
              alt="Preview" 
              className="max-w-full h-auto mb-2"
            />
            {link && (
              <p className="text-[8px] font-pixel text-white/70 break-all">
                Link: {link}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Button
          onClick={validateAndSubmitLink}
          disabled={!link}
          className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LinkInputStep;