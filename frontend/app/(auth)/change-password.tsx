import { ActivityIndicator, Image, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/Button'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Link from '@/components/Link'
import { useApi } from '@/api/useApi'
import { useToast } from '@/contexts/ToastProvider'

export default function ChangePassword() {
	const api = useApi()
	const toast = useToast()

	const { token: verificationToken } = useLocalSearchParams<{
		token?: string
	}>()

	const [loading, setLoading] = useState(false)
	const [userId, setUserId] = useState('')
	const [password, setPassword] = useState('')
	const [passwordConfirmation, setPasswordConfirmation] = useState('')
	const [visible, setVisible] = useState(false)
	const [invalidCredentials, setInvalidCredentials] = useState<string | null>(
		null
	)

	const changePasswordVisibility = () => {
		setVisible(prev => !prev)
	}

	const changePassword = (value: string) => {
		setInvalidCredentials(null)
		setPassword(value)
	}

	const changePasswordConfirmation = (value: string) => {
		setInvalidCredentials(null)
		setPasswordConfirmation(value)
	}

	const router = useRouter()

	const ChangePassword = async () => {
		if (!password || !passwordConfirmation) {
			setInvalidCredentials('Alguma informação está inválida!')

			return
		}

		if (password !== passwordConfirmation) {
			setInvalidCredentials('Senha e confirmação diferentes!')

			return
		}

		setLoading(true)

		if (!verificationToken && !userId) {
			router.replace('/(auth)/login')
			return
		}

		const requestData = {
			userId,
			newPassword: password,
			confirmNewPassword: password,
			verificationToken,
		}

		await api
			.post('/change-password', requestData)
			.then(response => {
				if (response.status === 200) {
					toast({
						type: 'success',
						text2: 'Senha alterada com sucesso.',
						onHide() {
							router.replace('/(auth)/login')
						},
					})
				}
			})
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		const GetUser = async () => {
			setLoading(true)

			await api
				.get(`/users?verificationToken=${verificationToken}`)
				.then(response => {
					if (response.status === 200) {
						setUserId(response.data.userId)
					}
				})
				.finally(() => setLoading(false))
		}

		GetUser()
	}, [verificationToken])

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
			<View style={styles.cardContainer}>
				{loading ? (
					<ActivityIndicator
						style={{ flex: 1 }}
						size="large"
						color="#000"
					/>
				) : (
					<View
						style={{
							position: 'relative',
							backgroundColor: 'transparent',
							gap: 24,
						}}
					>
						<View style={styles.passwordWrapper}>
							<TextInput
								placeholder="Nova senha"
								placeholderTextColor="#444"
								secureTextEntry={!visible}
								autoCapitalize="none"
								autoCorrect={false}
								style={[
									styles.input,
									{ flex: 1, paddingRight: 34 },
								]}
								onChangeText={changePassword}
							/>
							<TouchableOpacity
								style={styles.passwordVisibility}
								onPress={changePasswordVisibility}
							>
								<Ionicons
									name={visible ? 'eye' : 'eye-off'}
									size={24}
									color="#888"
								/>
							</TouchableOpacity>
						</View>
						<View style={styles.passwordWrapper}>
							<TextInput
								placeholder="Confirme a nova senha"
								placeholderTextColor="#444"
								secureTextEntry={!visible}
								autoCapitalize="none"
								autoCorrect={false}
								style={[
									styles.input,
									{ flex: 1, paddingRight: 34 },
								]}
								onChangeText={changePasswordConfirmation}
								onSubmitEditing={ChangePassword}
							/>
							<TouchableOpacity
								style={styles.passwordVisibility}
								onPress={changePasswordVisibility}
							>
								<Ionicons
									name={visible ? 'eye' : 'eye-off'}
									size={24}
									color="#888"
								/>
							</TouchableOpacity>
						</View>
						{invalidCredentials && (
							<Text style={styles.invalid}>
								{invalidCredentials}
							</Text>
						)}
					</View>
				)}
				<Button
					onPress={ChangePassword}
					title="Continuar"
				/>
			</View>
			<View style={styles.footer}>
				<Text style={styles.footerText}>Lembrou sua senha?</Text>
				<Link
					href="/(auth)/login"
					text="Entre agora!"
					asChild
				/>
			</View>
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
	input: {
		backgroundColor: Colors.backgroundInput,
		borderWidth: 1,
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		color: '#000',
	},
	passwordWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative',
		backgroundColor: 'transparent',
	},
	passwordVisibility: {
		position: 'absolute',
		top: 6,
		right: 8,
	},
	invalid: {
		color: 'red',
		position: 'absolute',
		bottom: -20,
		fontSize: 12,
	},
	footer: {
		backgroundColor: Colors.background,
		flexDirection: 'row',
		gap: 6,
	},
	footerText: {
		color: Colors.white,
	},
})
