import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"

import { getTypefullyApiKey, setTypefullyApiKey } from "~utils/sysStorage"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)

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
        <div className="relative mt-3">
          <input
            value={apiKey}
            onChange={handleApiKeyChange}
            type={showApiKey ? "text" : "password"}
            className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5">
            {showApiKey ? (
              <EyeNoneIcon className="w-5 h-5" onClick={() => setShowApiKey(false)} />
            ) : (
              <EyeOpenIcon className="w-5 h-5" onClick={() => setShowApiKey(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
