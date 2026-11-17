import { readSpec } from "./spec";

/** Props from spec.json, so docs and agents read one source. */
export function PropsTable({ name }: { name: string }) {
  const { props } = readSpec(name);
  return (
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type and meaning</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(props).map(([prop, meaning]) => (
          <tr key={prop}>
            <td>
              <code>{prop}</code>
            </td>
            <td>{meaning}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** When to reach for it, when not to, copy limits and the rules Beam checks. */
export function AgentRules({ name }: { name: string }) {
  const spec = readSpec(name);
  return (
    <>
      <p>
        <strong>Use it for:</strong> {spec.use_when.join("; ")}.
      </p>
      <p>
        <strong>Avoid it when:</strong> {spec.avoid_when.join("; ")}.
      </p>
      {Object.entries(spec.copy).map(([part, rule]) => (
        <p key={part}>
          <strong>Copy, {part}:</strong> {rule}.
        </p>
      ))}
      {spec.a11y.length > 0 && (
        <p>
          <strong>Accessibility:</strong> {spec.a11y.join("; ")}.
        </p>
      )}
      <p>
        <strong>Checked by Beam:</strong> {spec.rules.map((rule, i) => (
          <span key={rule}>
            {i > 0 && ", "}
            <code>{rule}</code>
          </span>
        ))}
        .
      </p>
    </>
  );
}
