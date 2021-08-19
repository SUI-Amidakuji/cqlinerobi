const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    show_context_menu           : (data) => {ipcRenderer.send('show_context_menu', data) },
    show_context_menu_message   : (data) => {ipcRenderer.send('show_context_menu_message', data) },

    Opacity     : (value) => {ipcRenderer.send('Opacity', value)},
    OnTop       : (boolean) => {ipcRenderer.send('OnTop', boolean)},

    PictDownload: (url, Referer, filename) => {ipcRenderer.send('PictDownload', url, Referer, filename)},

    fetch_req   : (url) => {return ipcRenderer.invoke('fetch_req', url)},
    file_exists : (filepath) => {return ipcRenderer.invoke('file_exists', filepath)},

    minimize    : () => {ipcRenderer.send('minimize') },
    close       : () => {ipcRenderer.send('close') },

    on: (key, func) => ipcRenderer.on(key, (event, arg) => func(event, arg)),
})