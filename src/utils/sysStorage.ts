import { Storage } from "@plasmohq/storage"
import { SETTING_TYPEFULLY_API_KEY, SETTING_JIKE_GROUP } from "./constant"

const storage = new Storage({
  area: "sync"
})

// 设置typefully的API Key
export async function setTypefullyApiKey(key: string) {
  await storage.set(SETTING_TYPEFULLY_API_KEY, key)
}

// 获取typefully的API Key
export async function getTypefullyApiKey(): Promise<string> {
  return await storage.get(SETTING_TYPEFULLY_API_KEY)
}

// 设置即刻的群组
export async function setStoreJikeGroup(group: string) {
  await storage.set(SETTING_JIKE_GROUP, group)
}

// 获取即刻的群组
export async function getJikeGroup(): Promise<string> {
  return await storage.get(SETTING_JIKE_GROUP)
}