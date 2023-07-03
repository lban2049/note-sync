import { Storage } from "@plasmohq/storage"
import { PLATFORM_JIKE, PLATFORM_TWITTER, PLATFORM_WEIBO } from "./constant";
import { awaitSleep } from "./content-utils";

const storage = new Storage({
  area: "local"
})

const NOTETOPUBLISHKEY = "noteToPublish";

// 设置待发布的笔记
export const setNoteToPublish = async (note: string) => {
  // let tasks = await storage.get<Array<NoteTask>>(NOTETOPUBLISHKEY)
  // if (!tasks) {
  //   tasks = []
  // }
  let tasks = []

  tasks.push({
    id: Date.now(),
    note,
    platform: PLATFORM_JIKE
  })

  await awaitSleep(0.1)

  tasks.push({
    id: Date.now(),
    note,
    platform: PLATFORM_WEIBO
  })

  await awaitSleep(0.1)

  tasks.push({
    id: Date.now(),
    note,
    platform: PLATFORM_TWITTER
  })

  await storage.set(NOTETOPUBLISHKEY, tasks)
}

// 获取待发布的笔记
export const getNoteToPublish = async (platform: string): Promise<NoteTask> => {
  const tasks = await storage.get<Array<NoteTask>>(NOTETOPUBLISHKEY)
  if (!tasks) {
    return null;
  }

  // 获取指定平台第一个待发布的笔记
  const task = tasks.find(task => task.platform === platform)
  if (!task) {
    return null;
  }

  return task;
}

// 发布成功，删除任务
export const removeNoteToPublish = async (id: number) => {
  const tasks = await storage.get<Array<NoteTask>>(NOTETOPUBLISHKEY)
  if (!tasks) {
    return null;
  }

  const index = tasks.findIndex(task => task.id === id)
  if (index === -1) {
    return null;
  }

  tasks.splice(index, 1)

  await storage.set(NOTETOPUBLISHKEY, tasks)
}