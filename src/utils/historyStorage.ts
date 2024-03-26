import { Storage } from "@plasmohq/storage"
import { PUBLISH_HISTORY } from "./constant"

const storage = new Storage({
  area: "local"
})

// 添加发布历史
export async function addHistory(note: Note) {
  const historyNotes = await getAllHistory()
  if (!historyNotes) {
    await storage.set(PUBLISH_HISTORY, { notes: [note] })
  } else {
    historyNotes.notes.unshift(note)
    await storage.set(PUBLISH_HISTORY, historyNotes)
  } 
}

// 获取发布历史
export async function getAllHistory(): Promise<HistoryNotes> {
  return await storage.get(PUBLISH_HISTORY)
}