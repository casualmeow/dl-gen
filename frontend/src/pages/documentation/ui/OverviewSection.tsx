import { Card } from 'entities/components';

export function OverviewSection() {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-2">Overview</h2>
      <p className="text-muted-foreground text-lg">
        <b>dl-gen</b> is a document generation platform for creating, managing, and using Nunjucks-based templates. It features a modern frontend, robust backend, and supports multiple document formats.
      </p>
    </Card>
  );
} 