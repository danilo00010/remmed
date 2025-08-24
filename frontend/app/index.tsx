import { useEffect, useRef } from 'react'
import { router, usePathname, useRootNavigationState } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '@/contexts/AuthProvider'

export default function Index() {
	const pathname = usePathname()
	const { token, loading } = useAuth()

	const rootNavigation = useRootNavigationState()

	const alreadyRedirected = useRef(false)

	const publicRoutes = [
		'/register',
		'/validate-token',
		'/password-recovery',
		'/change-password',
	]
	const isPublicRoute = publicRoutes.includes(pathname)

	useEffect(() => {
		if (loading || !rootNavigation?.key || alreadyRedirected.current) return

		if (token) {
			router.replace('/(drawer)/home')
			alreadyRedirected.current = true
		} else if (!token && !isPublicRoute) {
			router.replace('/(auth)/login')
			alreadyRedirected.current = true
		}
	}, [loading, rootNavigation?.key, token, isPublicRoute])

	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<ActivityIndicator size="large" />
		</View>
	)
}
