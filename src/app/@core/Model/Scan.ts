export class Scan {
  id: number;
  inserted: Date;
  triggerer: string;
  type: string;
  branch: string;
  commitId: string;
  vulnCrit: number;
  vulnMedium: number;
  vulnLow: number;
}
