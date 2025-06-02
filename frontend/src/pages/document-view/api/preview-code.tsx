import React, { useState, useEffect } from 'react';
import katex from 'katex';
import mermaid from 'mermaid';

export interface PreviewCodeProps {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
    node?: any; // ReactMarkdown provides this
    // getCodeString: (children: any[]) => string; // This prop is removed
}

export const PreviewCode: React.FC<PreviewCodeProps> = ({
    inline,
    className = '',
    children,
    node,
    // getCodeString, // Removed from destructuring
  }) => {
    // Function to extract string from children, similar to what getCodeString might have done
    const extractStringFromChildren = (kids: any): string => {
      if (Array.isArray(kids)) {
        return kids.map(kid => {
          if (typeof kid === 'string') return kid;
          if (kid?.props?.children) return extractStringFromChildren(kid.props.children);
          return '';
        }).join('');
      }
      return String(kids || '');
    };

    const text = extractStringFromChildren(children);
    // Use node.children if available (typically for block code), otherwise use the extracted text.
    // ReactMarkdown's `node.children` usually contains the raw code string for block elements.
    const codeStr = node?.children ? extractStringFromChildren(node.children) : text;
  
    if (inline && /^\$(.+)\$$/.test(text)) {
      const expr = text.replace(/^\$(.+)\$$/, '$1');
      const html = katex.renderToString(expr, { throwOnError: false });
      return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }
  
    if (/^language-katex/.test(className.toLowerCase())) {
      const html = katex.renderToString(codeStr, { throwOnError: false });
      return <code dangerouslySetInnerHTML={{ __html: html }} />;
    }
  
    const [svg, setSvg] = useState<string>('');
    useEffect(() => {
      if (/^language-mermaid/.test(className.toLowerCase())) {
        mermaid
          .render(`mmd-${Math.random()}`, codeStr)
          .then((res) => {
            setSvg(res.svg);
          })
          .catch(() => {
            setSvg('<pre>Invalid diagram</pre>');
          });
      }
    }, [className, codeStr]);
  
    if (/^language-mermaid/.test(className.toLowerCase())) {
      return <div data-testid="mermaid-container" dangerouslySetInnerHTML={{ __html: svg }} />;
    }
  
    // For standard code blocks, ensure children are passed correctly.
    // If node.children exists and is more accurate, prefer that for rendering.
    return <code className={className}>{node?.children ? extractStringFromChildren(node.children) : children}</code>;
  };