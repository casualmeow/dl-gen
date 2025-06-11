import { Card } from 'entities/components';

export function MoreInfoSection() {
  return (
    <Card className="mb-8 p-6">
      <h2 className="text-2xl font-bold mb-2">More Information</h2>
      <p className="text-lg text-muted-foreground">See <code>README.md</code> and <code>OAUTH_README.md</code> in the root directory for more details on setup and OAuth configuration.</p>
    </Card>
  );
} 