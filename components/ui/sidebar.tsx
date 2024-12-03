"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("bg-sidebar text-sidebar-foreground", className)} 
    {...props} 
  />
))
Sidebar.displayName = "Sidebar"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("border-b border-sidebar-border", className)} 
    {...props} 
  />
))
SidebarHeader.displayName = "SidebarHeader"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("py-2", className)} 
    {...props} 
  />
))
SidebarContent.displayName = "SidebarContent"

export const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("space-y-1 px-2", className)} 
    {...props} 
  />
))
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("", className)} 
    {...props} 
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, asChild = false, ...props }, ref) => {
    const [isRippling, setIsRippling] = React.useState(false)
    const [coords, setCoords] = React.useState({ x: -1, y: -1 })
    const Comp = asChild ? React.Fragment : "button"

    React.useEffect(() => {
      if (coords.x !== -1 && coords.y !== -1) {
        setIsRippling(true)
        setTimeout(() => setIsRippling(false), 500)
      } else {
        setIsRippling(false)
      }
    }, [coords])

    React.useEffect(() => {
      if (!isRippling) setCoords({ x: -1, y: -1 })
    }, [isRippling])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      setCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      props.onClick?.(e)
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          "group relative w-full overflow-hidden rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "active:scale-95 active:bg-sidebar-accent/90",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {isRippling && (
          <span
            className="absolute animate-ripple rounded-full bg-white/20"
            style={{
              left: coords.x,
              top: coords.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        <div className="relative z-10 flex items-center gap-3">
          {props.children}
        </div>
      </Comp>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"
