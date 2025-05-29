// import { create } from 'zustand';

// interface TemplateConfigState {
//   open: boolean;
//   template: DisplayTemplate | null;
//   variables: string[];
//   variableValues: Record<string, string>;
//   previewHtml: string;
//   setConfig: (template: DisplayTemplate) => void;
//   close: () => void;
//   setVariables: (vars: string[]) => void;
//   setVariableValues: (vals: Record<string, string>) => void;
//   setPreviewHtml: (html: string) => void;
// }

// export const useTemplateConfigStore = create<TemplateConfigState>((set) => ({
//   open: false,
//   template: null,
//   variables: [],
//   variableValues: {},
//   previewHtml: '',
//   setConfig: (template) =>
//     set({
//       open: true,
//       template,
//       variables: [],
//       variableValues: {},
//       previewHtml: template.body,
//     }),
//   close: () => set({ open: false, template: null }),
//   setVariables: (vars) => set({ variables: vars }),
//   setVariableValues: (vals) => set({ variableValues: vals }),
//   setPreviewHtml: (html) => set({ previewHtml: html }),
// }));