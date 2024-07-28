
export class AssetConfig {
  code: CodeDto;
  webapp: WebAppDto;
}

export class CodeDto {
  id: number;
  name: string;
  sca_name: string;
  apps: AppDto[];
}

export class AppDto {
  id: number;
  name: string;
  path: string;
  sca_name: string;
}

export class WebAppDto {
  id: number;
  scanType: string;
  backendUrl: string;
  openApiFilePath: string;
}
