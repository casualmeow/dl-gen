import { useState } from 'react';
import { Link } from 'react-router';
import { PlusCircle, SlidersHorizontal } from 'lucide-react';
import { AppSidebar, AppSidebarProvider } from 'widgets/sidebar';
import { AppHeader } from 'widgets/header';
import { useTemplates } from 'entities/templates';
import { TemplateCard } from './template-card';
import { Button } from 'entities/components';
import { Tabs, TabsList, TabsTrigger } from 'entities/components';
import { Input } from 'entities/components';
import { Loader } from 'entities/components';
import { useEffect } from 'react';
import { generatePreviewHtml } from '../model/renderTemplatePreview'
import { ConfigModal } from './config-dialog';
import { extractTemplateVariables } from '../model/extractTemplateVaribales';

interface DisplayTemplate {
  id: string;
  name: string;
  description: string;
  body: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export function ExploreTemplatesPage() {
  const { templates, loading, error } = useTemplates();
  
  const [selectedTemplate, setSelectedTemplate] = useState<DisplayTemplate | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [_previewHtml, setPreviewHtml] = useState<string>('');
  const [_localTemplates, setLocalTemplates] = useState<DisplayTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setLocalTemplates(templates);
  }, [templates]);
  
  const categories = [
    'all',
    ...new Set(
      templates.map((t) => (t.tags && t.tags.length > 0 ? t.tags.join(', ').replace(/["\[\]]/g, '') : 'Uncategorized')),
    ),
  ];
  const filteredTemplates = _localTemplates
    .map((t) => {
      const tagsString = t.tags && t.tags.length > 0 ? t.tags.join(', ').replace(/["\[\]]/g, '') : 'Uncategorized';

      return {
        id: t.id,
        title: t.name,
        description: t.description,
        category: tagsString,
        previewHtml: generatePreviewHtml(t.body, {
          title: `Звiт`,
          content: 'З передатестаційної практики',
        }),
        code: generatePreviewHtml(t.body, {
          title: `File test`,
          content: 'З передатестаційної практики',
        }),
        updatedAt: new Date(t.updated_at).toLocaleDateString(),
      };
    })
    .filter((tpl) => {
      const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        tpl.title.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

  const handleRemove = async (id: string) => {
    setLocalTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (configOpen && selectedTemplate) {
      const vars = extractTemplateVariables(selectedTemplate.body);
      setVariables(vars);
      setVariableValues((vals) => {
        const v = { ...vals };
        vars.forEach(key => { if (!(key in v)) v[key] = ''; });
        return v;
      });
      setPreviewHtml(selectedTemplate.body);
    }
  }, [configOpen, selectedTemplate]);  
  
  function handleVariableChange(key: string, value: string) {
    setVariableValues(vals => ({ ...vals, [key]: value }));
  }
  
  function handleApply() {
    if (!selectedTemplate) return;
    const html = generatePreviewHtml(selectedTemplate.body, variableValues);
    setPreviewHtml(html);
    setConfigOpen(false);
  }

  return (
    <AppSidebarProvider>
      <AppSidebar />
      <div className="flex-1 grid grid-rows-[auto_1fr]">
        <AppHeader
          breadcrumbs={[
            { label: 'Your works', href: '/' },
            { label: 'Explore templates', href: '/templates' },
          ]}
          withBorder={true}
        />

        <div className="container mx-auto">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">HTML Templates</h1>
              <p className="text-muted-foreground mt-1">
                Browse and manage templates or create a new one.
              </p>
            </div>
            <div className="flex items-center gap-2">
            <Button variant={'secondary'}
   onClick={() => {
    // Используй именно оригинальный объект (например, из _localTemplates или templates)
    const t = _localTemplates.find(x => x.id === selectedTemplate?.id);
    if (!t) return;
    setSelectedTemplate(t);
    setVariables(extractTemplateVariables(t.body));
    setVariableValues({});
    setConfigOpen(true);
    setPreviewHtml(generatePreviewHtml(t.body, {}));
  }}
>
<SlidersHorizontal />
  Configure
</Button>
<ConfigModal
  open={configOpen}
  onOpenChange={setConfigOpen}
  variables={variables}
  values={variableValues}
  onChange={handleVariableChange}
  onApply={handleApply}
/>
              <Button asChild size="lg" className="gap-2">
                <Link to="/template/create">
                  <PlusCircle className="h-5 w-5" />
                  Create a Template
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center">
            <div className="w-full md:w-auto">
              <Tabs
                defaultValue="all"
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="w-full"
              >
                <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="w-full md:w-64">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Стани завантаження / помилки */}
          {loading && (
            <div className="container mx-auto flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          )}
          {error && (
            <div className="container mx-auto flex items-center justify-center h-64">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {/* Порожній результат */}
          {!loading && !error && filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h2 className="text-xl font-semibold">No templates found</h2>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? 'Try a different search term or category filter.'
                  : 'Get started by creating your first template.'}
              </p>
              {!searchQuery && (
                <Button asChild className="mt-4 gap-2">
                  <Link to="/template/create">
                    <PlusCircle className="h-4 w-4" />
                    Create a Template
                  </Link>
                </Button>
              )}
            </div>
          )}
          {!loading && !error && filteredTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} onDelete={handleRemove} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppSidebarProvider>
  );
}
