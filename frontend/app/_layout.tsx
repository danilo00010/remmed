import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { Slot } from 'expo-router'
import { AppProviders } from '@/AppProviders'

export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
	initialRouteName: '(home)',
}

SplashScreen.preventAutoHideAsync()

function LayoutWithAuth() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	})

	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) SplashScreen.hideAsync()
	}, [loaded])

	if (!loaded) {
		return null
	}

	return <Slot />
}

export default function RootLayout() {
	return (
		<AppProviders>
			<LayoutWithAuth />
		</AppProviders>
	)
}
