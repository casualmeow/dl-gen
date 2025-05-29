export function extractTemplateVariables(template: string): string[] {
    const matches = Array.from(template.matchAll(/\{\{\s*(\w+)(?:\s*\|[^}]*)?\s*\}\}/g));
    return Array.from(new Set(matches.map(m => m[1])));
  }
  