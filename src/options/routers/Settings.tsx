import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { useEffect, useRef, useState } from "react"

import {
  setSysSetting,
  getSysSetting,
} from "~utils/sysStorage"

export default function Settings() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [jikeGroup, setJikeGroup] = useState("")
  const [commonTags, setCommonTags] = useState("")

  const isMounted = useRef(false)
  const darkMode = useRef(false)

  const initData = async () => {
    // 获取保存的配置
    const setting = await getSysSetting()
    if (setting) {
      if (setting.typefullyApiKey !== undefined) {
        setApiKey(setting.typefullyApiKey)
      }

      if (setting.jikeGroups !== undefined) {
        setJikeGroup(setting.jikeGroups)
      }

      if (setting.commonTags !== undefined) {
        setCommonTags(setting.commonTags)
      }

      if (setting.darkMode !== undefined) {
        darkMode.current = setting.darkMode
      }
    }

    isMounted.current = true
  }

  useEffect(() => {
    initData()
  }, [])

  // 更新配置
  useEffect(() => {
    const doCache = async () => {
      await setSysSetting({
        typefullyApiKey: apiKey,
        jikeGroups: jikeGroup,
        commonTags: commonTags,
        darkMode: darkMode.current
      })
    }

    if (!isMounted.current) {
      return
    }

    doCache()
  }, [apiKey, jikeGroup, commonTags])

  const handleApiKeyChange = (e: any) => {
    setApiKey(e.target.value)
  }

  const handleJikeGroupChange = (e: any) => {
    setJikeGroup(e.target.value)
  }

  const handleCommonTagsChange = (e: any) => {
    setCommonTags(e.target.value)
  }

  return (
    <div className="pb-2">
      <h1 className="text-2xl">配置</h1>
      <div className="mt-5">
        <h2 className="text-xl">TypeFully API Key</h2>
        <div className="relative mt-3">
          <input
            value={apiKey}
            onChange={handleApiKeyChange}
            type={showApiKey ? "text" : "password"}
            className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:focus:border-ar-400 dark:focus:shadow-ar-400"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5">
            {showApiKey ? (
              <EyeNoneIcon
                className="w-5 h-5"
                onClick={() => setShowApiKey(false)}
              />
            ) : (
              <EyeOpenIcon
                className="w-5 h-5"
                onClick={() => setShowApiKey(true)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-xl">常用即刻圈子</h2>
        <div className="relative mt-3">
          <input
            value={jikeGroup}
            onChange={handleJikeGroupChange}
            type="text"
            placeholder="输入多个以英文逗号分隔"
            className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:focus:border-ar-400 dark:focus:shadow-ar-400"
          />
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-xl">常用标签</h2>
        <div className="relative mt-3">
          <input
            value={commonTags}
            onChange={handleCommonTagsChange}
            type="text"
            placeholder="输入多个以英文逗号分隔"
            className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:focus:border-ar-400 dark:focus:shadow-ar-400"
          />
        </div>
      </div>
    </div>
  )
}
