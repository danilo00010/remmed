import Colors from '@/constants/Colors'
import { useToast } from '@/contexts/ToastProvider'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Test() {
	const reminder = {
		archivedAt: null,
		createdAt: '2025-07-21T22:53:26.000Z',
		deletedAt: null,
		id: 'fe1f2893-bc7e-43d8-a2fc-2d55c04d3ffa',
		interval: 240,
		name: 'Cimegripe',
		startTime: '2025-07-23T05:00:00.000Z',
		status: true,
		updatedAt: '2025-07-23T21:10:09.042Z',
		userId: 'cc9a5d89-bb8d-47af-a5da-44b7a1a28a19',
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.background,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		color: Colors.white,
	},
})
