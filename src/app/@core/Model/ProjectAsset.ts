export interface ProjectAsset {
  id: number;
  name: string;
  target: string;
  branch: string;
  type: 'codeProject';
  path: string;
  scope: string[];
  vulnerabilities: {
    critical: number;
    medium: number;
    low: number;
  };
}