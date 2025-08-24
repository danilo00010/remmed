import React from 'react'
import { Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export default function HeaderMenuButton() {
	const navigation = useNavigation()

	return (
		<Pressable
			onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
			style={({ pressed }) => ({
				marginRight: 15,
				opacity: pressed ? 0.5 : 1,
			})}
		>
			<Ionicons
				name="menu"
				size={24}
				color="#fff"
			/>
		</Pressable>
	)
}
