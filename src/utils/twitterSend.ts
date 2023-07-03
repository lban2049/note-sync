import { PLATFORM_TWITTER } from "~utils/constant";
import { getNoteToPublish, removeNoteToPublish } from "~utils/noteStorage"
import axios from 'axios'

export async function twitterSend() {
  const note = await getNoteToPublish(PLATFORM_TWITTER)
  if (!note) {
    console.log('没有要发布的内容')
    return
  }

  // note 以两个换行分隔，存入数组
  const msgs = note.note.split('\n\n')

  // 判断每一条的长度，超过135个字符的，进行截取，分为两段
  const newMsgs = []
  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i].trim()

    if (msg.length == 0) {
      continue
    }

    if (msg.length > 135) {
      const msg1 = msg.substring(0, 135)
      const msg2 = msg.substring(135)
      newMsgs.push(msg1)
      newMsgs.push(msg2)
    } else {
      newMsgs.push(msg)
    }
  }

  // 在每一项后添加编号，格式为：1/3
  let newMsgs2 = []

  if (newMsgs.length > 1) {
    for (let i = 0; i < newMsgs.length; i++) {
      const msg = newMsgs[i]
      newMsgs2.push(` ${msg}
${i + 1}/${newMsgs.length}`)
    }
  } else {
    newMsgs2 = newMsgs
  }



  // 将note中的换行，替换为四个换行，以便于在twitter中分隔成多条tweet，避免超出字数限制
  const content = newMsgs2.join('\n\n\n\n')

  // 调用API发布twtter
  const now = new Date()
  const scheduleDate = new Date(now.getTime() + 1000 * 30)
  const res = await fetch('https://api.typefully.com/v1/drafts/', {
    method: 'POST',
    headers: {
      'X-API-KEY': 'Bearer t3qWUWBzJpV23lcp',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      "content": content,
      "threadify": true,
      "schedule-date": scheduleDate.toISOString()
    })
  })
  // const res = await axios.post('https://api.typefully.com/v1/drafts/', {
  //   "content": content,
  //   "threadify": true,
  //   "schedule-date": scheduleDate.toISOString()
  // }, {
  //   headers: {
  //     'X-API-KEY': 'Bearer VRnnC0kzvOna0wDS'
  //   }
  // });

  if (res.status == 200) {
    await removeNoteToPublish(note.id)
    console.log('发布成功', note.id)
  } else {
    console.log('发布失败', note.id, res.json())
  }
}