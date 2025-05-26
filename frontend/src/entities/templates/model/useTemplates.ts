import { useState, useEffect } from "react";
import axios from "axios";

export interface Template {
  id: string;
  name: string;
  description: string;
  body: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Template[]>("/api/v2/templates");
        setTemplates(data);
        setError(null);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message || "Не удалось загрузить"
            : "Непредвиденная ошибка"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createTemplate = async (
    newT: Omit<Template, "id" | "created_at" | "updated_at">
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.post<Template>("/api/v2/templates", newT);
      setTemplates((prev) => [...prev, data]);
      setError(null);
      return data;
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Не удалось создать"
          : "Непредвиденная ошибка";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (id: string, upd: Partial<Template>) => {
    setLoading(true);
    try {
      const { data } = await axios.put<Template>(`/api/v2/templates/${id}`, upd);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? data : t))
      );
      setError(null);
      return data;
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Не удалось обновить"
          : "Непредвиденная ошибка";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/v2/templates/${id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Не удалось удалить"
          : "Непредвиденная ошибка";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
