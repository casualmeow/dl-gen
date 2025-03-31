export const ObjectInspector = <T extends Record<string, unknown>>({
  selected,
}: {
  selected: T;
}) => {
  return (
    <div className="border-t bg-zinc-900 text-green-400 font-mono p-2 h-40 overflow-auto">
      <pre>{JSON.stringify(selected, null, 2)}</pre>
    </div>
  );
};
