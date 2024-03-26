import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"

import { getSysSetting, setSysSetting } from "~utils/sysStorage"

export default function Root() {

  const [darkMode, setDarkMode] = useState(false)

  const initData = async () => {
    // 获取保存的配置
    const setting = await getSysSetting()
    if (setting) {
      if (setting.darkMode !== undefined) {
        setDarkMode(setting.darkMode)
      }
    }
  }

  useEffect(() => {
    initData()
  }, [])

  const getItemCss = ({ isActive, isPending }) => {
    let css = "text-gray-500 dark:text-slate-400 hover:text-ar-600 dark:hover:text-ar-400"
    if (isActive) {
      css = "text-ar-600 font-bold dark:text-ar-400"
    }

    // css += ' cursor-pointer';
    return css
  }

  // 切换黑暗模式
  const toggleDarkMode = async () => {
    setDarkMode(!darkMode)
    const setting = await getSysSetting()
    console.log('sysSetting', setting)
    setSysSetting({
      ...setting,
      darkMode: !darkMode
    })
  }

  useEffect(() => {
    toggleDarkModeCss()
  }, [darkMode])

  const toggleDarkModeCss = () => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div className="w-full h-full dark:bg-slate-900 dark:text-slate-400 overflow-auto">
      <div className="p-5 max-w-5xl m-auto">
        <div className="flex overflow-hidden">
          <div
            style={{
              width: 300
            }}
            className="shrink-0">
            <div className="flex items-center justify-start">
              <h1 className="text-3xl">Options</h1>
              <div className="ml-8 cursor-pointer" onClick={toggleDarkMode}>
                {darkMode ? (
                  <MoonIcon className="w-6 h-6" />
                ) : (
                  <SunIcon className="w-6 h-6" />
                )}
              </div>
            </div>
            <nav className="mt-5">
              <ul className="text-base">
                <li>
                  <NavLink className={getItemCss} to="/">
                    内容发布
                  </NavLink>
                </li>
                <li className={`mt-3`}>
                  <NavLink className={getItemCss} to="/history">
                    发布历史
                  </NavLink>
                </li>
                <li className={`mt-3`}>
                  <NavLink className={getItemCss} to="/setting">
                    配置
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex-1 pt-5 overflow-hidden min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
