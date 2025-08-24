import Colors from '@/constants/Colors'
import { Text, Pressable, StyleSheet, StyleProp } from 'react-native'

interface ButtonInterface {
	onPress: () => void
	title: string
	style?: {}
	styleText?: {}
	stylePressed?: {}
}

export default function Button(props: ButtonInterface) {
	const onPress = props.onPress
	const title = props.title
	const style = props.style
	const styleText = props.styleText
	const stylePressed = props.stylePressed
	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				style,
				pressed && (stylePressed || styles.pressed),
			]}
			onPress={onPress}
		>
			<Text style={[styles.buttonText, styleText, { borderWidth: 0 }]}>
				{title}
			</Text>
		</Pressable>
	)
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: Colors.primary,
		alignItems: 'center',
		padding: 6,
		borderRadius: 8,
	},
	buttonText: {
		color: Colors.white,
		textAlign: 'center',
		fontSize: 18,
	},
	pressed: {
		backgroundColor: Colors.primaryHover,
	},
})
