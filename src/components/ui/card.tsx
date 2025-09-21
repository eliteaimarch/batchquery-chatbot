import * as React from "react"
export function Card({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-xl border border-border bg-card text-card-foreground shadow ${className}`} {...props} />
}
export function CardHeader({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 border-b border-border ${className}`} {...props} />
}
export function CardContent({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...props} />
}
export function CardFooter({ className="", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 border-t border-border ${className}`} {...props} />
}
