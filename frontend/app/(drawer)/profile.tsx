import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useApi } from '@/api/useApi'
import { useAuth } from '@/contexts/AuthProvider'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/contexts/ToastProvider'
import Button from '@/components/Button'
import Colors from '@/constants/Colors'
import FormGroup from '@/components/FormGroup'

import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFocusEffect } from '@react-navigation/native'

const schema = yup.object().shape({
	name: yup
		.string()
		.min(2, 'Mínimo de 2 caracteres')
		.required('Nome é obrigatório'),
	email: yup.string().email('E-mail inválido'),
	password: yup.string().when([], {
		is: (val: string) => val && val.length > 0,
		then: schema => schema.min(6, 'Mínimo de 6 caracteres'),
		otherwise: schema => schema.notRequired(),
	}),
	passwordConfirmation: yup.string().when('password', {
		is: (val: string) => val && val.length > 0,
		then: schema =>
			schema
				.required('Confirmaçao de senha obrigatória')
				.oneOf([yup.ref('password')], 'As senhas devem coincidir'),
		otherwise: schema => schema.notRequired(),
	}),
})

export default function ProfileScreen() {
	const { user, setUser } = useAuth()
	const toast = useToast()

	const api = useApi()

	const [loading, setLoading] = useState(false)

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [visible, setVisible] = useState(false)

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) })

	const changePasswordVisibility = () => {
		setVisible(prev => !prev)
	}

	const loadUserData = () => {
		if (!user) return

		setName(user.name)
		setEmail(user.email)
	}

	useFocusEffect(
		useCallback(() => {
			reset({
				email: '',
				password: '',
				passwordConfirmation: '',
			})
		}, [])
	)

	useEffect(() => {
		loadUserData()
	}, [user])

	useEffect(() => {
		if (name) {
			reset({ name })
		}
	}, [name])

	const DispatchChangeEmail = async (newEmail: string) => {
		if (!user) return

		await api
			.post(`/change-email/${user.id}`, {
				newEmail,
			})
			.then((response: any) => {
				if (response.status === 200) {
					toast({
						type: 'success',
						text2: 'Enviamos um e-mail para o novo endereço. Faça a validação!',
					})
				}
			})
	}

	const SaveUser = async (data: any) => {
		if (!user) return

		setLoading(true)

		const userData: any = {
			name: data.name ? data.name : user.name,
		}

		if (data.email && data.email !== '') {
			await DispatchChangeEmail(data.email)
		}

		if (data.password) {
			userData.password = data.password
		}

		await api
			.put(`/users/${user.id}`, userData)
			.then(response => {
				if (response.status === 200) {
					setUser({
						...user,
						...userData,
					})

					toast({
						type: 'success',
						text2: 'Dados salvos com sucesso.',
					})
				}
			})
			.catch(error => {
				if (error.status === 409) {
					toast({
						type: 'error',
						text1: 'Erro!',
						text2: 'E-mail já utilizado!',
					})

					return
				}

				toast({
					type: 'error',
					text1: 'Erro!',
					text2: 'Ocorreu um erro ao salvar. Confira os dados.',
				})
			})
			.finally(() => setLoading(false))
	}

	const DeleteUserConfirmation = async () => {
		Alert.alert(
			'Atenção!',
			'Deseja realmente excluir sua conta? Essa ação é irreversível!',
			[
				{ text: 'Não', style: 'cancel' },
				{ text: 'Sim, excluir', onPress: DeleteUser },
			]
		)
	}

	const DeleteUser = async () => {
		setLoading(true)

		if (!user) return

		await api
			.delete(`/users/${user.id}`)
			.then(response => {
				if (response.status === 204) {
					router.replace('/(auth)/login')

					return
				}
			})
			.catch(error => {
				toast({
					type: 'error',
					text1: 'Erro!',
					text2: 'Ocorreu um erro ao salvar. Confira os dados.',
				})
			})
			.finally(() => setLoading(false))
	}

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator
					style={{ flex: 1 }}
					size="large"
					color="#000"
				/>
			) : (
				<View style={styles.formContainer}>
					<FormGroup
						formGroupName="Dados básicos"
						style={styles.formGroup}
					>
						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, value } }) => (
								<TextInput
									placeholder="Nome completo"
									placeholderTextColor="#aaa"
									autoCorrect={false}
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
					<FormGroup
						formGroupName="E-mail"
						style={styles.formGroup}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 8,
							}}
						>
							<Text style={styles.text}>E-mail atual: </Text>
							<Text style={[styles.text, { fontWeight: 'bold' }]}>
								{email}
							</Text>
						</View>
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
					<FormGroup formGroupName="Senha">
						<FormGroup
							style={[styles.formGroup, { marginBottom: 24 }]}
						>
							<Controller
								control={control}
								name="password"
								render={({ field: { onChange, value } }) => (
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
											style={styles.passwordVisibility}
											onPress={changePasswordVisibility}
										>
											<Ionicons
												name={
													visible ? 'eye' : 'eye-off'
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
								render={({ field: { onChange, value } }) => (
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
											style={styles.passwordVisibility}
											onPress={changePasswordVisibility}
										>
											<Ionicons
												name={
													visible ? 'eye' : 'eye-off'
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
					</FormGroup>
					<Button
						onPress={handleSubmit(SaveUser)}
						title="Salvar"
					/>
					<Button
						style={[styles.button, styles.deleteButton]}
						styleText={styles.deleteButtonText}
						stylePressed={{
							backgroundColor: '#540000',
							color: '#fff',
						}}
						onPress={DeleteUserConfirmation}
						title="Excluir conta"
					/>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.background,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	formContainer: {
		flex: 1,
		width: 350,
		borderRadius: 16,
		padding: 16,
		paddingVertical: 32,
		gap: 32,
	},
	formGroup: {
		flex: 0,
		position: 'relative',
	},
	text: {
		color: Colors.white,
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
		bottom: -20,
		fontSize: 12,
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
})
