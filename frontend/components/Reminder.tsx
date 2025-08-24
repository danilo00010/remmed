import { View, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'

import Colors from '@/constants/Colors'
import { Text } from 'react-native'
import { router } from 'expo-router'
import ToggleSwitch from 'toggle-switch-react-native'
import { addMinutes, format, isAfter } from 'date-fns'
import { useApi } from '@/api/useApi'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useToast } from '@/contexts/ToastProvider'
import {
	cancelReminderNotifications,
	createReminderNotifications,
	getRemindersNotifications,
} from '@/services/notificationService'
import { useStore } from '@/contexts/StoreProvider'
import { Reminder as ReminderInterface } from '@/domain/entities/Reminder'
import { formatInTimeZone } from 'date-fns-tz'

interface ReminderComponentProps {
	reminder: ReminderInterface
	onStatusChange?: () => void
	type?: string
}

export default function Reminder(props: ReminderComponentProps) {
	const api = useApi()
	const toast = useToast()

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	const { notifications, setNotifications } = useStore()

	const { reminder } = props
	const [isEnabled, setIsEnabled] = useState(reminder.status)
	const [times, setTimes] = useState<string[]>([])

	const changeSwitchStatus = () => {
		const newStatus = !isEnabled
		setIsEnabled(newStatus)
		ToggleReminder(newStatus)
	}

	function GetReorderedTimes(reminder: ReminderInterface, repeatCount = 4) {
		const intervalMinutes = reminder.interval
		const start = new Date(reminder.startTime)
		const now = new Date()

		const allTimes = Array.from({ length: repeatCount * 2 }, (_, i) =>
			addMinutes(start, i * intervalMinutes)
		)

		const next = allTimes.find(t => isAfter(t, now)) ?? start

		return Array.from({ length: repeatCount }, (_, i) => {
			const t = addMinutes(next, i * intervalMinutes)
			const formatted = formatInTimeZone(t, timezone, 'HH:mm')

			return formatted
		})
	}

	function CancelReminderNotifications() {
		cancelReminderNotifications(
			reminder.id,
			notifications,
			setNotifications
		)
	}

	async function ToggleReminder(newStatus: boolean) {
		await api.get(`/reminders/toggle/${reminder.id}`).then(response => {})

		if (!newStatus) {
			CancelReminderNotifications()
		}

		if (props.onStatusChange) props.onStatusChange()
	}

	async function ToggleArchive() {
		CancelReminderNotifications()

		await api
			.put(`reminders/${reminder.id}`, {
				...reminder,
				archive: !reminder.archivedAt,
			})
			.then(response => {
				if (response.status === 200) {
					toast({
						type: 'success',
						text2: `Lembrete ${
							reminder.archivedAt ? 'des' : ''
						}arquivado.`,
					})

					if (props.onStatusChange) props.onStatusChange()
				}
			})
	}

	useEffect(() => {
		if (reminder) {
			if (reminder.interval && reminder.startTime) {
				const orderedTimes = GetReorderedTimes(reminder)

				setTimes(orderedTimes)
			}
		}
	}, [reminder])

	return (
		<View>
			<Pressable
				style={styles.card}
				onPress={() => router.push(`/(modals)/reminder/${reminder.id}`)}
			>
				<View style={styles.data_container}>
					<Text style={styles.name}>{reminder.name}</Text>
					<View style={styles.times_container}>
						{times.map((time, index, arr) => {
							const minOpacity = 0.3
							const opacity =
								1 -
								(index / (arr.length - 1)) * (1 - minOpacity)

							const isActive =
								index === 0 &&
								reminder.status &&
								!reminder.archivedAt

							return (
								<View
									key={index}
									style={[styles.times_cell, { opacity }]}
								>
									<Text
										style={[
											isActive
												? styles.primaryStyle
												: styles.secondaryStyle,
										]}
									>
										{time}h
									</Text>
								</View>
							)
						})}
					</View>
				</View>
				<View style={styles.switch_container}>
					{props.type === 'archived' ? (
						<Pressable onPress={ToggleArchive}>
							<MaterialCommunityIcons
								name="package-up"
								size={48}
								color={Colors.primary}
							/>
						</Pressable>
					) : (
						<ToggleSwitch
							isOn={isEnabled}
							onToggle={changeSwitchStatus}
							onColor={Colors.primary}
							offColor="#ccc"
							size="medium"
						/>
					)}
				</View>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		width: 360,
		height: 112,
		backgroundColor: Colors.backgroundLight,
		borderRadius: 8,
		padding: 16,
		marginVertical: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	cardPressed: {
		backgroundColor: Colors.backgroundLight,
	},
	data_container: {
		width: '80%',
	},
	name: {
		color: Colors.white,
		fontSize: 20,
		fontWeight: 400,
	},
	times_container: {
		width: '100%',
		marginVertical: 8,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	times_cell: {
		width: '50%',
	},
	primaryStyle: {
		fontSize: 16,
		color: Colors.primaryHighlight,
		fontWeight: 700,
	},
	secondaryStyle: {
		fontSize: 16,
		color: Colors.textSecondary,
	},
	switch_container: {
		width: '20%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	switch: {
		width: 60,
		height: 30,
		borderRadius: 25,
	},
	circle: {
		width: 25,
		height: 25,
		borderRadius: 20,
		marginLeft: -1,
	},
})
