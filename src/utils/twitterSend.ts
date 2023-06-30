import { PLATFORM_TWITTER } from "~utils/constant";
import { getNoteToPublish, removeNoteToPublish } from "~utils/noteStorage"
import axios from 'axios'

export async function twitterSend() {
  const note = await getNoteToPublish(PLATFORM_TWITTER)
  if (!note) {
    console.log('没有要发布的内容')
    return
  }

  // note 以换行分隔，存入数组
  const msgs = note.note.split('\n')

  // 将note中的换行，替换为四个换行，以便于在twitter中分隔成多条tweet，避免超出字数限制
  note.note = note.note.replace(/\n/g, '\n\n\n\n')

  // 调用API发布twtter
  const now = new Date()
  const scheduleDate = new Date(now.getTime() + 1000 * 30)
  const res = await axios.post('https://api.typefully.com/v1/drafts/', {
    "content": note.note,
    "threadify": true,
    "schedule-date": scheduleDate.toISOString()
  }, {
    headers: {
      'X-API-KEY': 'Bearer VRnnC0kzvOna0wDS'
    }
  });

  if (res.status == 200) {
    await removeNoteToPublish(note.id)
    console.log('发布成功', note.id)
  } else {
    console.log('发布失败', note.id, res.data)
  }
}