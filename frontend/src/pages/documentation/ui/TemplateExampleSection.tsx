import { Card, Button } from 'entities/components';

export function TemplateExampleSection() {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-2">Example: Creating a Template</h2>
      <ol className="list-decimal pl-6 text-lg text-muted-foreground mb-2">
        <li>Go to <b>Templates</b> in the sidebar.</li>
        <li>Click <Button size="sm">Create Template</Button>.</li>
        <li>Fill in the title, description, and code (Nunjucks syntax).</li>
        <li>Save and preview your template live.</li>
      </ol>
    </Card>
  );
} 