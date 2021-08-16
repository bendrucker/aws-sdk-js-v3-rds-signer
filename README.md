# aws-sdk-js-v3-rds-signer

> An [AWS IAM database authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) token signer for RDS, implementing `RDS.Signer` for AWS SDK for JS v3

## Installing

```sh
npm install --save aws-sdk-js-v3-rds-signer
```

This package provides an [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Node.js 12.20 or later is required to `import` it.

## Usage

Construct a new `Signer`, then call `signer.getAuthToken()` to sign a token. Use the generated token as the password when connecting. A token will always be returned regardless of whether the principal is authorized to connect. If the principal is not authorized, the password will be rejected when attempting to connect to the database.

```js
import { Signer } from 'aws-sdk-js-v3-rds-signer'

const signer = new Signer({
  hostname: 'host',
  port: 5432,
  region: 'us-east-1',
  username: 'me'
})

const token = await signer.getAuthToken()
console.log(token)
// #=> host:5432/...
```

All options supported by the `Signer` constructor are also supported by the `getAuthToken` method and will override the instance options for a specific token.

## License

MIT © [Ben Drucker](http://bendrucker.me)
