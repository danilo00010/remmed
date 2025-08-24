import { AuthProvider } from '@/contexts/AuthProvider'
import { ToastProvider } from '@/contexts/ToastProvider'
import { StoreProvider } from '@/contexts/StoreProvider'
import { NotificationProvider } from '@/services/NotificationProvider'

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<ToastProvider>
			<AuthProvider>
				<StoreProvider>
					<NotificationProvider>{children}</NotificationProvider>
				</StoreProvider>
			</AuthProvider>
		</ToastProvider>
	)
}
