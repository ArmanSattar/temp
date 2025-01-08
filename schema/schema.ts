import { z } from 'zod'

export const contactFormSchema = z.object({
  contractAddress: z
    .string()
    .min(32, { message: 'Invalid Solana contract address' })
    .max(44, { message: 'Invalid Solana contract address' }),
  amount: z
    .string()
    .transform((val) => (val === "" ? undefined : Number(val)))
    .pipe(
      z.number()
        .positive({ message: 'Amount must be a positive number' })
        .optional()
    )
});

