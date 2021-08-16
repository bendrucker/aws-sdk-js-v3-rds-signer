import {Credentials, CredentialProvider} from "@aws-sdk/types"

export class Signer {
  constructor(options?: Options);
  getAuthToken(options?: Options): Promise<string>;
}

export type Options = {
  credentials?: Credentials | CredentialProvider;
  hostname?: string;
  port?: number;
  region?: string;
  username?: string;
};
