import { scheduleNotification, cancelNotification } from '@/utils/notifications'
import {
	StoreProviderType,
	Notification as NotificationInterface,
} from '@/contexts/StoreProvider'
import { Reminder } from '@/domain/entities/Reminder'
import { cancelAllScheduledNotificationsAsync } from 'expo-notifications'

export async function getRemindersNotifications(
	reminder: Reminder,
	notifications: StoreProviderType['notifications']
): Promise<Array<NotificationInterface>> {
	const reminderNotifications = notifications.filter(
		n => n.reminderId === reminder.id
	)

	return reminderNotifications
}

export async function createReminderNotifications(
	reminder: Reminder,
	setNotifications: StoreProviderType['setNotifications']
) {
	if (!reminder.status || reminder.archivedAt) return

	const interval = reminder.interval / 60
	const count = Math.floor(24 / interval)
	const baseTime = new Date(reminder.startTime)

	const all = []

	for (let i = 0; i < count; i++) {
		const date = new Date(baseTime)
		date.setHours(baseTime.getHours() + i * interval)
		const hour = date.getHours()
		const minute = date.getMinutes()

		const notification = await scheduleNotification({
			title: reminder.name,
			hour,
			minute,
			reminderId: reminder.id,
		})

		all.push(notification)
	}

	// console.log('Create: ', all)

	setNotifications(all)
}

export async function cancelReminderNotifications(
	reminderId: string,
	notifications: StoreProviderType['notifications'],
	setNotifications: StoreProviderType['setNotifications']
) {
	const reminderNotifications = notifications.filter(
		n => n.reminderId === reminderId
	)

	// console.log('Cancel: ', reminderNotifications)

	await Promise.all(reminderNotifications.map(n => cancelNotification(n.id)))

	const remaining = notifications.filter(n => n.reminderId !== reminderId)
	setNotifications(remaining)
}

export async function cancelAllNotifications(
	setNotifications: StoreProviderType['setNotifications']
) {
	await cancelAllScheduledNotificationsAsync()

	setNotifications([])
}
