import React, { useState } from "react"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, Save, Eye, Code } from "lucide-react"

import { Button } from "entities/components"
import { Card, CardContent, CardHeader, CardTitle } from "entities/components"
import { Input } from "entities/components"
import { Label } from "entities/components"
import { Textarea } from "entities/components"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "entities/components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "entities/components"
import { Badge } from "entities/components"
import { useToast } from "pages/templates-explore/model/useToast"
import { Loader2 } from "lucide-react"
import { AppSidebarProvider } from "widgets/sidebar"
import { AppSidebar } from "widgets/sidebar"
import { AppHeader } from "widgets/header"
import { useTemplates } from "entities/templates"

const existingCategories = ["Blog", "E-commerce", "Email", "Admin", "Marketing", "Portfolio"]

const defaultTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ post.title }} - {{ site.name }}</title>
  <meta name="description" content="{{ post.excerpt }}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6; color: #333; background: #f8f9fa;
    }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white; padding: 60px 20px; text-align: center; margin-bottom: 40px;
    }
    .site-title { font-size: 2.5rem; font-weight: bold; margin-bottom: 10px; }
    .site-tagline { font-size: 1.1rem; opacity: 0.9; }
    .post-header { margin-bottom: 40px; }
    .post-title { 
      font-size: 2.5rem; font-weight: bold; margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .post-meta { 
      display: flex; gap: 20px; align-items: center; color: #666;
      padding: 15px 0; border-bottom: 2px solid #eee;
    }
    .author { font-weight: 600; }
    .tags { display: flex; gap: 8px; margin-top: 10px; }
    .tag { 
      background: #e3f2fd; color: #1976d2; padding: 4px 12px;
      border-radius: 20px; font-size: 0.875rem; font-weight: 500;
    }
    .featured-image { margin: 30px 0; border-radius: 12px; overflow: hidden; }
    .featured-image img { width: 100%; height: auto; display: block; }
    .post-content { 
      font-size: 1.1rem; line-height: 1.8; margin-bottom: 40px;
    }
    .post-content h2 { 
      font-size: 1.8rem; margin: 40px 0 20px; color: #2c3e50;
    }
    .post-content p { margin-bottom: 20px; }
    .post-content ul { margin: 20px 0; padding-left: 30px; }
    .post-content li { margin-bottom: 8px; }
    .author-bio {
      background: white; padding: 30px; border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 40px;
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <h1 class="site-title">{{ site.name }}</h1>
      <p class="site-tagline">{{ site.tagline }}</p>
    </div>
  </header>

  <main class="container">
    <article class="blog-post">
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <time datetime="{{ post.date | date('Y-m-d') }}">
            {{ post.date | date('F j, Y') }}
          </time>
          <span class="author">by {{ post.author.name }}</span>
        </div>
        {% if post.tags %}
          <div class="tags">
            {% for tag in post.tags %}
              <span class="tag">{{ tag }}</span>
            {% endfor %}
          </div>
        {% endif %}
      </header>
      
      {% if post.featured_image %}
        <div class="featured-image">
          <img src="{{ post.featured_image }}" alt="{{ post.title }}">
        </div>
      {% endif %}
      
      <div class="post-content">
        {{ post.content | safe }}
      </div>
    </article>

    {% if post.author %}
      <div class="author-bio">
        <h3>About {{ post.author.name }}</h3>
        <p>{{ post.author.bio }}</p>
      </div>
    {% endif %}
  </main>
</body>
</html>`

export function TemplateCreatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createTemplate, loading } = useTemplates()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    code: defaultTemplate,
  })
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = "Template title is required"
    if (!formData.description.trim()) newErrors.description = "Template description is required"
    if (!formData.category && !formData.customCategory.trim())
      newErrors.category = "Please select a category or create a new one"
    if (!formData.code.trim()) newErrors.code = "Template code is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({ title: "Validation Error", description: "Please fix the errors before saving", variant: "destructive" })
      return
    }

    const finalCategory = formData.customCategory.trim() || formData.category
    try {
      await createTemplate({
        name: formData.title,
        description: formData.description,
        body: formData.code,
        tags: [finalCategory],
      })
      toast({ title: "Template Created", description: `"${formData.title}" has been saved successfully` })
      navigate("/templates")
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    }
  }

  const generatePreviewHtml = () => {
    const previewHtml = formData.code
      .replace(/\{\{\s*pageTitle\s*\}\}/g, formData.title || "Sample Title")
      .replace(/\{\{\s*heading\s*\}\}/g, formData.title || "Sample Heading")
      .replace(/\{\{\s*subtitle\s*\}\}/g, "This is a sample subtitle")
      .replace(/\{\{\s*content\s*\|\s*safe\s*\}\}/g, "<p>This is sample content for the template preview.</p>")
      .replace(/\{%.*?%\}/g, "")
      .replace(/\{\{.*?\}\}/g, "Sample Text")

    return `
      <div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; padding: 16px; background: white; border: 1px solid #ddd;">
        ${previewHtml}
      </div>
    `
  }

  return (
    <AppSidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 grid grid-rows-[auto_1fr]">
          <AppHeader
            breadcrumbs={[
              { label: "Your works", href: "/" },
              { label: "Explore templates", href: "/templates" },
              { label: "Create template", href: "/template/create" },
            ]}
            withBorder={true}
          />
          <main className="p-8 overflow-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="icon" asChild>
                <Link to="/templates">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Template</h1>
                <p className="text-muted-foreground">Create a new Nunjucks (.njk) template</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info */}
                <Card>
                  <CardHeader><CardTitle>Template Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Template Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={errors.title ? "border-destructive" : ""}
                        placeholder="e.g., Blog Post Layout"
                      />
                      {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className={errors.description ? "border-destructive" : ""}
                        rows={3}
                        placeholder="Describe what this template is used for..."
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(v) => setFormData({ ...formData, category: v, customCategory: "" })}
                      >
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {existingCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customCategory">Or Create New Category</Label>
                      <Input
                        id="customCategory"
                        value={formData.customCategory}
                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value, category: "" })}
                        placeholder="e.g., Landing Pages"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty to use the selected category above</p>
                    </div>
                    {(formData.category || formData.customCategory) && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Selected category:</span>
                        <Badge variant="secondary">{formData.customCategory || formData.category}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card>
                  <CardHeader><CardTitle>Template Preview</CardTitle></CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "editor" | "preview")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor" className="gap-2">
                          <Code className="h-4 w-4" /> Editor
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2">
                          <Eye className="h-4 w-4" /> Preview
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="editor" className="mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">Nunjucks Template Code *</Label>
                          <Textarea
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className={`font-mono text-sm min-h-[400px] ${errors.code ? "border-destructive" : ""}`}
                            placeholder="Enter your Nunjucks template code here..."
                          />
                          {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                        </div>
                      </TabsContent>
                      <TabsContent value="preview" className="mt-4">
                        <div className="space-y-2">
                          <Label>Live Preview</Label>
                          <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px] overflow-auto">
                            {formData.code ? (
                              <iframe
                                className="w-full h-[400px] border rounded-lg"
                                srcDoc={generatePreviewHtml()}
                                sandbox="allow-scripts allow-same-origin"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                Enter template code to see preview
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
                          <div className="flex justify-between items-center pt-6 border-t">
              <Button variant="outline" asChild disabled={loading}>
                <Link to="/templates">Cancel</Link>
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("preview")}
                  disabled={loading}
                >
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
                <Button
                    type="submit"
                    className="gap-2"
                    disabled={loading}
                    >
                    {loading ? (
                        <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                        </>
                    ) : (
                        <>
                        <Save className="h-4 w-4" />
                        Save Template
                        </>
                    )}
                    </Button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </AppSidebarProvider>
  )
}
