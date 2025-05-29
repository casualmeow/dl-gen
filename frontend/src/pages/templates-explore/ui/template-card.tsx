import { Clock, Code, MoreHorizontal, Copy, Eye } from 'lucide-react';

import { Badge } from 'entities/components';
import { Button } from 'entities/components';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'entities/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'entities/components';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from 'entities/components';
import { TemplatePreviewDialog } from './template-preview';
import { useToast } from '../model/useToast';
import { Edit, Download, Trash2 } from 'lucide-react';
import { useTemplates } from 'entities/templates/model/useTemplates';
import { useState } from 'react';

interface Template {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  category: string | string[];
  tags?: string[];
  previewHtml: string;
  code: string;
}

interface TemplateCardProps {
  template: Template;
  onDelete: (id: string) => void;
}

export function TemplateCard({ template, onDelete, }: TemplateCardProps) {
  const { toast } = useToast();
  const { loading, deleteTemplate } = useTemplates();
  const [openDialog, setOpenDialog] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(template.code);
    toast({
      title: 'Code copied',
      description: 'Template code copied to clipboard',
      duration: 2000,
    });
  };
  const normalizeCategory = (category: string | string[]): string => {
    if (Array.isArray(category)) {
      return category.length > 0 ? category[0].replace(/["\[\]]/g, '') : 'Uncategorized';
    }
    return category || 'Uncategorized';
  };

  const getCategoriesArray = (category: string | string[], tags?: string[]): string[] => {
    const categories: string[] = [];

    if (Array.isArray(category)) {
      categories.push(...category);
    } else if (category) {
      categories.push(category);
    }

    if (tags && Array.isArray(tags)) {
      categories.push(...tags);
    }

    return [...new Set(categories)];
  };

  const handleExport = () => {
    const blob = new Blob([template.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.njk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Template Exported',
      description: `"${template.title}.njk" has been downloaded`,
    });
  };

  const handleDelete = async () => {
    try {
      await deleteTemplate(template.id).then(() => {
        toast({
          title: 'Template Deleted',
          description: `"${template.title}" has been successfully deleted`,
        });
      });
      onDelete(template.id);
    } catch {
      toast({
        title: 'Error Deleting Template',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setOpenDialog(false);
    }
  };

  const primaryCategory = normalizeCategory(template.category);
  const allCategories = getCategoriesArray(template.category, template.tags);

  const onClickDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setTimeout(() => setOpenDialog(true), 0);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full border-border bg-sidebar">
      <TemplatePreviewDialog template={template}>
        <div className="template-preview border-b relative bg-muted/50 p-2 cursor-pointer transition-all hover:bg-muted">
          <iframe
            srcDoc={template.previewHtml}
            className="w-full h-[140px] overflow-hidden bg-background text-text border rounded shadow-sm transform scale-[0.8] mx-auto"
            sandbox="allow-scripts allow-same-origin"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="bg-primary/80 text-primary-foreground text-xs font-medium py-1.5 px-3 rounded-full flex items-center gap-1.5">
              <Eye className="h-3 w-3" />
              Preview Template
            </div>
          </div>
          <Badge variant="outline" className="absolute top-2 right-2 bg-background">
            .njk
          </Badge>
        </div>
      </TemplatePreviewDialog>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{template.title}</CardTitle>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyCode}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export as .njk
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={onClickDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that "{template.title}" will be deleted? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting…' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="secondary">{primaryCategory}</Badge>
          {allCategories.length > 1 && (
            <>
              {allCategories.slice(1, 3).map((cat, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cat}
                </Badge>
              ))}
              {allCategories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{allCategories.length - 3}
                </Badge>
              )}
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          Updated {template.updatedAt}
        </div>
        <div className="flex gap-2">
          <TemplatePreviewDialog template={template} defaultTab="code">
            <Button size="sm" variant="outline" className="gap-1">
              <Code className="h-3 w-3" />
              Source
            </Button>
          </TemplatePreviewDialog>
          <TemplatePreviewDialog template={template} defaultTab="preview">
            <Button size="sm" className="gap-1">
              <Eye className="h-3 w-3" />
              Preview
            </Button>
          </TemplatePreviewDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
