import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItemButton, ListItemText, TextField, Button, Stack, Divider } from "@mui/material";
import { mcpListTools, mcpCallTool } from "../api/filesystem";
import { toast } from "react-toastify";

/**
 * Page that lists MCP tools and allows executing them
 */
export default function MCPPage() {
  const [tools, setTools] = useState([]);
  const [selected, setSelected] = useState(null);
  const [argsText, setArgsText] = useState("{\n  \n}");
  const [result, setResult] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await mcpListTools();
        setTools(Array.isArray(data?.tools) ? data.tools : Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error(`Failed to load MCP tools: ${e.message}`);
      }
    })();
  }, []);

  const runTool = async () => {
    if (!selected) return;
    let args = {};
    try {
      args = JSON.parse(argsText || "{}");
    } catch {
      toast.error("Arguments must be valid JSON");
      return;
    }
    try {
      const data = await mcpCallTool({ tool_name: selected?.name || selected, args });
      setResult(JSON.stringify(data, null, 2));
      toast.success("Tool executed");
    } catch (e) {
      toast.error(`MCP call failed: ${e.message}`);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
      <Box sx={{ width: 340, borderRight: 1, borderColor: "divider", p: 2 }}>
        <Typography variant="subtitle1">MCP Tools</Typography>
        <List dense>
          {tools.map((t) => {
            const name = t?.name || t?.tool_name || String(t);
            return (
              <ListItemButton key={name} selected={selected?.name === name || selected === name} onClick={() => setSelected(t?.name ? t : { name })}>
                <ListItemText primary={name} secondary={t?.description || ""} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" noWrap>{selected?.name || "Select a tool"}</Typography>
        </Box>
        <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
          <Box sx={{ flex: 1, p: 2, borderRight: 1, borderColor: "divider", minWidth: 0, overflow: "auto" }}>
            <Typography variant="caption" color="text.secondary">Arguments (JSON)</Typography>
            <TextField
              multiline
              fullWidth
              minRows={20}
              value={argsText}
              onChange={(e) => setArgsText(e.target.value)}
              sx={{ fontFamily: "monospace" }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button variant="contained" disabled={!selected} onClick={runTool}>Run</Button>
            </Stack>
          </Box>
          <Box sx={{ flex: 1, p: 2, minWidth: 0, overflow: "auto" }}>
            <Typography variant="caption" color="text.secondary">Result</Typography>
            <Divider sx={{ mb: 1 }} />
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result}</pre>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
