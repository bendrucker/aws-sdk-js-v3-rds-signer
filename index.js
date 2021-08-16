import { HttpRequest } from '@aws-sdk/protocol-http'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Hash } from '@aws-sdk/hash-node'
import { formatUrl } from '@aws-sdk/util-format-url'

const signing = {
  service: 'rds-db',
  protocol: 'https'
}

export class Signer {
  constructor ({ credentials, hostname, port, region, username } = {}) {
    this.credentials = credentials
    this.hostname = hostname
    this.port = port
    this.region = region
    this.username = username
  }

  async getAuthToken ({
    hostname = this.hostname,
    port = this.port,
    username = this.username,
    region = this.region,
    credentials = this.credentials
  } = {}) {
    const signer = new SignatureV4({
      service: 'rds-db',
      region,
      credentials,
      sha256: Hash.bind(null, 'sha256')
    })

    const request = new HttpRequest({
      method: 'GET',
      protocol: signing.protocol,
      hostname,
      port,
      query: {
        Action: 'connect',
        DBUser: username
      },
      headers: {
        host: `${hostname}:${port}`
      }
    })

    const presigned = await signer.presign(request, {
      expiresIn: 900
    })

    return formatUrl(presigned).replace(`${request.protocol}://`, '')
  }
}
