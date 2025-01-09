import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { toast } from "@/hooks/use-toast";
import { websocketService } from '../../services/websocketService';

interface ConfirmationStepProps {
  selectedBlocks: number[];
  imagePreviewUrl: string | null;
  link: string;
  totalCost: number;
  onSuccess: (txHash: string) => void;
  recipientAddress: string;
}

const ConfirmationStep = ({
  selectedBlocks,
  imagePreviewUrl,
  link,
  totalCost,
  onSuccess,
  recipientAddress
}: ConfirmationStepProps) => {
  const { connected, publicKey, sendTransaction } = useWallet();

  const handlePayment = async () => {
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientAddress),
          lamports: totalCost * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      // Update pixels via WebSocket after successful payment
      selectedBlocks.forEach(blockIndex => {
        websocketService.updatePixel(blockIndex, {
          imageUrl: imagePreviewUrl || '',
          link,
          owner: publicKey.toString()
        });
      });

      toast({
        title: "Payment successful!",
        description: "Your pixels have been purchased successfully",
      });
      
      onSuccess(signature);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-white/90 font-pixel text-[8px]">Selected Blocks</Label>
          <p className="text-white/70 font-pixel text-[8px]">
            {selectedBlocks.length} blocks selected ({selectedBlocks.length * 100} pixels)
          </p>
        </div>

        {imagePreviewUrl && (
          <div>
            <Label className="text-white/90 font-pixel text-[8px]">Image Preview</Label>
            <div className="border border-solana-purple/20 rounded-lg p-2 mt-1">
              <img 
                src={imagePreviewUrl} 
                alt="Preview" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}

        <div>
          <Label className="text-white/90 font-pixel text-[8px]">Link</Label>
          <p className="text-white/70 font-pixel text-[8px] break-all">{link}</p>
        </div>

        <div>
          <Label className="text-white/90 font-pixel text-[8px]">Total Cost</Label>
          <p className="text-white font-pixel text-[12px] bg-gradient-to-r from-solana-purple to-solana-blue bg-clip-text text-transparent">
            {totalCost} SOL
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {!connected ? (
          <WalletMultiButton className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px] h-8" />
        ) : (
          <Button
            onClick={handlePayment}
            className="bg-gradient-to-r from-solana-purple to-solana-blue hover:opacity-90 text-white font-pixel text-[8px]"
          >
            Confirm & Pay
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConfirmationStep;