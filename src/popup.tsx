import { useState } from "react"
import './index.css'
import { openJike, openTwitter, openWeibo } from './openPage';
import { setNoteToPublish } from "~utils/noteStorage";
import { awaitSleep } from "~utils/content-utils";

function IndexPopup() {
  const [content, setContent] = useState('')
  const [errMsg, setErrMsg] = useState('')

  // 内容修改
  const onContentChange = (e: any) => {
    setContent(e.target.value)
  }

  // 执行发布
  const doSend = async () => {
    // 检查内容是否为空
    if (content === '') {
      setErrMsg('内容不能为空')
      return
    }

    setErrMsg('');

    await setNoteToPublish(content)

    openJike();
    await awaitSleep(5000)

    openWeibo();
    await awaitSleep(5000)

    openTwitter();
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
        errMsg !== '' && (
          <div className="mt-2 text-red-500 text-sm">{errMsg}</div>
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
