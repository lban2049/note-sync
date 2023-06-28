import type { PlasmoCSConfig } from "plasmo"
import { PLATFORM_WEIBO } from "~utils/constant";
import { getNoteToPublish, removeNoteToPublish } from "~utils/noteStorage"
import { awaitSleep, clickAwait, selectInputText, getRandomSecond } from '~utils/content-utils'

export const config: PlasmoCSConfig = {
  matches: ["https://weibo.com/*"]
}

console.log('weiboSend')

async function doSingleSend(note: NoteTask): Promise<boolean> {
  const newMsg = note.note
  if (!selectInputText('.Form_input_2gtXx', note.note)) {
    console.log('输入信息失败')
    return false
  }

  await awaitSleep(getRandomSecond(5, 10) / 1000)
  let ret = await clickAwait('.index_box_MkWee button', getRandomSecond(10, 20) / 1000)
  if (!ret) {
    console.log('点击发布按钮失败')
    return false
  }

  await removeNoteToPublish(note.id)
  console.log('发布成功', note.id)

  return true
}

async function doSend() {
  // 从 storage 中获取待发布的笔记
  const note: NoteTask = await getNoteToPublish(PLATFORM_WEIBO);

  if (!note) {
    console.log('没有待发布的笔记')
    return
  }

  console.log('note: ', note)

  window.setTimeout(async () => {
    const ret = await doSingleSend(note)

    if (ret) {
      window.close()
    }
  }, 5000)
}

doSend();

