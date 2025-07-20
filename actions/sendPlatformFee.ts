import type { Connection } from "@solana/web3.js";

import {
  PublicKey,
  VersionedTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionMessage,
  Transaction,
} from "@solana/web3.js";

import { addComputeBudget } from "./priorityFeesIx";

export async function sendPlatformFee(
  connection: Connection,
  signTransaction: (
    transaction: VersionedTransaction
  ) => Promise<VersionedTransaction>,
  publicKey: PublicKey,
  amountSol: number,
  recipientAddress: string
): Promise<string | null> {
  if (!publicKey || !signTransaction) {
    console.error("Wallet not connected or signTransaction not provided");
    return null;
  }

  try {
    // Create the transfer instruction
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: new PublicKey(recipientAddress),
      lamports: amountSol * LAMPORTS_PER_SOL,
    });

    // Get latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create instructions array and add compute budget
    let instructions = [transferInstruction];

    const tempTransaction = addComputeBudget(new Transaction());
    const computeBudgetInstructions = tempTransaction.instructions;
    instructions = [...computeBudgetInstructions, ...instructions];

    // Create the message
    const messageV0 = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: blockhash,
      instructions: instructions,
    }).compileToV0Message();

    // Create versioned transaction
    const versionedTransaction = new VersionedTransaction(messageV0);

    // Sign the transaction
    const signedTransaction = await signTransaction(versionedTransaction);

    // Send the transaction
    const signature = await connection.sendTransaction(signedTransaction);
    return signature;
  } catch (error) {
    console.error("Failed to send platform fee:", error);
    return null;
  }
}
