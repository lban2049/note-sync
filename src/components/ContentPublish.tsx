import * as Checkbox from "@radix-ui/react-checkbox"
import {
  CheckIcon,
  ChevronDownIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { awaitSleep, splitForTwitter } from "~utils/content-utils"
import { setNoteToPublish } from "~utils/noteStorage"
import { getJikeGroup } from "~utils/sysStorage"

export default function ContentPublish() {
  const [content, setContent] = useState("")
  const [infoMsg, setInfoMsg] = useState<AlertMsg>(null)
  const [showTwitterPreview, setShowTwitterPreview] = useState(true)
  const [msgList, setMsgList] = useState<string[]>([])
  const [jikeGroup, setJikeGroup] = useState("")
  const [jikeGroupList, setJikeGroupList] = useState<string[]>([])

  useEffect(() => {
    const initData = async () => {
      const group = (await getJikeGroup()) || ""
      const list = group.split(",")
      list.push("")
      setJikeGroupList(list)
    }

    initData()
  }, [])

  // 设置消息，5秒后自动消失
  const setAlertMsg = (msg: AlertMsg) => {
    setInfoMsg(msg)
    if (msg !== null) {
      awaitSleep(5).then(() => {
        setInfoMsg(null)
      })
    }
  }

  // 内容修改
  const onContentChange = (value: string) => {
    setContent(value)

    if (!showTwitterPreview) {
      return
    }

    if (value === "") {
      setMsgList([])
      return
    }

    const list = splitForTwitter(value)
    console.log(list)
    setMsgList(list)
  }

  // 执行发布
  const doSend = async () => {
    // 检查内容是否为空
    if (content === "") {
      setAlertMsg({
        msg: "内容不能为空",
        type: "error"
      })
      return
    }

    await setNoteToPublish({
      content,
      jikeGroup
    })

    const resp = await sendToBackground({
      name: "send",
      body: {}
    })

    console.log(resp)

    setAlertMsg({
      msg: "执行发布",
      type: "success"
    })
  }

  const msgColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const onJikeGroupChange = (value: string) => {
    console.log('group', value)
    setJikeGroup(value)
  }

  return (
    <div>
      <h2 className="text-2xl">内容发布</h2>
      <div className="mt-5 relative">
        <textarea
          className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3 focus:shadow-ar-600"
          style={{
            height: "240px"
          }}
          placeholder="请输入内容"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
        />
        <CrossCircledIcon
          className="absolute w-5 h-5 text-ar-400 right-4 bottom-3 cursor-pointer hover:text-ar-600"
          onClick={() => onContentChange("")}
        />
      </div>
      <div className="mt-5 flex items-center">
        <label className="mr-2 text-base">即刻圈子</label>
        <Select.Root value={jikeGroup} onValueChange={onJikeGroupChange}>
          <Select.Trigger className="outline-none w-48 h-10 text-center px-3 text-lg bg-ar-500 text-ar-50 rounded-md hover:bg-ar-600 flex items-center justify-between">
            <Select.Value placeholder="选择圈子">
              {jikeGroup === "" ? "选择圈子" : jikeGroup}
            </Select.Value>
            <Select.Icon>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content position="popper" className="bg-white border border-ar-400 rounded-md shadow shadow-ar-400 w-48">
              {
                jikeGroupList.map((group) => {
                  return (
                    <Select.Item className="px-5 py-2 hover:bg-ar-100" value={group}>
                      {group}
                    </Select.Item>
                  )
                })
              }
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
      {/* 显示错误消息 */}
      {infoMsg !== null && (
        <div className={`mt-2 ${msgColor(infoMsg.type)} text-sm`}>
          {infoMsg.msg}
        </div>
      )}
      <div className="mt-5 px-5">
        <button
          onClick={doSend}
          className="w-full h-10 text-center text-lg bg-ar-500 text-ar-50 rounded-md hover:bg-ar-600">
          发布
        </button>
      </div>
      <div className="mt-5 flex items-center">
        <Checkbox.Root
          className="w-6 h-6 bg-white border border-ar-400 rounded-md shadow shadow-ar-400 flex items-center justify-center hover:border-ar-600 hover:shadow-ar-600"
          checked={showTwitterPreview}
          onCheckedChange={(value) => {
            setShowTwitterPreview(value as boolean)
            onContentChange(content)
          }}
          id="c1">
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label htmlFor="c1" className="ml-2 text-base cursor-pointer">
          显示Twitter预览
        </label>
      </div>
      {showTwitterPreview && (
        <div className="mt-5 overflow-hidden">
          {msgList.map((msg, index) => (
            <div
              key={index}
              className="text-base text-gray-500 whitespace-pre-wrap border border-gray-600 mt-3 rounded-md p-1">
              {msg}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
