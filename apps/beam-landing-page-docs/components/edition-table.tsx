import { editions } from "../content/business";

export function EditionTable() {
  return (
    <div className="editionTable" id="editions">
      {editions.map(([name, value]) => (
        <div className="editionRow" key={name}>
          <strong>{name}</strong>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
