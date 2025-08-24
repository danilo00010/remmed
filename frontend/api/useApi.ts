import axios from 'axios'
import { useAuth } from '@/contexts/AuthProvider'

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const useApi = () => {
	const { token } = useAuth()

	const api = axios.create({
		baseURL: API_URL,
		headers: {
			Authorization: token ? `Bearer ${token}` : '',
		},
	})

	return api
}
