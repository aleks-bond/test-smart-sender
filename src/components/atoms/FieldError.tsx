export function FieldError({ id, messages }: { id?: string; messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p id={id} role="alert" className="mt-1 text-sm text-red-600">
      {messages.join(' ')}
    </p>
  );
}
