export interface Mailer {
	sendEmail(to: string, subject: string, html: string): Promise<void>
}
