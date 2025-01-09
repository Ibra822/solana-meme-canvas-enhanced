import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "@/components/ui/use-toast";
import { Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";

const WalletButton: FC = () => {
  const { disconnect, connecting, connected } = useWallet();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "You've been disconnected from your wallet.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <Button
      variant="default"
      className="wallet-adapter-button bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px] h-8"
      onClick={handleDisconnect}
      disabled={connecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {connecting ? 'Connecting...' : 'Disconnect'}
    </Button>
  );
};

export default WalletButton;