export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
}
