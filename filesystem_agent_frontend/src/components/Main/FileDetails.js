import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Stack, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { readFile, writeFile, renamePath, movePath, copyPath, removePath } from "../../api/filesystem";

/**
 * Displays file detail, content and actions.
 */
export default function FileDetails({ selectedPath, selectedMeta, onRefreshTree }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const isFile = selectedMeta?.type === "file";
  const isDir = selectedMeta?.type === "directory";

  useEffect(() => {
    async function fetchContent() {
      if (!selectedPath || !isFile) {
        setContent("");
        return;
      }
      try {
        setLoading(true);
        const data = await readFile({ path: selectedPath, encoding: "utf-8" });
        // Backend may return { content: "..."} or string; handle both
        const text = typeof data === "string" ? data : data?.content ?? "";
        setContent(text);
      } catch (e) {
        setContent("");
        toast.error(`Read failed: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [selectedPath, isFile]);

  const ask = (label, def = "") => {
    // basic prompt helper
    // eslint-disable-next-line no-alert
    const val = prompt(label, def);
    return val || null;
  };

  const doSave = async () => {
    try {
      await writeFile({ path: selectedPath, content, encoding: "utf-8", append: false });
      toast.success("Saved");
    } catch (e) {
      toast.error(`Save failed: ${e.message}`);
    }
  };

  const doRename = async () => {
    const newName = ask("New name:");
    if (!newName) return;
    try {
      await renamePath({ path: selectedPath, new_name: newName, overwrite: false });
      toast.success("Renamed");
      onRefreshTree?.();
    } catch (e) {
      toast.error(`Rename failed: ${e.message}`);
    }
  };

  const doMove = async () => {
    const dst = ask("Move to (full path):");
    if (!dst) return;
    try {
      await movePath({ src: selectedPath, dst, overwrite: false });
      toast.success("Moved");
      onRefreshTree?.();
    } catch (e) {
      toast.error(`Move failed: ${e.message}`);
    }
  };

  const doCopy = async () => {
    const dst = ask("Copy to (full path):");
    if (!dst) return;
    try {
      await copyPath({ src: selectedPath, dst, overwrite: false });
      toast.success("Copied");
      onRefreshTree?.();
    } catch (e) {
      toast.error(`Copy failed: ${e.message}`);
    }
  };

  const doDelete = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete ${selectedPath}?`)) return;
    try {
      await removePath({ path: selectedPath, recursive: true, force: true });
      toast.success("Deleted");
      onRefreshTree?.();
    } catch (e) {
      toast.error(`Delete failed: ${e.message}`);
    }
  };

  if (!selectedPath) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" color="text.secondary">Select a file or folder to see details</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }} noWrap>{selectedPath}</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={doRename}>Rename</Button>
          <Button size="small" variant="outlined" onClick={doMove}>Move</Button>
          <Button size="small" variant="outlined" onClick={doCopy}>Copy</Button>
          <Button size="small" variant="outlined" color="error" onClick={doDelete}>Delete</Button>
        </Stack>
      </Box>
      <Box sx={{ flex: 1, overflow: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {isFile ? (
          <>
            <Typography variant="caption" color="text.secondary">Preview (editable)</Typography>
            <TextField
              multiline
              minRows={20}
              maxRows={50}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              sx={{ fontFamily: "monospace" }}
            />
            <Divider />
            <Box>
              <Button variant="contained" onClick={doSave} disabled={loading}>Save</Button>
            </Box>
          </>
        ) : isDir ? (
          <Typography variant="body2" color="text.secondary">Directory selected. Use actions above or select a file to preview.</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">Unknown item type.</Typography>
        )}
      </Box>
    </Box>
  );
}
