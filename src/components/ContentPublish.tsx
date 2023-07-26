import * as Checkbox from "@radix-ui/react-checkbox"
import {
  CheckIcon,
  ChevronDownIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons"
import * as Select from "@radix-ui/react-select"
import { useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { awaitSleep, splitForTwitter } from "~utils/content-utils"
import { setNoteToPublish } from "~utils/noteStorage"
import {
  getPublishContent,
  getSysSetting,
  setPublishContent
} from "~utils/sysStorage"

export default function ContentPublish() {
  const [content, setContent] = useState("")
  const [infoMsg, setInfoMsg] = useState<AlertMsg>(null)
  const [showTwitterPreview, setShowTwitterPreview] = useState(true)
  const [msgList, setMsgList] = useState<string[]>([])
  const [jikeGroup, setJikeGroup] = useState("")
  const [jikeGroupList, setJikeGroupList] = useState<string[]>([])
  const [selectTags, setSelectTags] = useState<string[]>([])
  const [commonTags, setCommonTags] = useState<string[]>([])

  const isMounted = useRef(false)

  useEffect(() => {
    const initData = async () => {
      let group = ""
      let tags = ""
      // 获取保存的配置
      const setting = await getSysSetting()
      if (setting) {
        group = setting.jikeGroups
        tags = setting.commonTags
      }
      console.log('setting', setting)

      const list = group.split(",")
      setJikeGroupList(list)

      const tagList = tags.split(",")
      setCommonTags(tagList)

      console.log('list', list, 'tagList', tagList)

      // 获取上次编辑内容
      const note = await getPublishContent()
      if (note) {
        setContent(note.content || "")
        setJikeGroup(note.jikeGroup || "")
        setSelectTags(note.tags || [])

        handleTwitterPreview(note.content)
      }

      isMounted.current = true
    }

    initData()
  }, [])

  // 更新缓存
  useEffect(() => {
    const doCache = async () => {
      await cacheContent()
    }

    if (!isMounted.current) {
      return
    }

    doCache()
  }, [content, jikeGroup, selectTags])

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
  const onContentChange = async (value: string) => {
    setContent(value)

    handleTwitterPreview(value)
  }

  // 处理twitter 预览
  const handleTwitterPreview = (value) => {
    if (!showTwitterPreview) {
      return
    }

    if (value === "") {
      setMsgList([])
      return
    }

    const list = splitForTwitter(value)
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
      jikeGroup,
      tags: selectTags
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

  // 缓存编辑内容
  const cacheContent = async () => {
    await setPublishContent({
      content,
      jikeGroup,
      tags: selectTags
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
    setJikeGroup(value)
  }

  // 选择标签
  const onSelectTag = (value: string) => {
    // 将选择的标签，添加输入框中
    onContentChange(content + " #" + value)
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
        <label className="mr-2 text-base w-32">即刻圈子</label>
        <Select.Root value={jikeGroup} onValueChange={onJikeGroupChange} name="jikeGroup">
          <Select.Trigger className="outline-none w-64 h-10 text-center px-3 text-lg bg-ar-500 text-ar-50 rounded-md hover:bg-ar-600 flex items-center justify-between">
            <Select.Value placeholder="选择圈子">
              {jikeGroup === "" ? "选择圈子" : jikeGroup}
            </Select.Value>
            <Select.Icon>
              <ChevronDownIcon className="w-5 h-5 ml-2" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              className="bg-white border border-ar-400 rounded-md shadow shadow-ar-400 w-64">
              {jikeGroupList.map((group, i) => {
                return (
                  <Select.Item
                    className="px-5 py-2 hover:bg-ar-100"
                    value={group}
                    key={i}>
                    {group}
                  </Select.Item>
                )
              })}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {jikeGroup !== "" && (
          <CrossCircledIcon
            className="w-5 h-5 text-ar-500 cursor-pointer hover:text-ar-600 ml-2"
            onClick={() => onJikeGroupChange("")}
          />
        )}
      </div>
      <div className="mt-5 flex items-center">
        <label className="mr-2 text-base w-32">微博/twitter标签</label>
        {commonTags.map((tag, i) => {
          return (
            <div
              key={i}
              onClick={() => onSelectTag(tag)}
              className="px-3 py-1 border border-ar-500 text-black text-base rounded-md mr-2 flex items-center cursor-pointer bg-ar-100">
              {"#" + tag}
            </div>
          )
        })}
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
