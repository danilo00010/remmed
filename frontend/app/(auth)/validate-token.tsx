import { useApi } from '@/api/useApi'
import Colors from '@/constants/Colors'
import { useAuth } from '@/contexts/AuthProvider'
import { useToast } from '@/contexts/ToastProvider'
import { AntDesign } from '@expo/vector-icons'
import {
	Href,
	router,
	useLocalSearchParams,
	useRootNavigationState,
} from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type ValidationResponse = {
	status: number
	data: {
		accessToken?: string
		newEmail?: string
	}
}

export default function ValidateToken() {
	const api = useApi()
	const toast = useToast()

	const rootNavigation = useRootNavigationState()

	const { token, setToken, user, setUser } = useAuth()

	const { token: validationToken } = useLocalSearchParams<{
		token?: string
	}>()

	const TIMEOUT = 5

	const [loading, setLoading] = useState(false)
	const [validated, setValidated] = useState(false)
	const [countdown, setCountdown] = useState(TIMEOUT)
	const [startCountdown, setStartCountdown] = useState(false)
	const [route, setRoute] = useState<Href>('/(drawer)/home')

	useEffect(() => {
		if (!rootNavigation?.key) return

		if (!validationToken) {
			router.replace(route)
			return
		}

		const ValidateToken = async () => {
			setLoading(true)

			await api
				.get(`/validate-token?token=${validationToken}`)
				.then((response: ValidationResponse) => {
					if (response.status === 200) {
						setValidated(true)
						if (response.data.newEmail && user) {
							const newUser = {
								...user,
								email: response.data.newEmail,
							}

							setUser(newUser)

							setRoute('/(drawer)/profile')

							setTimeout(() => {
								toast({
									type: 'success',
									text2: 'Novo e-mail cadastrado com sucesso!',
								})
							}, TIMEOUT * 1000)
						}

						if (response.data.accessToken) {
							setToken(response.data.accessToken)
						}

						setStartCountdown(true)
					} else {
						router.replace(route)
					}
				})
				.catch(error => {
					console.error('Erro ao validar token:', error)

					toast({
						type: 'error',
						text2: 'Erro ao realizar a validação!',
					})

					if (!token) {
						router.replace(route)
					} else {
						router.replace(route)
					}
				})
				.finally(() => setLoading(false))
		}

		ValidateToken()
	}, [rootNavigation?.key, validationToken])

	useEffect(() => {
		if (!startCountdown) return

		const interval = setInterval(() => {
			setCountdown(prev => {
				if (prev <= 1) {
					clearInterval(interval)
					router.replace(route)
					return 0
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [startCountdown])

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.logoContainer}>
				<Image
					source={require('@/assets/images/pill_3.png')}
					style={{ width: 40, height: 40 }}
					resizeMode="contain"
				/>
				<Text style={styles.largeText}>RemMed</Text>
			</View>

			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : validated ? (
				<View style={styles.cardContainer}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 12,
						}}
					>
						<Text style={styles.textHightlight}>
							Verificação concluída!
						</Text>
						<AntDesign
							name="check"
							size={32}
							color="#208c3d"
						/>
					</View>
					<Text style={styles.text}>
						Você será redirecionado em {countdown} segundo
						{countdown > 1 ? 's' : ''}...
					</Text>
				</View>
			) : null}
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: Colors.background,
		gap: 32,
	},
	logoContainer: {
		marginTop: 64,
		backgroundColor: Colors.background,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	cardContainer: {
		backgroundColor: Colors.backgroundLight,
		width: 320,
		borderRadius: 16,
		padding: 16,
		paddingVertical: 32,
		gap: 24,
		justifyContent: 'center',
	},
	largeText: {
		color: Colors.primary,
		fontSize: 36,
	},
	textHightlight: {
		color: Colors.white,
		fontSize: 16,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	text: {
		color: Colors.white,
		fontSize: 16,
		textAlign: 'center',
	},
})
