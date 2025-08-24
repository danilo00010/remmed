import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Pressable, View, StyleSheet } from 'react-native'
import { Text } from 'react-native'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'

const getReminderIdForRoute = () => {
	const id = 1

	return id
}

export default function AddReminder() {
	return (
		<View style={styles.container}>
			<Link
				href="/(modals)/reminder/new"
				asChild
			>
				<Pressable style={styles.button}>
					<FontAwesome
						size={30}
						color={Colors.primaryHighlight}
						style={{ marginHorizontal: 8 }}
						name="plus"
					/>
					<Text style={styles.text}>Adicionar lembrete</Text>
				</Pressable>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '90%',
		marginTop: 16,
		marginBottom: 16,
		paddingVertical: 24,
	},
	button: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		margin: 8,
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: 24,
		fontWeight: 600,
		color: Colors.white,
	},
})
