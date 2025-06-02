import { AppSidebar, AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';
import { useTemplates } from 'entities/templates';
import { TemplateCard } from './card';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

interface RawTemplate {
  id: string;
  name: string;
  description: string;
  body: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export function TemplatePage() {

  const { templates: raw, loading, error } = useTemplates();
  const [templates, setTemplates] = useState<RawTemplate[]>([]);
  const { fileId } = useParams();

  useEffect(() => {
    setTemplates(raw);
  }, [raw]);

  return (
    <AppSidebarProvider>
      <AppSidebar />
      <div className="flex-1 grid grid-rows-[auto_1fr]">
        <AppHeader
          breadcrumbs={[{ label: 'Your works', href: '/' },
            { label: 'View', href: `/view/${fileId}` },
            { label: 'Choose template', href: `/view/${fileId}/template` }]}
          withBorder
        />

        <div className="container mx-auto flex flex-col gap-4 p-8">
          <h1 className="text-3xl font-bold tracking-tight">Choose template</h1>
          <p className="text-muted-foreground mt-1">
            Choose template for desired file that you created before.
          </p>

          {loading && <p>Loading templates…</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {!loading && !error && templates.length === 0 && <p>No templates available.</p>}

          {!loading && !error && templates.length > 0 && (
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              {templates.map((rawTpl) => {
                const tpl = {
                  id: rawTpl.id,
                  title: rawTpl.name,
                  description: rawTpl.description,
                  updatedAt: new Date(rawTpl.updated_at).toLocaleDateString(),
                  category: rawTpl.tags && rawTpl.tags.length > 0 ? rawTpl.tags : 'Uncategorized',
                  tags: rawTpl.tags,
                  previewHtml: rawTpl.body,
                  code: rawTpl.body,
                };
                return <TemplateCard key={tpl.id} template={tpl} />;
              })}
            </div>
          )}
        </div>
      </div>
    </AppSidebarProvider>
  );
}
