const { contextBridge } = require('electron');

// Expose a small API to the renderer process.
contextBridge.exposeInMainWorld('sampleApi', {
  ping: () => 'pong'
});
