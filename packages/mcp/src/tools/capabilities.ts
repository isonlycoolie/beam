export const freeMcpCapabilities = {
  plan: "free",
  tools: [
    "get_design_context",
    "get_node_image",
    "list_assets",
    "download_assets",
    "get_file_variables",
    "list_snapshots",
    "restore_snapshot",
    "list_component_mappings",
    "compare_render",
  ],
} as const;
