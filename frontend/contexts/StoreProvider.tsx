import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

export interface Notification {
	id: string
	title: string
	hour: number
	minute: number
	reminderId: string
}

export interface NotificationDataType {
	title: string
	hour: number
	minute: number
	reminderId: string
}

export interface StoreProviderType {
	notifications: Notification[]
	setNotifications: (notifications: Notification[]) => Promise<void>
}

export interface StoreContextType {
	notifications: Notification[]
	setNotifications: (value: Notification[]) => void
}

const StoreContext = createContext<StoreProviderType>({
	notifications: [],
	setNotifications: async () => {},
})

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	const [notifications, setNotificationsState] = useState<Notification[]>([])

	const setNotifications = async (newNotifications: Notification[]) => {
		setNotificationsState(newNotifications)

		SecureStore.setItemAsync(
			'notifications',
			JSON.stringify(newNotifications)
		).catch(e => console.error('Error saving notifications:', e))
	}

	useEffect(() => {
		const loadStoreData = async () => {
			const storedNotifications = await SecureStore.getItemAsync(
				'notifications'
			)

			if (!storedNotifications) return

			const parsed = JSON.parse(storedNotifications)

			if (Array.isArray(parsed)) {
				setNotificationsState(parsed)
			}
		}

		loadStoreData()
	}, [])

	return (
		<StoreContext.Provider value={{ notifications, setNotifications }}>
			{children}
		</StoreContext.Provider>
	)
}

export const useStore = () => useContext(StoreContext)
