export type Post = {
  id: string;
  type: string;
  topic?: string | null;
  title: string;
  slug: string;
  summary?: string | null;
  body?: string | null;
  author_name: string;
  tags?: string[] | null;
  metadata?: Record<string, string | number> | null;
  licensable?: boolean;
  curated?: boolean;
  source_url?: string | null;
  featured?: boolean;
  created_at: string;
};