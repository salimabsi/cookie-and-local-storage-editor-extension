function extractDomain(url: string | undefined): string {
  if (!url) return ''
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

function badgeLabel(count: number): string {
  if (count === 0) return ''
  return count > 99 ? '99+' : String(count)
}

async function updateBadgeForTab(tabId: number): Promise<void> {
  const tab = await chrome.tabs.get(tabId)
  const domain = extractDomain(tab.url)

  if (!domain) {
    await chrome.action.setBadgeText({ text: '', tabId })
    return
  }

  const cookies = await chrome.cookies.getAll({ domain })
  await chrome.action.setBadgeText({ text: badgeLabel(cookies.length), tabId })
}

async function updateBadgeForActiveTab(): Promise<void> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id != null) await updateBadgeForTab(tab.id)
}

chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' })

chrome.tabs.onActivated.addListener(({ tabId }) => {
  void updateBadgeForTab(tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    void updateBadgeForTab(tabId)
  }
})

chrome.cookies.onChanged.addListener(() => {
  void updateBadgeForActiveTab()
})

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    void updateBadgeForActiveTab()
  }
})

void updateBadgeForActiveTab()
