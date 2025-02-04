if (typeof isEmbeddedPlayer !== 'undefined' && isEmbeddedPlayer()) {
  return
}
const supportedUrls = [
  'https://www.bilibili.com/video/',
  'https://www.bilibili.com/watchlater/',
  'https://www.bilibili.com/medialist/play/',
  'https://www.bilibili.com/bangumi/play/',
]
if (!supportedUrls.some(url => document.URL.startsWith(url))) {
  return
}
const playerModes = [
  {
    name: '常规',
    action: () => { }
  },
  {
    name: '宽屏',
    action: async () => {
      const { playerAgent } = await import('./player-agent')
      await playerAgent.widescreen()
    }
  },
  {
    name: '网页全屏',
    action: async () => {
      const { playerAgent } = await import('./player-agent')
      await playerAgent.webFullscreen()
    }
  },
  {
    name: '全屏',
    action: async () => {
      const { playerAgent } = await import('./player-agent')
      const video = await SpinQuery.condition(
        () => document.querySelector(playerAgent.query.video.element.selector),
        it => {
          return it !== null && it.readyState === 4 &&
            document.readyState === 'complete' && document.hasFocus()
        })
      if (video === null) {
        console.warn('[默认播放器模式] 未能应用全屏模式, 等待超时.')
        return
      }
      await playerAgent.fullscreen()
    }
  }
]
let lightOff = () => { }
let lightOn = () => { }
async function initLights () {
  const { playerAgent } = await import('./player-agent')
  if (settings.autoLightOff) {
    await SpinQuery.unsafeJquery()
    const settingsButton = await playerAgent.query.control.buttons.settings()
    if (!settingsButton) {
      return
    }
    settingsButton.mouseover().mouseout()
    const setLight = async lightOff => {
      const checkbox = await SpinQuery.select(
        '.bilibili-player-video-btn-setting-right-others-content-lightoff .bui-checkbox-input'
      )
      checkbox.checked = lightOff
      raiseEvent(checkbox, 'change')
    }
    lightOff = () => setLight(true)
    lightOn = () => setLight(false)
  }
}
async function main () {
  await initLights()
  const { playerReady } = await import('./player-ready')
  const { playerAgent } = await import('./player-agent')
  await playerReady()

  Observer.videoChange(async () => {
    // if (!autoPlay) {
    //   video.addEventListener('play', lightOff, { once: true })
    // } else {
    //   lightOff()
    // }
    const video = await playerAgent.query.video.element()
    if (!video) {
      return
    }
    if (autoPlay) {
      lightOff()
    }
    video.addEventListener('ended', lightOn)
    video.addEventListener('pause', lightOn)
    video.addEventListener('play', lightOff)
  })

  const video = await playerAgent.query.video.element()
  if (!video) {
    return
  }
  const info = playerModes.find(it => it.name === settings.defaultPlayerMode)
  const onplay = async () => {
    const isNormalMode = !dq('body[class*=player-mode-]')
    if (info && isNormalMode) {
      info.action()
    }
  }
  const autoPlay = _.get(JSON.parse(localStorage.getItem('bilibili_player_settings')), 'video_status.autoplay', false)
  if (settings.applyPlayerModeOnPlay && !autoPlay) {
    video.addEventListener('play', onplay, { once: true })
  } else {
    onplay()
  }
}
main()
