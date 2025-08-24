import React, { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

import { differenceInDays } from 'date-fns'

interface User {
	id: string
	name: string
	email: string
}

interface AuthContextData {
	token: string | null
	setToken: (token: string | null) => void
	user: User | null
	setUser: (user: User | null) => void
	loading: boolean
}

const AuthContext = createContext<AuthContextData>({
	token: null,
	setToken: () => {},
	user: null,
	setUser: () => {},
	loading: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setTokenState] = useState<string | null>(null)
	const [user, setUserState] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	const setToken = async (newToken: string | null) => {
		setTokenState(newToken)

		if (newToken) {
			await SecureStore.setItemAsync('token', newToken)
			await SecureStore.setItemAsync(
				'token_verified_at',
				new Date().toISOString()
			)
		} else {
			await SecureStore.deleteItemAsync('token')
			await SecureStore.deleteItemAsync('token_verified_at')
		}
	}

	const setUser = async (newUser: User | null) => {
		setUserState(newUser)

		if (newUser) {
			await SecureStore.setItemAsync('user', JSON.stringify(newUser))
		} else {
			await SecureStore.deleteItemAsync('user')
		}
	}

	useEffect(() => {
		const loadAuthData = async () => {
			setLoading(true)

			const storedToken = await SecureStore.getItemAsync('token')
			const tokenVerifiedAt = await SecureStore.getItemAsync(
				'token_verified_at'
			)

			const storedUser = await SecureStore.getItemAsync('user')

			if (!storedToken || !storedUser) {
				setLoading(false)

				return
			}

			if (tokenVerifiedAt) {
				let verifiedAt = new Date(tokenVerifiedAt)
				let now = new Date()

				const difference = differenceInDays(verifiedAt, now)
				// console.log('verifiedAt', verifiedAt)
				// console.log('now', now)
				// console.log('difference', difference)
			}

			setToken(storedToken)
			setUser(JSON.parse(storedUser))

			setLoading(false)
		}

		loadAuthData()
	}, [])

	return (
		<AuthContext.Provider
			value={{ token, setToken, user, setUser, loading }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)

export const logoutContent = async () => {
	await SecureStore.deleteItemAsync('token')
	await SecureStore.deleteItemAsync('token_verified_at')
}
