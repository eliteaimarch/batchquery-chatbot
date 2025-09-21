import * as React from "react"
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"secondary"|"ghost" }
export function Button({ className="", variant="default", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    default: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
    ghost: "bg-transparent hover:bg-muted"
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
