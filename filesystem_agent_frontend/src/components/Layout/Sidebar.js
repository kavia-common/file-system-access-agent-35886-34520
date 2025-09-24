import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, TextField, IconButton, Tooltip, List, ListItemButton, ListItemText, ListItemIcon, CircularProgress } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { listDir, makeDir } from "../../api/filesystem";

/**
 * Simple file tree browser.
 * Expects backend list format: items containing { name, path, type: 'file'|'directory' }
 */
export default function Sidebar({ rootPath, onSelectPath }) {
  const [filter, setFilter] = useState("");
  const [loadingRoot, setLoadingRoot] = useState(false);
  const [tree, setTree] = useState({});
  const [expanded, setExpanded] = useState({});

  const loadDir = useCallback(
    async (path) => {
      try {
        const isRoot = path === rootPath;
        if (isRoot) setLoadingRoot(true);
        const data = await listDir({ path, recursive: false, include_hidden: false });
        setTree((prev) => ({ ...prev, [path]: data?.items || data || [] }));
      } catch (e) {
        toast.error(`Failed to load directory: ${e.message}`);
      } finally {
        setLoadingRoot(false);
      }
    },
    [rootPath]
  );

  useEffect(() => {
    loadDir(rootPath);
  }, [rootPath, loadDir]);

  const toggleExpand = async (path) => {
    const newState = !expanded[path];
    setExpanded((p) => ({ ...p, [path]: newState }));
    if (newState && !tree[path]) {
      await loadDir(path);
    }
  };

  const handleNewFolder = async () => {
    const name = prompt("New folder name:");
    if (!name) return;
    const target = rootPath.endsWith("/") ? `${rootPath}${name}` : `${rootPath}/${name}`;
    try {
      await makeDir({ path: target, parents: false, exist_ok: true });
      toast.success("Folder created");
      await loadDir(rootPath);
    } catch (e) {
      toast.error(`Create folder failed: ${e.message}`);
    }
  };

  const renderNode = (item, level = 0) => {
    const isDir = item.type === "directory";
    const isExpanded = expanded[item.path];

    // text match filter
    if (filter && !item.name.toLowerCase().includes(filter.toLowerCase())) {
      // Still show folders if any child may match: naive approach loads only opened dirs
      if (!isDir) return null;
    }

    return (
      <Box key={item.path}>
        <ListItemButton
          dense
          onClick={() => {
            if (isDir) {
              toggleExpand(item.path);
            } else {
              onSelectPath(item.path, item);
            }
          }}
          sx={{ pl: 1 + level * 2 }}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            {isDir ? (isExpanded ? <FolderOpenIcon fontSize="small" /> : <FolderIcon fontSize="small" />) : <InsertDriveFileIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ noWrap: true }} primary={item.name} />
        </ListItemButton>
        {isDir && isExpanded && (
          <Box sx={{ pl: 2 }}>
            {tree[item.path] ? (
              <List dense disablePadding>
                {(tree[item.path] || []).map((child) => renderNode(child, level + 1))}
              </List>
            ) : (
              <Box sx={{ pl: 2, py: 0.5 }}>
                <CircularProgress size={14} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    );
  };

  const rootItems = tree[rootPath] || [];

  return (
    <Box sx={{ width: 320, borderRight: 1, borderColor: "divider", height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: "divider", display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }} noWrap>
          Files
        </Typography>
        <Tooltip title="New folder">
          <IconButton size="small" onClick={handleNewFolder}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ p: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter files..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </Box>
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {loadingRoot ? (
          <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <List dense disablePadding>
            {rootItems.map((item) => renderNode(item, 0))}
          </List>
        )}
      </Box>
    </Box>
  );
}
