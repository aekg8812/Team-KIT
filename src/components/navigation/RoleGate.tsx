'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useRescue } from '@/context/RescueContext'
import type { UserRole } from '@/lib/rescue/types'

export default function RoleGate({
  role,
  children,
}: {
  role: UserRole
  children: React.ReactNode
}) {
  const router = useRouter()
  const { hydrated, userRole, isRoleSwitching, finishRoleSwitch } = useRescue()

  useEffect(() => {
    if (!hydrated) return
    if (!userRole) {
      router.replace('/role-select')
      return
    }
    if (isRoleSwitching && userRole === role) {
      finishRoleSwitch()
      return
    }
    if (!isRoleSwitching && userRole !== role) {
      router.replace(userRole === 'customer' ? '/customer/rescues' : '/store')
    }
  }, [finishRoleSwitch, hydrated, isRoleSwitching, role, router, userRole])

  if (!hydrated || !userRole) {
    return <div className="min-h-screen bg-stone-50" aria-busy="true" />
  }
  if (!isRoleSwitching && userRole !== role) return null

  return children
}
