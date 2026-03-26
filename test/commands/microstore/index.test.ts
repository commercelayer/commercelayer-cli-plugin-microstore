import { runCommand } from '@oclif/test'
import { expect } from 'chai'


describe('microstore:index', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['microstore:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(15000)
})
