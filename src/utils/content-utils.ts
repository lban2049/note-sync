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