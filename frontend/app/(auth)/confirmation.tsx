import { Image, Text, View } from 'react-native'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Colors from '@/constants/Colors'
import Button from '@/components/Button'
import { router } from 'expo-router'

import Link from '@/components/Link'

export default function Login() {
	const redirectToLogin = async () => {
		router.replace('/(auth)/login')
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
				<Text style={styles.text}>
					Cadastro feito com sucesso! Se você já fez a confirmação no
					e-mail, tente acessar agora.
				</Text>
				<Text style={styles.text}>
					Se não, confirme com o link enviado no seu e-mail!
				</Text>
				<Button
					onPress={redirectToLogin}
					title="Logar"
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
	text: {
		color: Colors.white,
		fontSize: 16,
		textAlign: 'center',
	},
	input: {
		backgroundColor: Colors.backgroundInput,
		borderWidth: 1,
		borderRadius: 8,
		padding: 8,
		paddingHorizontal: 12,
		color: '#000',
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
