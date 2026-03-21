"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-primary group-[.toaster]:border-[#DCC9A6] group-[.toaster]:shadow-lg group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-brown",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-[#F7F5E6]",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-brown",
          success: "group-[.toast]:!text-green-600 group-[.toast]:!border-green-200",
          error: "group-[.toast]:!text-red-600 group-[.toast]:!border-red-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
