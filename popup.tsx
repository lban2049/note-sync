import { useState } from "react"
import './index.css'
import * as Tabs from '@radix-ui/react-tabs';

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      className=""
      style={{
        width: "400px",
        height: "400px",
      }}
    >
      <Tabs.Root defaultValue="1" className="flex flex-col">
        <Tabs.List aria-label="笔记同步" className="shrink-0 border-b border-jaguar-800">
          <Tabs.Trigger value="1">状态</Tabs.Trigger>
          <Tabs.Trigger value="2">记录</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="1" className="flex-1">Tab 1 content</Tabs.Content>
        <Tabs.Content value="2" className="flex-1">Tab 2 content</Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

export default IndexPopup
