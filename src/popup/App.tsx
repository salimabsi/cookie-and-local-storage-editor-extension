import { AppProvider, useAppContext } from './context/AppContext'

function AppShell() {
  const { state } = useAppContext()

  return (
    <div className="flex h-full w-full flex-col bg-gray-950 text-gray-50">
      <p className="px-4 py-3 text-sm text-gray-400">
        {state.domain || 'Cookie & Storage Editor'}
      </p>
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
