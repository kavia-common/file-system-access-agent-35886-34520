import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box } from "@mui/material";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import FileDetails from "./components/Main/FileDetails";
import SearchPage from "./pages/SearchPage";
import MCPPage from "./pages/MCPPage";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { health as healthApi } from "./api/filesystem";
import { ToastContainer, toast } from "react-toastify";

/**
 * RootShell provides the main layout: header, sidebar, main content.
 */
function ShellInner() {
  const [theme, setTheme] = useState("light");
  const [healthStatus, setHealthStatus] = useState({ ok: false, message: "Checking..." });
  const [rootPath, setRootPath] = useState("/");
  const [selected, setSelected] = useState({ path: "", meta: null });
  const navigate = useNavigate();

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const doHealth = useCallback(async () => {
    try {
      const data = await healthApi();
      const message = data?.message || "OK";
      setHealthStatus({ ok: true, message });
      // Attempt to parse base/root path hint if provided
      if (data?.base_path) {
        setRootPath(data.base_path);
      }
    } catch (e) {
      setHealthStatus({ ok: false, message: `Backend unreachable: ${e.message}` });
      toast.error(`Health check failed: ${e.message}`);
    }
  }, []);

  useEffect(() => {
    doHealth();
  }, [doHealth]);

  const onSelectPath = (path, meta) => {
    setSelected({ path, meta });
    navigate("/");
  };

  const onRefreshTree = () => {
    // Trigger sidebar to refetch by toggling root path to same value (or add a state key)
    setRootPath((p) => (p === "/" ? "/." : "/"));
    setTimeout(() => setRootPath((p) => (p === "/." ? "/" : p)), 0);
  };

  const content = useMemo(() => {
    return (
      <Routes>
        <Route path="/" element={<FileDetails selectedPath={selected.path} selectedMeta={selected.meta} onRefreshTree={onRefreshTree} />} />
        <Route path="/search" element={<SearchPage defaultRoot={rootPath} onOpenPath={onSelectPath} />} />
        <Route path="/mcp" element={<MCPPage />} />
      </Routes>
    );
  }, [selected, rootPath]);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        onRefresh={doHealth}
        healthStatus={healthStatus}
      />
      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar rootPath={rootPath} onSelectPath={onSelectPath} />
        <Box sx={{ flex: 1, minWidth: 0 }}>{content}</Box>
      </Box>
      <ToastContainer position="bottom-right" newestOnTop closeOnClick pauseOnHover />
    </Box>
  );
}

// PUBLIC_INTERFACE
export default function AppShell() {
  /** Entry shell wrapped with router. */
  return (
    <BrowserRouter>
      <ShellInner />
    </BrowserRouter>
  );
}
