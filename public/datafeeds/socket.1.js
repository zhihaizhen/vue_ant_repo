
  function socket(url = 'wss://ws.xt.com/websocket', options) {
    this.heartBeatTimer = null
    this.options = options
    this.messageMap = {}
    this.connState = 0
    this.socket = null
    this.url = url

    socket.prototype.doOpen = ()=> {
      if (this.connState) return
      this.connState = 1
      this.afterOpenEmit = []
      const BrowserWebSocket = window.WebSocket || window.MozWebSocket
      const socket = new BrowserWebSocket(this.url)
      socket.binaryType = 'arraybuffer'
      socket.onopen = evt => this.onOpen(evt)
      socket.onclose = evt => this.onClose(evt)
      socket.onmessage = evt => this.onMessage(evt.data)
      socket.onerror = err => this.onError(err)
      this.socket = socket
    }
    socket.prototype.onOpen = (evt)=> {
      this.connState = 2
      // this.heartBeatTimer = setInterval(this.checkHeartbeat.bind(this), 20000)
      this.onReceiver({ Event: 'open' })
    }
    socket.prototype.checkOpen = ()=> {
      return this.connState === 2
    }
    socket.prototype.onClose = ()=> {
      this.connState = 0
      if (this.connState) {
        this.onReceiver({ Event: 'close' })
      }
    }
    socket.prototype.send = (data)=> {
      this.socket.send(JSON.stringify(data))
    }
    socket.prototype.emit = (data)=> {
      return new Promise(resolve => {
        this.socket.send(JSON.stringify(data))
        this.on('message', data => {
          resolve(data)
        })
      })
    }
    socket.prototype.onMessage = (message)=> {
      try {
        const data = JSON.parse(message)
        this.onReceiver({ Event: 'message', Data: data })
      } catch (err) {
        console.error(' >> Data parsing error:', err)
      }
    }
    socket.prototype.checkHeartbeat = ()=> {
      const data = {
        cmd: 'ping',
        args: [Date.parse(new Date())]
      }
      // this.send(data)
    }
    socket.prototype.onError = (err)=> {}
    socket.prototype.onReceiver = (data)=> {
      const callback = this.messageMap[data.Event]
      if (callback) callback(data.Data)
    }
    socket.prototype.on = (name, handler)=> {
      this.messageMap[name] = handler
    }
    socket.prototype.doClose = ()=> {
      this.socket.close()
    }
    socket.prototype.destroy = ()=> {
      if (this.heartBeatTimer) {
        clearInterval(this.heartBeatTimer)
        this.heartBeatTimer = null
      }
      this.doClose()
      this.messageMap = {}
      this.connState = 0
      this.socket = null
    }

    return socket
  }
