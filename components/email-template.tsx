interface EmailTemplateProps {
  monitorName: string;
  monitorUrl: string;
  message: string;
}

export function EmailTemplate({
  monitorName,
  monitorUrl,
  message,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Hey, {monitorName}</h1>
      <h3>For Url: {monitorUrl}</h3>
      <p>{message}</p>
    </div>
  );
}
