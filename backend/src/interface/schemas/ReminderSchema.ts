import { z } from 'zod'

export const ReminderSchema = z.object({
	name: z.string().min(2),
	archive: z.boolean(),
})
