import { Mailer } from 'domain/services/Mailer'

export class FakeMailerAdapter implements Mailer {
	async sendEmail(to: string, subject: string, html: string): Promise<void> {
		// console.log('[FAKE EMAIL]', { to, subject, html })
	}
}
