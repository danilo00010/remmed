import { useApi } from '@/api/useApi'
import AddReminder from '@/components/AddReminder'
import Reminder from '@/components/Reminder'
import Colors from '@/constants/Colors'
import { useAuth } from '@/contexts/AuthProvider'
import { useStore } from '@/contexts/StoreProvider'
import { Reminder as ReminderInterface } from '@/domain/entities/Reminder'
import {
	createReminderNotifications,
	getRemindersNotifications,
} from '@/services/notificationService'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Home() {
	const api = useApi()

	const { token } = useAuth()

	const [reminders, setReminders] = useState<Array<ReminderInterface>>()
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)

	const { notifications, setNotifications } = useStore()

	const ValidateNotifications = async (reminder: any) => {
		const reminderNotifications = await getRemindersNotifications(
			reminder,
			notifications
		)

		const hasNotifications = reminderNotifications.length > 0

		if (!hasNotifications) {
			createReminderNotifications(reminder, setNotifications)
		}
	}

	const GetReminders = async () => {
		await api
			.get('/reminders')
			.then((response: any) => {
				const newReminders = response.data as Array<ReminderInterface>

				newReminders.forEach(reminder => {
					ValidateNotifications(reminder)
				})

				setReminders(newReminders)
			})
			.catch((error: any) => {
				console.error('Erro ao buscar os lembretes:', error.message)
			})
			.finally(() => {
				setLoading(false)
				setRefreshing(false)
			})
	}

	useFocusEffect(
		useCallback(() => {
			if (!token) return

			GetReminders()
		}, [token])
	)

	const handleRefresh = useCallback(async () => {
		setRefreshing(true)
		GetReminders()
	}, [])

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : (
				<View style={styles.container}>
					<AddReminder />
					{reminders && reminders.length > 0 && (
						<FlatList
							style={styles.list}
							data={reminders}
							keyExtractor={(item: any) => item.id}
							renderItem={({ item }) => (
								<Reminder
									reminder={item}
									onStatusChange={handleRefresh}
								/>
							)}
							refreshing={refreshing}
							onRefresh={handleRefresh}
						/>
					)}
				</View>
			)}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.background,
		gap: 18,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	list: {
		flex: 1,
		marginVertical: 16,
	},
})
