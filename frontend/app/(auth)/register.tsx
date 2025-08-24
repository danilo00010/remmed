import {
	ActivityIndicator,
	Image,
	Linking,
	Pressable,
	Text,
	View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useApi } from '@/api/useApi'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@/components/Button'
import Colors from '@/constants/Colors'
import FormGroup from '@/components/FormGroup'
import Link from '@/components/Link'

const schema = yup.object().shape({
	name: yup
		.string()
		.min(2, 'Mínimo de 2 caracteres')
		.required('Nome é obrigatório'),
	email: yup
		.string()
		.email('E-mail inválido')
		.required('E-mail é obrigatório'),
	password: yup
		.string()
		.required('Senha obrigatória')
		.min(6, 'Mínimo de 6 caracteres'),
	passwordConfirmation: yup
		.string()
		.oneOf([yup.ref('password')], 'As senhas devem coincidir')
		.required('Confirme sua senha'),
})

export default function Register() {
	const api = useApi()
	const toast = useToast()

	const [visible, setVisible] = useState(false)

	const [loading, setLoading] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) })

	const changePasswordVisibility = () => {
		setVisible(prev => !prev)
	}

	const router = useRouter()

	const SignUp = async (data: any) => {
		setLoading(true)

		const newUser = {
			name: data.name,
			email: data.email,
			password: data.password,
		}

		await api
			.post('/sign-up', newUser)
			.then(response => {
				if (response.status === 201) {
					router.replace('/(auth)/confirmation')
				}
			})
			.catch(error => {
				toast({
					type: 'error',
					text1: 'Erro!',
					text2: 'Ocorreu um erro ao cadastrar. Confira os dados.',
				})
			})
			.finally(() => setLoading(false))
	}

	const openExternal = (path: string) => {
		const url = `${process.env.EXPO_PUBLIC_APP_URL}${path}`

		Linking.openURL(url)
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
			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : (
				<>
					<View style={styles.cardContainer}>
						<FormGroup style={styles.formGroup}>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, value } }) => (
									<TextInput
										placeholder="Nome completo"
										placeholderTextColor="#aaa"
										autoCorrect={false}
										autoFocus={true}
										style={styles.input}
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.name && (
								<Text style={styles.invalid}>
									{errors.name.message}
								</Text>
							)}
						</FormGroup>

						<FormGroup style={styles.formGroup}>
							<Controller
								control={control}
								name="email"
								render={({ field: { onChange, value } }) => (
									<TextInput
										placeholder="E-mail"
										placeholderTextColor="#aaa"
										autoCapitalize="none"
										autoCorrect={false}
										style={styles.input}
										keyboardType="email-address"
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
							{errors.email && (
								<Text style={styles.invalid}>
									{errors.email.message}
								</Text>
							)}
						</FormGroup>

						<View
							style={{
								position: 'relative',
								backgroundColor: 'transparent',
								gap: 24,
							}}
						>
							<FormGroup style={styles.formGroup}>
								<Controller
									control={control}
									name="password"
									render={({
										field: { onChange, value },
									}) => (
										<View style={styles.passwordWrapper}>
											<TextInput
												placeholder="Senha"
												placeholderTextColor="#aaa"
												secureTextEntry={!visible}
												autoCapitalize="none"
												autoCorrect={false}
												style={[
													styles.input,
													{
														flex: 1,
														paddingRight: 34,
													},
												]}
												onChangeText={onChange}
												value={value}
											/>
											<TouchableOpacity
												style={
													styles.passwordVisibility
												}
												onPress={
													changePasswordVisibility
												}
											>
												<Ionicons
													name={
														visible
															? 'eye'
															: 'eye-off'
													}
													size={24}
													color="#888"
												/>
											</TouchableOpacity>
										</View>
									)}
								/>
								{errors.password && (
									<Text style={styles.invalid}>
										{errors.password.message}
									</Text>
								)}
							</FormGroup>

							<FormGroup style={styles.formGroup}>
								<Controller
									control={control}
									name="passwordConfirmation"
									render={({
										field: { onChange, value },
									}) => (
										<View style={styles.passwordWrapper}>
											<TextInput
												placeholder="Confirme a senha"
												placeholderTextColor="#aaa"
												secureTextEntry={!visible}
												autoCapitalize="none"
												autoCorrect={false}
												style={[
													styles.input,
													{
														flex: 1,
														paddingRight: 34,
													},
												]}
												onChangeText={onChange}
												value={value}
											/>
											<TouchableOpacity
												style={
													styles.passwordVisibility
												}
												onPress={
													changePasswordVisibility
												}
											>
												<Ionicons
													name={
														visible
															? 'eye'
															: 'eye-off'
													}
													size={24}
													color="#888"
												/>
											</TouchableOpacity>
										</View>
									)}
								/>
								{errors.passwordConfirmation && (
									<Text style={styles.invalid}>
										{errors.passwordConfirmation.message}
									</Text>
								)}
							</FormGroup>
						</View>

						<View style={styles.termsContainer}>
							<Text style={styles.termsText}>
								Ao continuar você concorda com nossos{' '}
								<Text
									style={styles.linkText}
									onPress={() => openExternal('/use-terms')}
								>
									Termos de Uso
								</Text>{' '}
								e{' '}
								<Text
									style={styles.linkText}
									onPress={() =>
										openExternal('/privacy-policy')
									}
								>
									Políticas de Privacidade
								</Text>
								.
							</Text>
						</View>
						<Button
							onPress={handleSubmit(SignUp)}
							title="Cadastrar"
						/>
					</View>
					<View style={styles.footer}>
						<Text style={styles.footerText}>
							Já possui cadastro?
						</Text>
						<Link
							href="/(auth)/login"
							text="Entre agora!"
							asChild
						/>
					</View>
				</>
			)}
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
	formGroup: {
		flex: 0,
		position: 'relative',
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
		bottom: -15,
		fontSize: 12,
	},
	passwordRecovery: {
		backgroundColor: 'transparent',
		alignItems: 'flex-end',
		marginTop: 8,
	},
	termsContainer: {},
	termsText: {
		textAlign: 'center',
		color: Colors.white,
		fontSize: 14,
	},
	linkText: {
		fontSize: 14,
		color: Colors.primary,
		textDecorationStyle: 'solid',
		textDecorationLine: 'underline',
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
