import { Mailer } from '../../domain/services/Mailer'
import nodemailer from 'nodemailer'

export class MailerAdapter implements Mailer {
	private transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: process.env.SMTP_SECURE === 'true' ? true : false,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	})

	async sendEmail(to: string, subject: string, html: string): Promise<void> {
		const sender = process.env.SMTP_USER

		await this.transporter.sendMail({
			from: sender,
			to,
			subject,
			html,
		})
	}
}
