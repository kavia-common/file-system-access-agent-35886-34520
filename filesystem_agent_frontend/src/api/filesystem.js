import api from "./client";

/**
 * Filesystem and MCP API wrappers
 */

// PUBLIC_INTERFACE
export async function health() {
  /** Hit backend health endpoint. Returns status and message. */
  const { data } = await api.get("/health/");
  return data;
}

// PUBLIC_INTERFACE
export async function listDir({ path, recursive = false, include_hidden = false }) {
  /** List contents of a directory. */
  const { data } = await api.get("/fs/list/", {
    params: { path, recursive, include_hidden },
  });
  return data;
}

// PUBLIC_INTERFACE
export async function readFile({ path, offset, length, encoding = "utf-8" }) {
  /** Read file contents by path. */
  const params = { path, encoding };
  if (offset !== undefined) params.offset = offset;
  if (length !== undefined) params.length = length;
  const { data } = await api.get("/fs/read/", { params });
  return data;
}

// PUBLIC_INTERFACE
export async function writeFile({ path, content, encoding = "utf-8", append = false }) {
  /** Write content to file. */
  const { data } = await api.post("/fs/write/", { path, content, encoding, append });
  return data;
}

// PUBLIC_INTERFACE
export async function makeDir({ path, parents = true, exist_ok = true }) {
  /** Create directory. */
  const { data } = await api.post("/fs/mkdir/", { path, parents, exist_ok });
  return data;
}

// PUBLIC_INTERFACE
export async function renamePath({ path, new_name, overwrite = false }) {
  /** Rename a file or directory. */
  const { data } = await api.post("/fs/rename/", { path, new_name, overwrite });
  return data;
}

// PUBLIC_INTERFACE
export async function movePath({ src, dst, overwrite = false }) {
  /** Move a file or directory. */
  const { data } = await api.post("/fs/move/", { src, dst, overwrite });
  return data;
}

// PUBLIC_INTERFACE
export async function copyPath({ src, dst, overwrite = false }) {
  /** Copy a file or directory. */
  const { data } = await api.post("/fs/copy/", { src, dst, overwrite });
  return data;
}

// PUBLIC_INTERFACE
export async function removePath({ path, recursive = false, force = false }) {
  /** Remove file or directory. */
  const { data } = await api.post("/fs/remove/", { path, recursive, force });
  return data;
}

// PUBLIC_INTERFACE
export async function searchFiles({ path, pattern, include_hidden = false }) {
  /** Search for files using glob-like pattern. */
  const { data } = await api.get("/fs/search/", {
    params: { path, pattern, include_hidden },
  });
  return data;
}

// PUBLIC_INTERFACE
export async function mcpListTools() {
  /** List available MCP tools. */
  const { data } = await api.get("/mcp/tools/");
  return data;
}

// PUBLIC_INTERFACE
export async function mcpCallTool({ tool_name, args = {} }) {
  /** Call an MCP tool with arguments. */
  const { data } = await api.post("/mcp/call/", { tool_name, arguments: args });
  return data;
}
