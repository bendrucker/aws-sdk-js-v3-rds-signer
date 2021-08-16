import {expectType} from "tsd";
import {Signer} from ".";

expectType<Promise<string>>(new Signer({
  credentials: {
    accessKeyId: 'id',
    secretAccessKey: 'secret'
  },
  hostname: 'host',
  port: 5432,
  region: 'us-east-1',
  username: 'me'
}).getAuthToken());