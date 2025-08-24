import Colors from '@/constants/Colors'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Checkbox, Text } from 'react-native-paper'

export default function RememberMe(props: any) {
	const [checked, setChecked] = useState(false)

	const changeRememberMe = () => {
		props.changeRememberMe(!checked)

		setChecked(!checked)
	}

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			<Checkbox
				status={checked ? 'checked' : 'unchecked'}
				color={Colors.primary}
				onPress={changeRememberMe}
			/>
			<Text
				style={{ color: Colors.white }}
				onPress={changeRememberMe}
			>
				Lembrar-me
			</Text>
		</View>
	)
}
