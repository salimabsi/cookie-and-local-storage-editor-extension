import { useState } from 'react'
import { CookiePanel } from './components/cookies/CookiePanel'
import { IndexedDBPanel } from './components/indexeddb/IndexedDBPanel'
import { Header } from './components/layout/Header'
import { StatusBar } from './components/layout/StatusBar'
import { TabBar } from './components/layout/TabBar'
import { Toolbar } from './components/layout/Toolbar'
import { SettingsModal } from './components/shared/SettingsModal'
import { StoragePanel } from './components/storage/StoragePanel'
import { AppProvider, useAppContext } from './context/AppContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { useKeyboard } from './hooks/useKeyboard'
import { useSettings } from './hooks/useSettings'
import { buildExportData, downloadJson, exportFilename } from './utils/export.utils'

function ActivePanel() {
  const { state } = useAppContext()

  switch (state.activeTab) {
    case 'cookies':
      return <CookiePanel />
    case 'localStorage':
      return <StoragePanel area="localStorage" />
    case 'sessionStorage':
      return <StoragePanel area="sessionStorage" />
    case 'indexedDB':
      return <IndexedDBPanel />
  }
}

function AppShell() {
  const { state } = useAppContext()
  const { showToast } = useToast()
  const { popupWidth, setPopupWidth, resetPopupWidth } = useSettings()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleExport = () => {
    const data = buildExportData(state.domain, state.cookies, state.localStorage, state.sessionStorage)
    downloadJson(data, exportFilename(state.domain))
    showToast(`Exported data for ${state.domain}`)
  }

  useKeyboard({ onExport: handleExport })

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-950 text-gray-50">
      <Header onSettings={() => setSettingsOpen(true)} />
      <TabBar />
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        <ActivePanel />
      </div>
      <StatusBar />
      {settingsOpen && (
        <SettingsModal
          popupWidth={popupWidth}
          onChangeWidth={setPopupWidth}
          onResetWidth={resetPopupWidth}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </ToastProvider>
  )
}

export default App
