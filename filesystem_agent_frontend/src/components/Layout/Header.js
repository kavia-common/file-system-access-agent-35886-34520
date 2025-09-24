import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip, Button } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import RefreshIcon from "@mui/icons-material/Refresh";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import { Link } from "react-router-dom";

/**
 * App header with navigation and theme toggle
 */
export default function Header({ theme, onToggleTheme, onRefresh, healthStatus }) {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6" sx={{ flex: "0 0 auto" }}>
          File System Agent
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={Link} to="/" color="inherit" size="small">Explorer</Button>
          <Button component={Link} to="/search" color="inherit" size="small">Search</Button>
          <Button component={Link} to="/mcp" color="inherit" size="small" startIcon={<IntegrationInstructionsIcon />}>
            MCP
          </Button>
        </Box>
        <Box sx={{ marginLeft: "auto", display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="caption" color={healthStatus?.ok ? "success.main" : "error.main"}>
            {healthStatus?.message || "Checking..."}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Theme">
            <IconButton onClick={onToggleTheme} size="small">
              {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
