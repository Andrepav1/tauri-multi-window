import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import React, { useEffect } from "react";
import "./App.css";

const SECONDARY_WINDOW_LABEL = "window-2";

export function createWindow(label) {
  const windowConfig = {
    url: "http://localhost:3000",
    width: 300,
    height: 200,
    x: 600,
    y: 400,
    focus: false, // created window still gets focused
    visible: true,
  };

  const webviewWindow = new WebviewWindow(label, windowConfig);

  webviewWindow.once("tauri://created", function (event) {
    console.log("--- window created");

    // set focus back to main window
    appWindow.setFocus();
  });

  webviewWindow.once("tauri://error", (event) => {
    console.log("--- tauri error event", event);
  });
}

function App() {
  useEffect(() => {
    const handler = () => {
      // close secondary window
      WebviewWindow.getByLabel(SECONDARY_WINDOW_LABEL).close();
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, []);

  return (
    <div className="App">
      <input onFocus={() => createWindow(SECONDARY_WINDOW_LABEL)}></input>
    </div>
  );
}

export default App;
