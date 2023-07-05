import twitterText from 'twitter-text'


// 获取随机延迟，单位秒
export function getRandomSecond(min, max) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min
    console.log('随机' + randomNum)
    return randomNum * 1000
}

// 点击按钮等待数秒
export function clickAwait(select, sec) {
    return new Promise((rs, re) => {
        const btn = document.querySelector(select)

        if (!btn) {
            rs(false)
            return
        }

        btn.click()
        setTimeout(() => {
            rs(true)
        }, sec * 1000);
    })
}

// 模拟输入文本
export function selectInputText(select, msg) {
    const txt = document.querySelector(select)
    if (!txt) {
        return false
    }

    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: msg,
        dataTransfer: null,
        bubbles: true,
        isComposing: false
    });
    txt.value = msg
    txt.dispatchEvent(evt)
    return true
}

export function awaitSleep(sec) {
    return new Promise<void>((rs, re) => {
        setTimeout(() => {
            rs()
        }, sec * 1000);
    })
}

// 将内容分割成多条，每条不超过140个字符
export function splitForTwitter(content: string): string[] {
  // 以两个换行分隔，存入数组
  const msgs = content.split('\n\n')

  // 判断每一条的长度，超过135个字符的，进行截取，分为两段
  const newMsgs = []
  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i].trim()

    if (msg.length == 0) {
      continue
    }

    const tres = twitterText.parseTweet(msg)

    // 推文超长，或者不够拼小尾巴时，分隔为两段
    if (!tres.valid || tres.weightedLength > 276) {
      const splitIndex = tres.validRangeEnd - 5
      const msg1 = msg.substring(0, splitIndex)
      const msg2 = msg.substring(splitIndex)
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
      newMsgs2.push(`${msg}
${i + 1}/${newMsgs.length}`)
    }
  } else {
    newMsgs2 = newMsgs
  }

  return newMsgs2
}