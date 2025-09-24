import React from "react";
import "./App.css";
import AppShell from "./AppShell";

// PUBLIC_INTERFACE
function App() {
  /** Root React component; delegates to AppShell which implements the full UI. */
  return <AppShell />;
}

export default App;
