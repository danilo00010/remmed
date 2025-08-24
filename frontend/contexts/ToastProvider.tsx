import Toast, {
	BaseToast,
	ErrorToast,
	ToastShowParams,
} from 'react-native-toast-message'
import React, { createContext, useContext } from 'react'
import Colors from '@/constants/Colors'

type ShowToast = (params: ToastShowParams) => void

const ToastContext = createContext<ShowToast>(() => {})

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const showToast: ShowToast = params => {
		Toast.show(params)
	}

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			<Toast
				config={{
					success: props => (
						<BaseToast
							{...props}
							style={{
								borderLeftColor: Colors.toastSuccess,
								borderRadius: 8,
							}}
							contentContainerStyle={{
								paddingHorizontal: 15,
								backgroundColor: Colors.toastBackground,
								borderTopRightRadius: 8,
								borderBottomRightRadius: 8,
							}}
							text1Style={{
								fontSize: 18,
								fontWeight: '400',
								color: Colors.toastTitle,
							}}
							text2Style={{
								fontSize: 14,
								color: Colors.toastText,
							}}
						/>
					),
					error: props => (
						<ErrorToast
							{...props}
							style={{
								borderLeftColor: Colors.toastError,
								borderRadius: 8,
							}}
							contentContainerStyle={{
								paddingHorizontal: 15,
								backgroundColor: Colors.toastBackground,
								borderTopRightRadius: 8,
								borderBottomRightRadius: 8,
							}}
							text1Style={{
								fontSize: 18,
								fontWeight: '400',
								color: Colors.toastTitle,
							}}
							text2Style={{
								fontSize: 14,
								color: Colors.toastText,
							}}
						/>
					),
				}}
			/>
		</ToastContext.Provider>
	)
}

export const useToast = () => useContext(ToastContext)
