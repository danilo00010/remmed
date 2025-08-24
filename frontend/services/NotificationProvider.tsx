import { useEffect } from 'react'
import * as Notifications from 'expo-notifications'

Notifications.setNotificationHandler({
	handleNotification:
		async (): Promise<Notifications.NotificationBehavior> => {
			return {
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
				shouldShowBanner: true,
				shouldShowList: true,
			}
		},
})

export function NotificationProvider({
	children,
}: {
	children: React.ReactNode
}) {
	useEffect(() => {
		const receivedListener = Notifications.addNotificationReceivedListener(
			notification => {
				// console.log( '🔔 Notificação recebida no foreground:', notification)
			}
		)

		const clickedListener =
			Notifications.addNotificationResponseReceivedListener(response => {
				// console.log('👉 Notificação clicada:', response)
			})

		return () => {
			receivedListener.remove()
			clickedListener.remove()
		}
	}, [])

	return children
}
