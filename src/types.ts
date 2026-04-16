export type Language = 'Python' | 'C' | 'Java' | 'C++' | 'JavaScript';

export interface BuildLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface GeneratedProject {
  id: string;
  name?: string;
  category?: string;
  createdAt?: number;
  prompt: string;
  language: Language;
  code: string;
  explanation: string;
  suggestions: string;
  accuracy: number;
  uiDesign: string;
}
