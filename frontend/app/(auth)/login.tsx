import { Image, Text, View } from 'react-native'
import { useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import RememberMe from '@/components/RememberMe'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import axios from 'axios'

import { useAuth } from '@/contexts/AuthProvider'
import Link from '@/components/Link'
import { useToast } from '@/contexts/ToastProvider'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export default function Login() {
	const toast = useToast()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [visible, setVisible] = useState(false)
	const [invalidCredentials, setInvalidCredentials] = useState<string | null>(
		''
	)

	const { setToken, setUser } = useAuth()

	const changePasswordVisibility = () => {
		setVisible(prev => !prev)
	}

	const changeEmail = (value: string) => {
		setInvalidCredentials(null)
		setEmail(value)
	}

	const changePassword = (value: string) => {
		setInvalidCredentials(null)
		setPassword(value)
	}

	const router = useRouter()

	const login = async () => {
		setInvalidCredentials(null)

		if (!email || !password) {
			setInvalidCredentials('Dados insuficientes para acessar...')

			return
		}

		const encodedCredentials = btoa(`${email}:${password}`)

		await axios
			.post(
				`${API_URL}/login`,
				{},
				{
					headers: {
						Authorization: `Basic ${encodedCredentials}`,
					},
				}
			)
			.then(({ data }) => {
				if (data.accessToken) {
					setToken(data.accessToken)
					setUser(data.user)

					router.replace('/(drawer)/home')
				}
			})
			.catch(error => {
				switch (error.status) {
					case 401:
						setInvalidCredentials('E-mail e/ou senha inválido(s)!')
						break
					case 404:
						setInvalidCredentials('Usuário não encontrado!')
						break
					default:
						toast({
							type: 'error',
							text1: 'Erro!',
							text2: 'Ocorreu um erro ao acessar. Confira os dados.',
						})
						break
				}
			})
	}

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
				<TextInput
					placeholder="E-mail"
					placeholderTextColor="#aaa"
					autoCapitalize="none"
					autoCorrect={false}
					autoFocus={true}
					style={styles.input}
					keyboardType="email-address"
					onChangeText={changeEmail}
				/>
				<View
					style={{
						position: 'relative',
						backgroundColor: 'transparent',
					}}
				>
					<View style={styles.passwordWrapper}>
						<TextInput
							placeholder="Senha"
							placeholderTextColor="#aaa"
							secureTextEntry={!visible}
							autoCapitalize="none"
							autoCorrect={false}
							style={[
								styles.input,
								{ flex: 1, paddingRight: 34 },
							]}
							onChangeText={changePassword}
							onSubmitEditing={login}
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
						<Text style={styles.invalid}>{invalidCredentials}</Text>
					)}
					<View style={styles.passwordRecovery}>
						<Link
							href="/(auth)/password-recovery"
							text="esqueci a senha"
							asChild={true}
						/>
					</View>
				</View>
				<Button
					onPress={login}
					title="Entrar"
				/>
			</View>
			<View style={styles.footer}>
				<Text style={styles.footerText}>
					Ainda não possui cadastro?
				</Text>
				<Link
					href="/(auth)/register"
					text="Cadastre-se!"
					asChild={true}
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
		backgroundColor: Colors.backgroundLighter,
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		fontSize: 16,
		color: Colors.white,
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
		bottom: 0,
		fontSize: 12,
	},
	passwordRecovery: {
		backgroundColor: 'transparent',
		alignItems: 'flex-end',
		marginTop: 8,
	},
	footer: {
		backgroundColor: Colors.background,
		flexDirection: 'row',
		gap: 6,
	},
	footerText: {
		color: '#aaa',
	},
})
