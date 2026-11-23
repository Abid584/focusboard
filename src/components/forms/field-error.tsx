export function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;

  return (
    <ul className="space-y-0.5 text-sm text-destructive" role="alert">
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  );
}
