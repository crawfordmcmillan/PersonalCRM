import { Routes, Route, Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { CommandPalette } from '@/components/layout/command-palette'
import { DashboardPage } from '@/pages/dashboard'
import { ContactsPage } from '@/pages/contacts'
import { ContactDetailPage } from '@/pages/contact-detail'
import { ContactFormPage } from '@/pages/contact-form'
import { SettingsPage } from '@/pages/settings'
import { ActivityPage } from '@/pages/activity'

function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <CommandPalette />
      <main className="pl-60">
        <Outlet />
      </main>
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contacts/new" element={<ContactFormPage />} />
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
        <Route path="/contacts/:id/edit" element={<ContactFormPage />} />
        <Route path="/interactions" element={<ActivityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
