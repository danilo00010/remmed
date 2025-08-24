import { useApi } from '@/api/useApi'
import Reminder from '@/components/Reminder'
import Colors from '@/constants/Colors'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	FlatList,
} from 'react-native'

export default function ProfileScreen() {
	const api = useApi()

	const [loading, setLoading] = useState(false)
	const [reminders, setReminders] = useState([])

	const [refreshing, setRefreshing] = useState(false)

	const GetArchiveds = async () => {
		return api
			.get('/reminders/archiveds')
			.then((response: any) => {
				setReminders(response.data)

				return response.data
			})
			.catch(error => {
				console.error(
					'Erro ao buscar os lembretes arquivados:',
					error.message
				)
			})
			.finally(() => {
				setLoading(false)
				setRefreshing(false)
			})
	}

	useEffect(() => {
		GetArchiveds()
	}, [])

	const handleRefresh = useCallback(async () => {
		setRefreshing(true)

		GetArchiveds().then(reminders => {
			if (!reminders.length) router.replace('/(drawer)/home')
		})
	}, [])

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : (
				<View style={styles.container}>
					<View style={styles.container}>
						<Text style={styles.title}>Lembretes arquivados</Text>
						{reminders.length > 0 ? (
							<FlatList
								style={styles.list}
								data={reminders}
								keyExtractor={(item: any) => item.id}
								renderItem={({ item }) => (
									<Reminder
										reminder={item}
										type="archived"
										onStatusChange={handleRefresh}
									/>
								)}
								refreshing={refreshing}
								onRefresh={handleRefresh}
							/>
						) : (
							<Text style={styles.text}>
								Nenhum lembrete arquivado.
							</Text>
						)}
					</View>
				</View>
			)}
		</View>
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
		marginTop: 24,
		color: Colors.white,
		fontSize: 20,
		fontWeight: 'bold',
	},
	text: {
		flex: 1,
		color: Colors.white,
		marginTop: 32,
	},
	list: {
		flex: 1,
		marginBottom: 16,
	},
})
