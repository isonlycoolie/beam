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
      <div className="not-prose my-4 flex flex-wrap gap-2">
        {spec.rules.map((rule) => (
          <code key={rule} className="rounded-md border border-[#2a2a2a] bg-white/[0.04] px-2 py-1 text-xs text-[#d4d4d4]">
            {rule}
          </code>
        ))}
      </div>
    </>
  );
}
