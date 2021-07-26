var { app, BrowserWindow } = require("electron");

let mainWindow = null;

app.on("window-all-closed", function () {
  if (process.platform != "darwin") {
    app.quit();
    console.log(process.versions["electron"]);
  }
});

app.on("ready", function () {
  mainWindow = new BrowserWindow({ width: 1000, height: 800, webPreferences:{ nodeIntegration:true,contextIsolation: false} });

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.openDevTools();

  mainWindow.on("close", function () {
    mainWindow = null;
  });
});
