import { useState } from "react"
import './index.css'
import { openJike, openWeibo } from './openPage';
import { setNoteToPublish } from "~utils/noteStorage";
import { awaitSleep } from "~utils/content-utils";
import { twitterSend } from "~utils/twitterSend";
import { sendToBackground } from "@plasmohq/messaging"

function IndexPopup() {
  const [content, setContent] = useState('')
  const [infoMsg, setInfoMsg] = useState<AlertMsg>(null)

  // 设置消息，5秒后自动消失
  const setAlertMsg = (msg: AlertMsg) => {
    setInfoMsg(msg)
    if (msg !== null) {
      awaitSleep(5000).then(() => {
        setInfoMsg(null)
      })
    }
  }

  // 内容修改
  const onContentChange = (e: any) => {
    setContent(e.target.value)
  }

  // 执行发布
  const doSend = async () => {
    // 检查内容是否为空
    if (content === '') {
      setAlertMsg({
        msg: '内容不能为空',
        type: 'error'
      })
      return
    }

    await setNoteToPublish(content)

    // await twitterSend();

    // openJike();
    // openWeibo();

    const resp = await sendToBackground({
      name: 'send',
      body: {}
    })
    
    console.log(resp)


    setAlertMsg({
      msg: '执行发布',
      type: 'success'
    })
  }

  const msgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div
      className="p-5"
      style={{
        width: "400px",
      }}
    >
      <h2 className="text-2xl">内容发布</h2>
      <div className="mt-5">
        <textarea
          className="rounded-lg border border-ar-400 shadow shadow-ar-400 w-full focus:border-ar-600 outline-none text-base p-3" style={{
            height: "240px",
          }}
          placeholder="请输入内容"
          value={content}
          onChange={onContentChange}
        />
      </div>
      {/* 显示错误消息 */}
      {
        infoMsg !== null && (
          <div className={`mt-2 ${msgColor(infoMsg.type)} text-sm`}>{infoMsg.msg}</div>
        )
      }
      <div className="mt-5 px-5">
        <button
          onClick={doSend}
          className="w-full h-10 text-center text-lg bg-ar-500 text-ar-50 rounded-md hover:bg-ar-600">发布</button>
      </div>
    </div>
  )
}

export default IndexPopup
