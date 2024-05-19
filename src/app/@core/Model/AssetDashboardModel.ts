import {AssetDasboardStatModel} from './AssetDasboardStatModel';

export class AssetDashboardModel {
  assetName: string;
  target: string;
  branch: string;
  created: string;
  securityGateway: string;
  vulnerabilities: AssetDasboardStatModel;
  solvedIssues: AssetDasboardStatModel;
  timeToResolve: AssetDasboardStatModel;
  reviewedIssues: AssetDasboardStatModel;
}
