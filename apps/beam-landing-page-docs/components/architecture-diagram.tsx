export function ArchitectureDiagram() {
  return (
    <div
      aria-label="Beam architecture diagram"
      className="architectureDiagram"
      id="diagram"
    >
      <div className="diagramNode">Beam CLI</div>
      <div className="diagramLine" />
      <div className="diagramCore">Beam Core</div>
      <div className="diagramLine" />
      <div className="diagramNode">Beam MCP Server</div>
      <div className="diagramCloud">Optional Beam Cloud</div>
    </div>
  );
}
