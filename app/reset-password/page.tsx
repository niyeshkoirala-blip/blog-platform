"use client"

import { Suspense } from "react"
import ResetPasswordForm from "./reset-password-form"

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
