"use client";

import * as React from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { toast } from "sonner";

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axios";
import { sendPlatformFee } from "@/actions/sendPlatformFee";
import { Sparkles } from "lucide-react";
import AnimatedGradientText from "../ui/animated-gradient-text";

export function ContactForm({ className }: React.ComponentProps<typeof Card>) {
  const { connection } = useConnection();
  const { signTransaction, publicKey, connected } = useWallet();
  const { setVisible: setModalVisible } = useWalletModal();
  const snapshotFee = 0.003;

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!connected) {
        setModalVisible(true);
        return;
      }

      if (!publicKey) {
        toast.error("No wallet found. Please connect your wallet.");
        return;
      }

      const contractAddress = formData.get("contractAddress") as string;
      const amount = formData.get("amount") as string;

      // Validate contract address
      if (
        !contractAddress ||
        contractAddress.length < 32 ||
        contractAddress.length > 44
      ) {
        toast.error("Invalid contract address");
        return;
      }

      try {
        // Validate if it's a valid Solana address
        new PublicKey(contractAddress);
      } catch (error) {
        toast.error("Invalid Solana contract address");
        return;
      }

      // Get token decimals
      try {
        const tokenDecimals = await connection.getTokenSupply(
          new PublicKey(contractAddress)
        );
        const { decimals } = tokenDecimals.value;

        // Send platform fee
        const signature = await sendPlatformFee(
          connection,
          signTransaction!,
          publicKey,
          snapshotFee,
          "EWsRotF6uHjeTj9LW3qWjxxDwq8C8FrocQfLFG7oU5Ao"
        );

        if (!signature) {
          toast.error("Failed to send platform fee. Please try again.");
          return;
        }

        // Submit snapshot data
        const snapshotData = {
          mintAddress: contractAddress,
          minimumBalance: amount || "0",
          decimals,
          signature,
        };

        await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_HOST_API_V2}/snapshot`,
          snapshotData
        );
        toast.success("Snapshot submitted successfully.");

        // Record transaction
        await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_HOST_API_V2}/transaction`,
          {
            signature,
            tokenAddress: contractAddress,
            amount: snapshotFee,
            userAddress: publicKey.toBase58(),
            transactionType: "snapshot",
          }
        );
      } catch (error) {
        toast.error("Invalid token address or network error");
        return;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process snapshot. Please try again.");
    }
  };

  return (
    <Card className={cn("w-full max-w-xl", className)}>
      <CardHeader>
        <CardTitle>Take Snapshot</CardTitle>
        <CardDescription>
          Connect your wallet and take a snapshot of any Solana contract.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="flex flex-col gap-6 px-6 py-4">
          <div className="group/field grid gap-2">
            <Label htmlFor="contractAddress">
              Contract Address <span aria-hidden="true">*</span>
            </Label>
            <Input
              id="contractAddress"
              name="contractAddress"
              placeholder="Enter Solana contract address"
              required
            />
          </div>

          <div className="group/field grid gap-2">
            <Label htmlFor="amount">
              Minimum Balance <span aria-hidden="true">(Optional)</span>
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="1"
              placeholder="50000"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 px-6 py-4">
          <Button type="submit" size="lg" className="w-full">
            {!connected ? "Connect Wallet" : "Take Snapshot"}
          </Button>
          <div className="flex justify-center">
            <AnimatedGradientText>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4" />
                Platform Fee: {snapshotFee} SOL
              </span>
            </AnimatedGradientText>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
