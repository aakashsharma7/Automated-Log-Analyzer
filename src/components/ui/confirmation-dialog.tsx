'use client'

import * as React from "react"
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { Button } from "./button"
import { Modal, ModalContent, ModalFooter } from "./modal"
import { cn } from "@/lib/utils"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "warning" | "danger" | "info" | "success"
  variant?: "default" | "glass" | "frosted" | "crystal" | "aurora"
  isLoading?: boolean
}

const typeConfig = {
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-400",
    confirmVariant: "warning" as const,
    confirmColor: "bg-yellow-500 hover:bg-yellow-600"
  },
  danger: {
    icon: XCircle,
    iconColor: "text-red-400",
    confirmVariant: "destructive" as const,
    confirmColor: "bg-red-500 hover:bg-red-600"
  },
  info: {
    icon: Info,
    iconColor: "text-blue-400",
    confirmVariant: "default" as const,
    confirmColor: "bg-blue-500 hover:bg-blue-600"
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-400",
    confirmVariant: "success" as const,
    confirmColor: "bg-green-500 hover:bg-green-600"
  }
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  variant = "default",
  isLoading = false
}: ConfirmationDialogProps) {
  const config = typeConfig[type]
  const Icon = config.icon

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      variant={variant}
      showCloseButton={false}
      closeOnOverlayClick={!isLoading}
    >
      <ModalContent>
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
            "bg-opacity-20 backdrop-blur-sm",
            type === "warning" && "bg-yellow-500/20",
            type === "danger" && "bg-red-500/20", 
            type === "info" && "bg-blue-500/20",
            type === "success" && "bg-green-500/20"
          )}>
            <Icon className={cn("w-6 h-6", config.iconColor)} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white font-outfit mb-2">
              {title}
            </h3>
            <p className="text-slate-300 font-poppins leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </ModalContent>
      
      <ModalFooter>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="hover-soft-scale"
        >
          {cancelText}
        </Button>
        <Button
          variant={config.confirmVariant}
          onClick={handleConfirm}
          disabled={isLoading}
          className="hover-soft-scale"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

// Hook for easy confirmation dialogs
export function useConfirmation() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean
    props: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>
  }>({
    isOpen: false,
    props: {
      title: '',
      message: '',
      onConfirm: () => {},
    }
  })

  const confirm = React.useCallback((
    props: Omit<ConfirmationDialogProps, 'isOpen' | 'onClose'>
  ) => {
    return new Promise<boolean>((resolve) => {
      setDialog({
        isOpen: true,
        props: {
          ...props,
          onConfirm: () => {
            props.onConfirm()
            resolve(true)
          }
        }
      })
    })
  }, [])

  const close = React.useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    confirm,
    close,
    ConfirmationDialog: (
      <ConfirmationDialog
        {...dialog.props}
        isOpen={dialog.isOpen}
        onClose={close}
      />
    )
  }
}
