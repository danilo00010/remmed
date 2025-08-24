import Colors from '@/constants/Colors'
import { ExternalPathString, Link, RelativePathString } from 'expo-router'
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native'

interface LinkInterface {
	href: any
	text: string
	asChild: boolean
	style?: StyleProp<ViewStyle>
}

export default function CustomLink(props: LinkInterface) {
	return (
		<Link
			href={props.href}
			asChild={props.asChild}
		>
			<Pressable style={props.style}>
				{({ pressed }) => (
					<Text
						style={[
							styles.linkText,
							pressed && styles.linkTextPressed,
						]}
					>
						{props.text}
					</Text>
				)}
			</Pressable>
		</Link>
	)
}

const styles = StyleSheet.create({
	linkText: {
		color: Colors.primary,
		textDecorationStyle: 'solid',
		textDecorationLine: 'underline',
		textDecorationColor: Colors.primary,
	},
	linkTextPressed: {
		color: Colors.primaryHover,
	},
})
