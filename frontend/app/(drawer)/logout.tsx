import { useApi } from '@/api/useApi'
import Colors from '@/constants/Colors'
import { logoutContent } from '@/contexts/AuthProvider'
import { useStore } from '@/contexts/StoreProvider'
import { cancelAllNotifications } from '@/services/notificationService'
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, ActivityIndicator, View } from 'react-native'

export default function Logout() {
	const [processing, setProcessing] = useState(false)

	const { setNotifications } = useStore()

	const api = useApi()

	useFocusEffect(
		useCallback(() => {
			if (processing) return
			Alert.alert('Confirmação', 'Deseja realmente sair?', [
				{
					text: 'Não',
					onPress: () => router.back(),
					style: 'cancel',
				},
				{
					text: 'Sim',
					onPress: handleLogout,
				},
			])
		}, [processing])
	)

	const handleLogout = async () => {
		setProcessing(true)

		try {
			await cancelAllNotifications(setNotifications)

			await logoutContent()

			await api.post('/logout')

			router.replace('/(auth)/login')
		} catch (error) {
			console.error('Erro ao fazer logout:', error)
		}
	}

	if (!processing)
		return (
			<View
				style={{ flex: 1, backgroundColor: Colors.background }}
			></View>
		)

	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<ActivityIndicator size="large" />
		</View>
	)
}
