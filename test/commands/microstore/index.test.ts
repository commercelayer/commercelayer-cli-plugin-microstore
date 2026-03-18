
import { expect } from 'chai'
import { runCommand } from '@oclif/test'

describe('microstore:index', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['microstore:noc'])
    expect(stdout).to.contain('-= NoC =-')
  })
})
