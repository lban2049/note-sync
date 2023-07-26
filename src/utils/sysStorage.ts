import { Storage } from "@plasmohq/storage"
import { SETTING_TYPEFULLY_API_KEY, SETTING_JIKE_GROUP, PUBLISH_CONTENT, SYS_SETTING } from "./constant"

const storage = new Storage({
  area: "sync"
})

// // 设置typefully的API Key
// export async function setTypefullyApiKey(key: string) {
//   await storage.set(SETTING_TYPEFULLY_API_KEY, key)
// }

// // 获取typefully的API Key
// export async function getTypefullyApiKey(): Promise<string> {
//   return await storage.get(SETTING_TYPEFULLY_API_KEY)
// }

// // 设置即刻的群组
// export async function setStoreJikeGroup(group: string) {
//   await storage.set(SETTING_JIKE_GROUP, group)
// }

// // 获取即刻的群组
// export async function getJikeGroup(): Promise<string> {
//   return await storage.get(SETTING_JIKE_GROUP)
// }

// 获取编写的内容
export async function getPublishContent(): Promise<Note> {
  return await storage.get(PUBLISH_CONTENT)
}

// 设置编写的内容
export async function setPublishContent(content: Note) {
  await storage.set(PUBLISH_CONTENT, content)
}

// 设置系统配置
export async function setSysSetting(setting: SysSetting) {
  await storage.set(SYS_SETTING, setting)
}

// 获取系统配置
export async function getSysSetting(): Promise<SysSetting> {
  return await storage.get(SYS_SETTING)
}