import { useState } from 'react'
import { CookiePanel } from './components/cookies/CookiePanel'
import { IndexedDBPanel } from './components/indexeddb/IndexedDBPanel'
import { Header } from './components/layout/Header'
import { StatusBar } from './components/layout/StatusBar'
import { TabBar } from './components/layout/TabBar'
import { Toolbar } from './components/layout/Toolbar'
import { ImportModal } from './components/shared/ImportModal'
import { StoragePanel } from './components/storage/StoragePanel'
import { cookieToInput } from './utils/cookie.utils'
import { AppProvider, useAppContext } from './context/AppContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { useKeyboard } from './hooks/useKeyboard'
import { buildExportData, downloadJson, exportFilename, type ExportData } from './utils/export.utils'

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
  const { state, cookieOps, localStorageOps, sessionStorageOps } = useAppContext()
  const { showToast } = useToast()
  const [importOpen, setImportOpen] = useState(false)

  const handleExport = () => {
    const data = buildExportData(state.domain, state.cookies, state.localStorage, state.sessionStorage)
    downloadJson(data, exportFilename(state.domain))
    showToast(`Exported data for ${state.domain}`)
  }

  const handleImport = async (data: ExportData) => {
    try {
      await Promise.all([
        ...data.cookies.map((cookie) => cookieOps.saveCookie(cookieToInput(cookie))),
        ...data.localStorage.map((entry) => localStorageOps.saveEntry(entry.key, entry.value)),
        ...data.sessionStorage.map((entry) => sessionStorageOps.saveEntry(entry.key, entry.value)),
      ])
      showToast(`Imported data for ${data.domain}`)
    } catch {
      showToast('Failed to import data', 'error')
    }
  }

  useKeyboard({ onExport: handleExport })

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-950 text-gray-50">
      <Header onExport={handleExport} onImport={() => setImportOpen(true)} />
      <TabBar />
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        <ActivePanel />
      </div>
      <StatusBar />
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} onImport={handleImport} />}
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
