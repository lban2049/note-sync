import type { PlasmoCSConfig } from "plasmo"

import { PLATFORM_JIKE } from "~utils/constant"
import {
  awaitSleep,
  clickAwait,
  getRandomSecond,
  selectInputText
} from "~utils/content-utils"
import { getNoteToPublish, removeNoteToPublish } from "~utils/noteStorage"

export const config: PlasmoCSConfig = {
  matches: ["https://web.okjike.com/*"]
}

console.log("jikeSend")

async function doSingleSend(note: NoteTask): Promise<boolean> {
  if (note.group && note.group != "") {
    let ret = await clickAwait(".eoTrMK", 3)
    if (ret == false) {
      console.log("打开圈子选择失败")
      return false
    }

    // const txts = document.getElementById('topic-search-downshift-input')
    // const tagName = note.group
    // var evt = new InputEvent('input', {
    //     inputType: 'insertText',
    //     data: tagName,
    //     dataTransfer: null,
    //     isComposing: false,
    //     bubbles: true
    // });
    // txts.value = tagName
    // txts.dispatchEvent(evt)
    selectInputText("#topic-search-downshift-input", note.group)

    await awaitSleep(10)
    // 选择圈子
    ret = await clickAwait("#topic-search-downshift-item-0", 3)
    if (!ret) {
      console.log("选择圈子失败")
      return false
    }
  }

  // 输入信息
  if (!selectInputText(".Input__StyledTextarea-sc-ld1ylk-0", note.note)) {
    console.log("输入信息失败")
    return false
  }

  await awaitSleep(getRandomSecond(5, 10) / 1000)
  let ret = await clickAwait(".bEmzFt", getRandomSecond(10, 20) / 1000)
  if (!ret) {
    console.log("点击发布按钮失败")
    return false
  }

  await removeNoteToPublish(note.id)
  console.log("发布成功", note.id)

  return true
}

async function doSend() {
  // 从 storage 中获取待发布的笔记
  const note: NoteTask = await getNoteToPublish(PLATFORM_JIKE)

  if (!note) {
    console.log("没有待发布的笔记")
    return
  }

  console.log("note: ", note)

  window.setTimeout(async () => {
    const ret = await doSingleSend(note)
    if (ret) {
      window.close()
    }
  }, 5000)
}

doSend()
