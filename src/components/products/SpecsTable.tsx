interface SpecsTableProps {
  specs: Record<string, string>;
}

export function SpecsTable({ specs }: SpecsTableProps) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value], i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? "bg-surface" : "bg-bg"}
            >
              <td className="px-4 py-3 font-medium text-text-secondary capitalize">
                {key.replace(/_/g, " ")}
              </td>
              <td className="px-4 py-3 text-text">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
