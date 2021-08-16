import * as tap from 'tap'
import { URL } from 'url'
import { Signer } from './index.js'

tap.test('Signer', async t => {
  const signer = new Signer({
    credentials: {
      accessKeyId: 'id',
      secretAccessKey: 'secret'
    },
    hostname: 'host',
    port: 5432,
    region: 'us-east-1',
    username: 'me'
  })

  const token = await signer.getAuthToken()

  t.ok(token.startsWith('host:5432'), 'protocol should be stripped')
  t.ok(token.includes('us-east-1'), 'region should be included')

  const url = new URL(`protocol://${token}`)

  t.equal(url.hostname, 'host', 'hostname should be set')
  t.equal(url.port, '5432', 'port should be set')
  t.equal(url.searchParams.get('Action'), 'connect', 'action should be connect')
  t.equal(url.searchParams.get('DBUser'), 'me', 'username should be set')
  t.equal(url.searchParams.get('X-Amz-SignedHeaders'), 'host', 'signed headers should be set')
})

tap.test('override options', async t => {
  const signer = new Signer()
  const token = await signer.getAuthToken({
    credentials: {
      accessKeyId: 'id',
      secretAccessKey: 'secret'
    },
    hostname: 'host',
    port: 5432,
    region: 'us-east-1',
    username: 'me'
  })

  t.ok(token.startsWith('host:5432'), 'protocol should be stripped')
  t.ok(token.includes('us-east-1'), 'region should be included')

  const url = new URL(`protocol://${token}`)

  t.equal(url.hostname, 'host', 'hostname should be set')
  t.equal(url.port, '5432', 'port should be set')
  t.equal(url.searchParams.get('Action'), 'connect', 'action should be connect')
  t.equal(url.searchParams.get('DBUser'), 'me', 'username should be set')
})

tap.test('default credential provider', async t => {
  const signer = new Signer({
    hostname: 'host',
    port: 5432,
    region: 'us-east-1',
    username: 'me'
  })

  try {
    process.env.AWS_ACCESS_KEY_ID = 'env_id'
    process.env.AWS_SECRET_ACCESS_KEY = 'env_secret'

    const token = await signer.getAuthToken()
    const url = new URL(`protocol://${token}`)

    t.ok(url.searchParams.get('X-Amz-Credential').startsWith('env_id'), 'should source credentials from default provider')
  } finally {
    delete process.env.AWS_ACCESS_KEY_ID
    delete process.env.AWS_SECRET_ACCESS_KEY
  }
})
