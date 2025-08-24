import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import Drawer from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Image, StyleSheet, Text, View } from 'react-native'

export default () => {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Drawer
				initialRouteName="home"
				screenOptions={{
					drawerPosition: 'right',
					headerTitle: () => (
						<View style={styles.logoIcon}>
							<Image
								source={require('@/assets/images/pill_3_lighter.png')}
								style={{ width: 24, height: 24 }}
								resizeMode="contain"
							/>
							<Text style={styles.logoName}>RemMed</Text>
						</View>
					),
					headerTintColor: Colors.white,
					drawerStyle: {
						backgroundColor: Colors.background,
						width: 240,
					},
					headerStyle: {
						backgroundColor: Colors.backgroundLight,
						elevation: 0,
						shadowOpacity: 0,
					},
					drawerActiveBackgroundColor: 'transparent',
					drawerActiveTintColor: Colors.primaryHighlight,
					drawerInactiveBackgroundColor: 'transparent',
					drawerInactiveTintColor: Colors.white,
				}}
			>
				<Drawer.Screen
					name="home"
					options={{
						drawerLabel: 'Início',
						drawerIcon: ({ color, size }) => (
							<FontAwesome
								name="home"
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Drawer.Screen
					name="profile"
					options={{
						drawerLabel: 'Conta de usuário',
						drawerIcon: ({ color, size }) => (
							<FontAwesome
								name="user"
								size={size}
								color={color}
							/>
						),
					}}
				/>
				<Drawer.Screen
					name="archiveds"
					options={{
						drawerLabel: 'Arquivados',
						drawerIcon: ({ color }) => (
							<FontAwesome
								name="archive"
								size={20}
								color={color}
							/>
						),
					}}
				/>
				<Drawer.Screen
					name="logout"
					options={{
						drawerLabel: 'Sair',
						drawerIcon: ({ color, size }) => (
							<MaterialIcons
								name="logout"
								size={size}
								color={color}
							/>
						),
					}}
				/>
			</Drawer>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	logoIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	logoName: {
		fontSize: 18,
		fontWeight: 'bold',
		color: Colors.white,
	},
})
