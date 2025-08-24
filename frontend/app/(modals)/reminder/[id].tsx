import Colors from '@/constants/Colors'
import {
	ActivityIndicator,
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useApi } from '@/api/useApi'
import ToggleSwitch from 'toggle-switch-react-native'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { addHours, getHours, getMinutes } from 'date-fns'
import Button from '@/components/Button'
import { toZonedTime, format, formatInTimeZone } from 'date-fns-tz'
import { useToast } from '@/contexts/ToastProvider'
import {
	cancelReminderNotifications,
	createReminderNotifications,
} from '@/services/notificationService'
import { useStore } from '@/contexts/StoreProvider'
import { Reminder as ReminderInterface } from '@/domain/entities/Reminder'

type ReminderProps = {
	id: string
	name: string
	status: boolean
	startTime: Date | string
	interval: number
	archive: boolean
	archivedAt?: Date
}

type IntervalProps = {
	id: number
	display: string
	minutes: number
}

export default function Reminder() {
	const api = useApi()
	const toast = useToast()
	const { notifications, setNotifications } = useStore()

	const { id } = useLocalSearchParams()
	const isNew = id === 'new'

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isNew ? 'Novo lembrete' : 'Editar lembrete',
		})
	}, [id])

	const [loading, setLoading] = useState(false)
	const [reminder, setReminder] = useState<ReminderInterface>({
		id: '',
		name: '',
		status: true,
		startTime: new Date(),
		interval: 0,
	})
	const [isEnabled, setIsEnabled] = useState<boolean>(reminder.status)
	const [startTime, setStartTime] = useState<Date>(new Date())
	const [selectedInterval, setSelectedInterval] = useState<IntervalProps>({
		id: 1,
		display: '4 horas',
		minutes: 240,
	})

	const navigation = useNavigation()

	useEffect(() => {
		GetReminder()
	}, [id])

	const GetReminder = async () => {
		if (isNew) return

		setLoading(true)
		await api
			.get(`/reminders/${id}`)
			.then(response => {
				if (response.status === 200) {
					setReminder(response.data)
					setStartTime(new Date(response.data.startTime))
					setIsEnabled(response.data.status)

					const interval = intervals.find(
						i => i.minutes === response.data.interval
					)

					setSelectedInterval(interval ?? intervals[0])
				}
			})
			.finally(() => setLoading(false))
	}

	const ChangeSwitch = (value: boolean) => {
		setIsEnabled(value)
		setReminder({ ...reminder, status: value })
	}

	const intervals: IntervalProps[] = [
		{ id: 1, display: '4 horas', minutes: 240 },
		{ id: 2, display: '6 horas', minutes: 360 },
		{ id: 3, display: '8 horas', minutes: 480 },
		{ id: 4, display: '12 horas', minutes: 720 },
	]

	const ShowTimePicker = () => {
		DateTimePickerAndroid.open({
			value: startTime,
			display: 'spinner',
			mode: 'time',
			is24Hour: true,
			onChange: SetStartTime,
		})
	}

	const GetStartTime = () => {
		const hour = `${getHours(startTime)}`.padStart(2, '0')
		const minutes = `${getMinutes(startTime)}`.padStart(2, '0')

		return formatInTimeZone(startTime, timezone, 'HH:mm')
	}

	const SetStartTime = (event: any, selectedTime?: Date) => {
		if (event.type === 'set' && selectedTime) {
			setStartTime(selectedTime)
		}
	}

	function GetNextTime() {
		if (!startTime || !selectedInterval?.minutes) return ''

		const nextTime = addHours(startTime, selectedInterval.minutes / 60)
		const hour = `${getHours(nextTime)}`.padStart(2, '0')
		const minutes = `${getMinutes(nextTime)}`.padStart(2, '0')

		return `${hour}:${minutes}`
	}

	function DeleteReminderConfirmation() {
		Alert.alert('Confirmação', 'Deseja realmente excluir o lembrete?', [
			{
				text: 'Não',
				onPress: () => null,
				style: 'cancel',
			},
			{
				text: 'Sim',
				onPress: DeleteReminder,
			},
		])
	}

	async function DeleteReminder() {
		setLoading(true)

		CancelReminderNotifications()

		await api
			.delete(`/reminders/${reminder.id}`)
			.then(response => {
				if (response.status === 204) {
					router.replace('/(drawer)/home')
				}
			})
			.finally(() => setLoading(false))
	}

	async function CancelReminderNotifications() {
		await cancelReminderNotifications(
			reminder.id,
			notifications,
			setNotifications
		)
	}

	async function CreateNotifications(startTime: Date) {
		CancelReminderNotifications()

		createReminderNotifications(
			{
				...reminder,
				startTime,
			},
			setNotifications
		)
	}

	async function SaveReminder() {
		if (!reminder.name) {
			toast({
				type: 'error',
				text2: 'O lembrete precisa de nome!',
			})

			return
		}

		if (reminder.name.length < 2) {
			toast({
				type: 'error',
				text2: 'O nome precisa ter ao menos 2 caracteres!',
			})

			return
		}

		setLoading(true)

		const newReminder: Partial<ReminderProps> = {
			name: reminder.name,
			startTime,
			interval: selectedInterval.minutes,
			status: reminder.status,
			archive: !!reminder.archivedAt,
		}

		if (reminder.id) {
			await api
				.put(`/reminders/${reminder.id}`, newReminder)
				.then(response => {
					if (response.status === 200) {
						router.replace('/(drawer)/home')
					}
				})
				.finally(() => setLoading(false))
		} else {
			await api
				.post('/reminders', newReminder)
				.then(response => {
					if (response.status === 201) {
						router.replace('/(drawer)/home')
					}
				})
				.finally(() => setLoading(false))
		}

		const zoned = await toZonedTime(startTime, 'America/Sao_Paulo')
		CreateNotifications(zoned)
	}

	async function ToggleArchive() {
		const archiveStatus = !reminder.archivedAt

		if (archiveStatus) {
			CancelReminderNotifications()
		}

		await api
			.put(`reminders/${reminder.id}`, {
				...reminder,
				archive: archiveStatus,
			})
			.then(response => {
				if (response.status === 200) {
					toast({
						type: 'success',
						text2: `Lembrete ${
							reminder.archivedAt ? 'des' : ''
						}arquivado.`,
					})

					router.replace('/(drawer)/home')
				}
			})
	}

	return (
		<SafeAreaView style={styles.container}>
			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : (
				<View style={styles.form}>
					<View style={styles.form_group}>
						<TextInput
							style={styles.input}
							placeholder="Nome"
							autoCorrect={false}
							autoFocus={true}
							placeholderTextColor="#aaa"
							onChangeText={name =>
								setReminder({ ...reminder, name })
							}
							value={reminder.name}
						/>
					</View>
					<View style={[styles.form_group, styles.switch_container]}>
						<Text style={styles.label}>Status: </Text>
						<ToggleSwitch
							isOn={isEnabled}
							onToggle={ChangeSwitch}
							onColor={Colors.primary}
							offColor="#ccc"
							size="medium"
						/>
					</View>
					<SelectDropdown
						data={intervals}
						onSelect={(selectedItem, index) => {
							setSelectedInterval(selectedItem)
						}}
						defaultValue={selectedInterval}
						renderButton={(selectedItem, isOpened) => {
							return (
								<View style={styles.dropdownButtonStyle}>
									<Text style={styles.dropdownButtonTxtStyle}>
										{(selectedItem &&
											selectedItem.display) ||
											(selectedInterval &&
												selectedInterval.display) ||
											'Selecione o intervalo'}
									</Text>
									<Icon
										name={
											isOpened
												? 'chevron-up'
												: 'chevron-down'
										}
										style={styles.dropdownButtonArrowStyle}
									/>
								</View>
							)
						}}
						renderItem={(item, index, isSelected) => {
							return (
								<View
									style={{
										...styles.dropdownItemStyle,
										...(isSelected && {
											backgroundColor:
												Colors.primaryHover,
											color: Colors.white,
										}),
									}}
								>
									<Text style={styles.dropdownItemTxtStyle}>
										{item.display}
									</Text>
								</View>
							)
						}}
						showsVerticalScrollIndicator={false}
						dropdownStyle={styles.dropdownMenuStyle}
					/>
					<View style={styles.form_group}>
						<Text style={styles.label}>Inicio em:</Text>
						<Pressable
							onPress={ShowTimePicker}
							style={styles.inputPressableContainer}
						>
							<View style={styles.inputPressableContainer}>
								<Text style={[styles.input, { minHeight: 40 }]}>
									{GetStartTime()}h
								</Text>
							</View>
						</Pressable>
					</View>
					<View style={styles.form_group}>
						<Text style={styles.label}>Próximo em:</Text>
						<TextInput
							style={[
								styles.input,
								{ backgroundColor: '#1e2021', color: '#aaa' },
							]}
							value={`${GetNextTime()}h`}
							readOnly
						/>
					</View>
					<Button
						style={styles.button}
						onPress={SaveReminder}
						title="Salvar"
					/>
					{reminder.id && (
						<Button
							style={[styles.button, styles.deleteButton]}
							styleText={styles.deleteButtonText}
							stylePressed={{
								backgroundColor: '#540000',
								color: '#fff',
							}}
							onPress={DeleteReminderConfirmation}
							title="Excluir"
						/>
					)}
					{reminder.id && (
						<Button
							style={[styles.button, styles.archiveButton]}
							styleText={styles.archiveButtonText}
							stylePressed={{
								backgroundColor: '#333',
								color: '#fff',
							}}
							onPress={ToggleArchive}
							title={
								reminder.archivedAt ? 'Desarquivar' : 'Arquivar'
							}
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
		backgroundColor: Colors.background,
		padding: 16,
	},
	form: {
		gap: 32,
		alignItems: 'flex-start',
	},
	form_group: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	label: {
		color: Colors.white,
		fontSize: 16,
	},
	input: {
		flex: 1,
		color: Colors.white,
		backgroundColor: Colors.backgroundLighter,
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	inputPressableContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	switch_container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	button: {
		width: '100%',
	},
	deleteButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#B30000',
	},
	deleteButtonText: {
		color: '#B30000',
	},
	archiveButton: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#75747a',
	},
	archiveButtonText: {
		color: '#75747a',
	},
	dropdownButtonStyle: {
		height: 42,
		backgroundColor: Colors.backgroundLighter,
		borderRadius: 8,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 12,
		margin: 0,
	},
	dropdownButtonTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '400',
		color: Colors.white,
	},
	dropdownButtonArrowStyle: {
		fontSize: 28,
		color: Colors.white,
	},
	dropdownButtonIconStyle: {
		fontSize: 28,
	},
	dropdownMenuStyle: {
		backgroundColor: Colors.backgroundLighter,
		borderRadius: 8,
	},
	dropdownItemStyle: {
		width: '100%',
		flexDirection: 'row',
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
	},
	dropdownItemTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '400',
		color: Colors.white,
	},
	dropdownItemIconStyle: {
		fontSize: 28,
		marginRight: 8,
	},
})
