import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack, List, ListItemButton, ListItemText } from "@mui/material";
import { searchFiles } from "../api/filesystem";
import { toast } from "react-toastify";

/**
 * Search files by glob pattern
 */
export default function SearchPage({ defaultRoot = "/", onOpenPath }) {
  const [root, setRoot] = useState(defaultRoot);
  const [pattern, setPattern] = useState("**/*.*");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    try {
      setLoading(true);
      const data = await searchFiles({ path: root, pattern, include_hidden: false });
      setResults(Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(`Search failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, height: "calc(100vh - 64px)", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>Search</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField label="Root path" value={root} onChange={(e) => setRoot(e.target.value)} size="small" fullWidth />
        <TextField label="Pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} size="small" fullWidth />
        <Button variant="contained" onClick={doSearch} disabled={loading}>Search</Button>
      </Stack>
      <List dense>
        {results.map((r) => (
          <ListItemButton key={r.path || r} onClick={() => onOpenPath?.(r.path || r, r)}>
            <ListItemText primary={r.path || r} secondary={r.type || ""} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
