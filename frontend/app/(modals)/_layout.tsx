import { router, Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function StackLayout() {
	return (
		<Stack
			screenOptions={({ navigation }) => ({
				headerShown: true,
				headerTintColor: Colors.white,
				headerStyle: {
					backgroundColor: Colors.backgroundLight,
				},
				headerShadowVisible: false,
				headerLeft: () => (
					<TouchableOpacity
						onPress={() => router.back()}
						style={{ marginRight: 16 }}
					>
						<Ionicons
							name="arrow-back"
							size={24}
							color={Colors.white}
						/>
					</TouchableOpacity>
				),
			})}
		>
			<Stack.Screen
				name="reminder/[id]"
				options={{
					title: 'Lembrete',
				}}
			/>
		</Stack>
	)
}
