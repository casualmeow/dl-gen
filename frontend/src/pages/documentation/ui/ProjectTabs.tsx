import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from 'entities/components';

export function ProjectTabs() {
  return (
    <Tabs defaultValue="structure" className="mb-8">
      <TabsList>
        <TabsTrigger value="structure">Project Structure</TabsTrigger>
        <TabsTrigger value="setup">Setup</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="structure">
        <ul className="list-disc pl-6 text-lg text-muted-foreground">
          <li><b>frontend/</b> – React app (Vite, TypeScript, Tailwind CSS, shadcn/ui)</li>
          <li><b>backend/</b>, <b>backendv2/</b>, <b>backendv3/</b> – Backend services</li>
          <li><b>docker/</b> – Docker configs</li>
          <li><b>scripts/</b> – Utility scripts</li>
        </ul>
      </TabsContent>
      <TabsContent value="setup">
        <ol className="list-decimal pl-6 text-lg text-muted-foreground">
          <li>Install dependencies: <code>npm install</code> (in <b>frontend/</b> and backend folders as needed)</li>
          <li>Start the app: <code>docker compose up</code> (from the root directory)</li>
          <li>Access the frontend at <code>http://localhost:3000</code> (or as configured)</li>
        </ol>
      </TabsContent>
      <TabsContent value="features">
        <ul className="list-disc pl-6 text-lg text-muted-foreground">
          <li>User authentication (login/register, Google OAuth)</li>
          <li>Template creation, editing, and live preview (Nunjucks syntax)</li>
          <li>Template management (categories, search, export, delete)</li>
          <li>Document upload and management (PDF, DOC, DOCX)</li>
          <li>Multi-language support (English, Ukrainian)</li>
          <li>Modern UI with theme switching</li>
        </ul>
      </TabsContent>
      <TabsContent value="usage">
        <Card className="mb-4 p-4">
          <h3 className="font-semibold mb-2">Start the App</h3>
          <code>docker compose up</code>
        </Card>
        <Card className="mb-4 p-4">
          <h3 className="font-semibold mb-2">Development</h3>
          <code>npm run dev</code> (in frontend)
        </Card>
        <Card className="mb-4 p-4">
          <h3 className="font-semibold mb-2">Build for Production</h3>
          <code>npm run build</code>
        </Card>
      </TabsContent>
    </Tabs>
  );
} 