import { ActivityIndicator } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, View } from 'react-native'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TextInput } from 'react-native'
import { useApi } from '@/api/useApi'
import { useState } from 'react'
import { useToast } from '@/contexts/ToastProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@/components/Button'
import Colors from '@/constants/Colors'
import FormGroup from '@/components/FormGroup'
import Link from '@/components/Link'

const schema = yup.object().shape({
	email: yup
		.string()
		.email('E-mail inválido')
		.required('E-mail é obrigatório'),
})

export default function PasswordRecovery() {
	const api = useApi()
	const toast = useToast()

	const [loading, setLoading] = useState(false)

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) })

	const Recover = async (data: any) => {
		setLoading(true)

		await api
			.post('/password-recovery', {
				email: data.email,
			})
			.then(response => {
				if (response.status === 200) {
					toast({
						type: 'success',
						text2: 'E-mail de recuperação enviado!',
						onHide() {
							router.replace('/(auth)/login')
						},
					})
				}
			})
			.finally(() => setLoading(false))
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
					<View style={styles.loginContainer}>
						<Text style={styles.text}>
							Preencha com seu{' '}
							<Text style={{ fontWeight: 'bold' }}>e-mail</Text> e
							iremos enviar um link para recuperação da sua senha!
						</Text>
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
										autoFocus={true}
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

						<Button
							onPress={handleSubmit(Recover)}
							title="Continuar"
						/>
					</View>
					<View style={styles.footer}>
						<Text style={styles.footerText}>
							Lembrou sua senha?
						</Text>
						<Link
							style={{ height: '100%' }}
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
	loginContainer: {
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
	text: {
		color: Colors.white,
		fontSize: 16,
		textAlign: 'center',
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
	footer: {
		backgroundColor: Colors.background,
		flexDirection: 'row',
		gap: 6,
	},
	footerText: {
		color: '#aaa',
	},
})
