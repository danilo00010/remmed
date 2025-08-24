import Colors from '@/constants/Colors'
import { StyleSheet, Text, View } from 'react-native'

export default function FormGroup(props: any) {
	return (
		<View style={props.style}>
			{props.formGroupName && (
				<Text style={styles.formGroupName}>{props.formGroupName}</Text>
			)}
			{props.children}
		</View>
	)
}

const styles = StyleSheet.create({
	formGroupName: {
		color: Colors.white,
		marginBottom: 16,
		fontWeight: 600,
		fontSize: 18,
	},
})
