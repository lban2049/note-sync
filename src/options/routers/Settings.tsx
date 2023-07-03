import { useEffect, useState } from "react"

import { getTypefullyApiKey, setTypefullyApiKey } from "~utils/sysStorage"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")

  const initData = async () => {
    const key = (await getTypefullyApiKey()) || ""

    setApiKey(key)
  }

  useEffect(() => {
    initData()
  }, [])

  const handleApiKeyChange = async (e: any) => {
    setApiKey(e.target.value)

    await setTypefullyApiKey(e.target.value)
  }

  return (
    <div>
      <h1 className="text-2xl">配置</h1>
      <div className="mt-5">
        <h2 className="text-xl">TypeFully API Key</h2>
        <input
          value={apiKey}
          onChange={handleApiKeyChange}
          type="text"
          className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3 mt-3"
        />
      </div>
    </div>
  )
}
