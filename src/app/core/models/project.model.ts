  // src/app/core/models/project.model.ts
export interface ProjectLinks {
  demo?: string;
  repo?: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  tech: string[];
  links?: ProjectLinks;
  featured?: boolean;
  date?: string; // ISO string if you want sorting
}