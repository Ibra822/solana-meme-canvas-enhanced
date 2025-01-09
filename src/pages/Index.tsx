import { useState } from 'react';
import Stats from '../components/Stats';
import PixelGrid from '../components/PixelGrid';
import { Button } from '../components/ui/button';
import { Twitter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Index = () => {
  const [totalSold, setTotalSold] = useState(0);
  const totalPixels = 1000000;
  const [aboutOpen, setAboutOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleBuyPixelsClick = () => {
    setIsSelecting(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2D243F] overflow-auto">
      <div className="container mx-auto px-2 min-h-screen flex flex-col">
        <header className="py-1">
          <div className="flex items-center justify-between bg-[#1A1F2C] rounded-lg p-2 border border-solana-purple/20">
            {/* Left - Stats */}
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-solana-purple/20 to-solana-blue/20 rounded-lg border border-solana-purple/30">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-solana-blue"></span>
                  <span className="text-white font-pixel text-[8px]">1M pixels</span>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-solana-purple/20 to-solana-blue/20 rounded-lg border border-solana-purple/30">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-solana-purple"></span>
                  <span className="text-white font-pixel text-[8px]">0.1 SOL/px</span>
                </div>
              </div>
            </div>

            {/* Center - Site Name */}
            <h1 className="text-[16px] md:text-[20px] font-pixel bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent leading-relaxed text-center">
              The Million Solana Memepage
            </h1>

            {/* Right - Stats with Live Indicator */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute -top-1 -right-1 px-1 py-0.5 bg-[#ea384c] text-white text-[8px] font-pixel rounded animate-pulse">
                  LIVE
                </span>
                <div className="bg-[#2D243F]/50 rounded-lg border border-solana-purple/20 px-2 py-1">
                  <span className="text-white font-pixel text-[8px]">
                    {totalPixels - totalSold} Available
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="mt-1 bg-gradient-to-r from-solana-purple to-solana-blue p-[1px] rounded-lg">
            <div className="bg-[#1A1F2C] rounded-lg px-3 py-1 flex items-center justify-center gap-3">
              <Button 
                variant="ghost"
                size="sm"
                className="text-white hover:text-solana-blue font-pixel text-[10px] bg-[#1EAEDB] bg-opacity-20 border border-[#1EAEDB] hover:bg-[#1EAEDB]/30 transition-all h-8 px-6"
                onClick={() => setAboutOpen(true)}
              >
                About
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                className="text-white hover:text-solana-blue font-pixel text-[10px] bg-[#1EAEDB] bg-opacity-20 border border-[#1EAEDB] hover:bg-[#1EAEDB]/30 transition-all h-8 px-6 flex items-center gap-1"
                onClick={() => window.open('https://x.com/Abe_Ehidna', '_blank')}
              >
                <Twitter className="w-3 h-3" />
                Follow
              </Button>
            </div>
          </nav>
        </header>

        <div className="py-1">
          <Stats totalSold={totalSold} totalPixels={totalPixels} />
        </div>

        {/* Buy Pixels Button */}
        <div className="w-full max-w-[400px] mx-auto mb-6 mt-4">
          <Button 
            onClick={handleBuyPixelsClick}
            className="w-full btn-animated bg-gradient-to-r from-solana-purple via-[#B975FF] to-solana-blue hover:opacity-90 transition-all font-pixel text-white text-sm py-2 rounded-lg border border-solana-purple/20 shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            Buy Pixels
          </Button>
        </div>
        
        <div id="grid" className="flex-1">
          <PixelGrid 
            onPixelSold={() => setTotalSold(prev => prev + 1)} 
            onBuyPixelsClick={handleBuyPixelsClick}
          />
        </div>

        <div className="w-full max-w-[1000px] mx-auto mt-4 mb-2 py-2 px-4 bg-gradient-to-r from-[#1A1F2C] to-[#2D243F] rounded-lg border border-solana-purple/20">
          <p className="font-pixel text-[10px] text-center bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
            Own a piece of Solana history - One pixel at a time!
          </p>
          <p className="font-pixel text-[8px] text-center text-solana-purple/60 mt-1">
            Advertise your project on the first million-pixel canvas on Solana
          </p>
        </div>

        <footer className="text-center text-[#9b87f5] py-0.5">
          <p className="font-pixel text-[8px]">
            The Million Solana Memepage - A collaborative pixel art canvas for the Solana community. © 2024
          </p>
        </footer>

        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogContent className="bg-[#1A1F2C] border border-solana-purple/20 text-white font-pixel">
            <DialogHeader>
              <DialogTitle className="text-center text-[14px] bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent pb-4">
                About Solana Pixel Wall
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-[10px] leading-relaxed">
              <div>
                <h3 className="text-solana-blue mb-2">What is Solana Pixel Wall?</h3>
                <p>
                  A unique digital canvas of <span className="text-solana-purple">1,000,000 pixels</span> on the Solana blockchain. Reserve your spot, upload your image, and share your link with the world!
                </p>
              </div>

              <div>
                <h3 className="text-solana-blue mb-2">How to Buy Pixels:</h3>
                <ol className="space-y-4">
                  <li>
                    <strong className="text-solana-purple">1. Choose Your Block:</strong>
                    <ul className="mt-1 ml-4">
                      <li>- Pixels are sold in <span className="text-solana-purple">10x10 blocks</span> (100 pixels).</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-solana-purple">2. Prepare Your Image:</strong>
                    <ul className="mt-1 ml-4">
                      <li>- Upload a custom image sized exactly <span className="text-solana-purple">10x10 blocks</span> (100x100 pixels).</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-solana-purple">3. Add Your Link:</strong>
                    <ul className="mt-1 ml-4">
                      <li>- Insert a clickable link to your project, idea, or content.</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-solana-purple">4. Complete the Purchase:</strong>
                    <ul className="mt-1 ml-4">
                      <li>- Pay in SOL and provide the <span className="text-solana-purple">transaction hash</span> to finalize your block reservation.</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <p className="text-center text-solana-blue pt-4">
                Leave your mark on the Solana blockchain today!
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
