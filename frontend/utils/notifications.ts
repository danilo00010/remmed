import * as Notifications from 'expo-notifications'

export interface NotificationDataType {
	title: string
	hour: number
	minute: number
	reminderId: string
}

export async function scheduleNotification(data: NotificationDataType) {
	const id = await Notifications.scheduleNotificationAsync({
		content: {
			title: data.title,
			body: `Lembrete de remédio: ${data.title}`,
			sound: 'default',
		},
		trigger: {
			type: Notifications.SchedulableTriggerInputTypes.DAILY,
			hour: data.hour,
			minute: data.minute,
		},
	})

	return {
		id,
		...data,
	}
}

export async function cancelNotification(id: string) {
	await Notifications.cancelScheduledNotificationAsync(id)
}
