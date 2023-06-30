import type { PlasmoMessaging } from "@plasmohq/messaging"
import { openJike, openWeibo } from "~openPage"
import { twitterSend } from "~utils/twitterSend"
 
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // 执行发布
  openJike()
  openWeibo()
  await twitterSend()

  console.log('执行发布')
 
  res.send({
    msg: '执行发布',
    success: true
  })
}
 
export default handler