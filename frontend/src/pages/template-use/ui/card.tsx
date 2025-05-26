import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from 'entities/components';
import { Button } from 'entities/components';

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
  onClick?: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-48 overflow-hidden">
        <iframe
          srcDoc={template.previewHtml}
          title={template.title}
          sandbox="allow-scripts allow-same-origin"
          className='w-full h-full'
        ></iframe>
      </CardContent>
      <CardFooter className="flex justify-end items-center">
        <Button variant="outline" size="sm" onClick={onClick}>
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
}
