import { PLATFORM_TWITTER } from "~utils/constant";
import { getNoteToPublish, removeNoteToPublish } from "~utils/noteStorage"
import { getTypefullyApiKey } from "./sysStorage";
import { splitForTwitter } from "./content-utils";

export async function twitterSend() {
  const apiKey = await getTypefullyApiKey()
  if (!apiKey) {
    console.log('没有设置typefully的API Key')
    return
  }

  const note = await getNoteToPublish(PLATFORM_TWITTER)
  if (!note) {
    console.log('没有要发布的内容')
    return
  }

  // 处理内容
  const newMsgs = splitForTwitter(note.note);

  // 将note中的换行，替换为四个换行，以便于在twitter中分隔成多条tweet，避免超出字数限制
  const content = newMsgs.join('\n\n\n\n')

  // 调用API发布twtter
  const now = new Date()
  const scheduleDate = new Date(now.getTime() + 1000 * 30)
  const res = await fetch('https://api.typefully.com/v1/drafts/', {
    method: 'POST',
    headers: {
      'X-API-KEY': `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "content": content,
      "threadify": true,
      "schedule-date": scheduleDate.toISOString()
    })
  })

  if (res.status == 200) {
    await removeNoteToPublish(note.id)
    console.log('发布成功', note.id)
  } else {
    console.log('发布失败', note.id, res.json())
  }
}