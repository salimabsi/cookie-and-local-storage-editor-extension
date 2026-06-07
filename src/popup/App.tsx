import { CookiePanel } from './components/cookies/CookiePanel'
import { Header } from './components/layout/Header'
import { StatusBar } from './components/layout/StatusBar'
import { TabBar } from './components/layout/TabBar'
import { Toolbar } from './components/layout/Toolbar'
import { StoragePanel } from './components/storage/StoragePanel'
import { AppProvider, useAppContext } from './context/AppContext'

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
      return (
        <div className="flex h-full items-center justify-center text-xs text-gray-500">
          IndexedDB viewer coming soon
        </div>
      )
  }
}

function AppShell() {
  return (
    <div className="flex h-full w-full flex-col bg-gray-950 text-gray-50">
      <Header />
      <TabBar />
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        <ActivePanel />
      </div>
      <StatusBar />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
