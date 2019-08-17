let _imgWrapperNode = [] // 包裹图片的父节点集合
let _imgAll = [] // 所有的image对象
let _lock = false // 上锁 每次只能点击一次
let _currentRandom = 0 // 当前变换次数
let _allRandom = 20 // 变换次数
let _timer = null // 定时器句柄
let _flag = 0 // 用于时钟的效果切换（主要是第三和第六节点效果）
let _pattern = 0 // 0 表示从网络请求， 1表示从localstorage请求
window.addEventListener('resize', throttle(setFontSize, 500, 1000))
window.addEventListener('load', () => init())
const evt_change_start = new Event('timeLineChangeStart');
window.addEventListener('timeLineChangeStart', () => timeLineChange())
const evt_change_end= new Event('timeLineChangeEnd');
window.addEventListener('timeLineChangeEnd', () => setTimeout(() => clock(), 1000))

function init() {
  document.querySelector('.el_psy_congroo').addEventListener('click', () => timeLineChangeStart())
  _imgWrapperNode = document.querySelectorAll('.img-wrapper')
  if(localStorage.getItem('ifcached') === 'yes') {
    _pattern = 1
    allImgLoad().then(() => start() )
  } else {
    _pattern = 0
    allImgLoad().then(() => {
      for (let i=0; i<_imgAll.length; ++i) {
        saveImgInLocalStorage(i, _imgAll[i])
      }
      /* 额外添加一个字段 */
      if (getImgFromLocalStorage(0)) {
        localStorage.setItem('ifcached', 'yes')
      }
      start()
    })
  }
}
function start() {
  setFontSize()
  _imgWrapperNode.forEach((item) => {
    appendNode(item, _imgAll[10].cloneNode())
  })
  timeLineChange()
}
function timeLineChangeStart() {
  clearTimeout(_timer)
  if (!_lock) {
    _currentRandom = 0
    _lock = true
    window.dispatchEvent(evt_change_start)
  }
}
function timeLineChange() {
  setTimeout(() => {
    if (_currentRandom < _allRandom) {
      timeLineChange()
      _currentRandom += 1
      _imgWrapperNode.forEach((item,idx) => {
        if (_currentRandom > _allRandom - 5 &&  idx === 0 ) {
          replaceNode(_imgWrapperNode[0],  _imgAll[Math.floor( Math.random() * 3)].cloneNode())
        }
        else if (idx !== 1) {
          replaceNode(item, _imgAll[Math.floor( Math.random() * 10)].cloneNode())
        } else {
          replaceNode(item, _imgAll[11].cloneNode())
        }
      })
    } else {
      timeLineChangeEnd()
    }
  }, (80))
}
function timeLineChangeEnd() {
  _lock = false
  window.dispatchEvent(evt_change_end)
}
function clock() {
  _timer = setTimeout(() => {
    const nowTime = new Date()
    let hour = nowTime.getHours()
    let mins = nowTime.getMinutes()
    let secs = nowTime.getSeconds()
    hour = hour >= 10 ? hour.toString() : '0' + hour
    mins = mins >= 10 ? mins.toString() : '0' + mins
    secs = secs >= 10 ? secs.toString() : '0' + secs
    const time = hour + '.' + mins + '.' + secs
    for (let i=0; i< time.length; ++i) {
      if ( time[i] !== '.') {
        replaceNode(_imgWrapperNode[i], _imgAll[time[i]].cloneNode())
      }
    }
    if ( _flag === 0 ) {
      replaceNode(_imgWrapperNode[2],  _imgAll[11].cloneNode())
      replaceNode(_imgWrapperNode[5],  _imgAll[11].cloneNode())
    } else if (_flag === 1) {
      replaceNode(_imgWrapperNode[2],  _imgAll[12].cloneNode())
      replaceNode(_imgWrapperNode[5],  _imgAll[12].cloneNode())
    }
    _flag = _flag === 0 ? 1 : 0
    clock()
  }, 1000);
}
function allImgLoad() {
  let arrPromis = []
  for (let i=0; i<13; ++i) {
    arrPromis[i] = new Promise((resolve) => {
      _imgAll[i] = new Image()
      if (_pattern === 1) {
        _imgAll[i].src = getImgFromLocalStorage(i)
      } else {
        _imgAll[i].src = './img/' + i + '.png'
      }
      _imgAll[i].addEventListener('load', function() {
        resolve()
      })
    })
  }
  return Promise.all([...arrPromis])
}
function saveImgInLocalStorage(name, img) {
  let canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  let ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  localStorage.setItem(name, canvas.toDataURL('image/png'))
}
function getImgFromLocalStorage(name) {
  return localStorage.getItem(name)
}
function appendNode(paNode, newNode) {
  paNode.appendChild(newNode)
}
function replaceNode(paNode, newNode) {
  // paNode.replaceChild(newNode, paNode.firstChild)
  // 会报错 ，但不影响执行
  // Uncaught TypeError: Failed to execute 'replaceChild' on 'Node': 
  // parameter 2 is not of type 'Node'.
  paNode.innerHTML = ''
  paNode.appendChild(newNode)
}
function throttle(fn,wait,time) {
  let previous = null //记录上一次运行的时间
  let timer = null // 定时器
  return () => {
      const now = +new Date()
      if(!previous) { 
        previous = now 
      }
      //当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
      if(now - previous > time){
          clearTimeout(timer)
          fn()
          previous = now
      } else {
          clearTimeout(timer)
          timer = setTimeout(() => fn(),wait)
      }
  }
}
function setFontSize() {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 150 ? 150 : fontSize
  html.style.fontSize = fontSize + 'px'
}