// import { Link, LinkCreate } from '@commercelayer/sdk'
import type { RetrievableResourceType } from '@commercelayer/sdk'
import Command, { Flags } from '../../base'
import { buildMicrostoreUrl, type MicrostoreLanguage, openMicrostoreUrl, type UrlType } from '../../url'
import { clApi, clColor, clText } from '@commercelayer/cli-core'


export default class MicrostoreIndex extends Command {

  static description = 'create Microstore URLs'

  static examples = [
    '$ commercelayer microstore -S <sku-list-id>',
    '$ cl microstore -S <sku-list-id> --all --cart',
    '$ cl microstore -S <sku-list-id> --cart --inline --open',
    '$ cl microstore -K <sku-id> -l it'
  ]

  static flags = {
    ...Command.flags,
    skuListId: Flags.string({
      char: 'S',
      description: 'the sku list id',
      exclusive: ['skuId']
    }),
    skuId: Flags.string({
      char: 'K',
      description: 'the sku id'
    }),
    all: Flags.boolean({
      char: 'A',
      description: `activate the ${clColor.italic('Buy All')} button`,
      dependsOn: ['skuListId']
    }),
    cart: Flags.boolean({
      char: 'C',
      description: `activate the ${clColor.italic('Cart')} application`
    }),
    inline: Flags.boolean({
      char: 'I',
      description: `disable redirect to ${clColor.italic('Cart')} application`,
      dependsOn: ['cart']
    }),
    lang: Flags.string({
      char: 'l',
      description: 'the language used for Microstore',
      options: ['en', 'it'],
      default: 'en'
    })
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(MicrostoreIndex)

    const organization = flags.organization
    const domain = flags.domain
    const staging = flags.staging
    const accessToken = flags.accessToken

    this.checkAcessTokenData(accessToken, flags)


    const lang = (flags.lang || 'en') as MicrostoreLanguage

    const type: UrlType = flags.skuId ? 'sku' : 'sku-list'
    const id: string = flags.skuId || flags.skuListId || ''
    const label = clApi.humanizeResource(type)


    const cl = this.commercelayerInit(flags)

    // Check SKU or SKU list existence
    console.log(clText.underscorize(clText.pluralize(type)))
    await cl[clText.underscorize(clText.pluralize(type)) as RetrievableResourceType].retrieve(id).catch(() => {
      this.error(`Inexistent ${label}: ${clColor.msg.error(String(id))}`)
    })


    const microstoreUrl = buildMicrostoreUrl(organization, type, id, accessToken, {
      all: flags.all,
      lang,
      cart: flags.cart,
      inline: flags.inline,
      domain,
      staging
    })

    this.log(`\nMicrostore URL for ${label} ${clColor.api.id(id)}:\n`)
    this.log(clColor.cyanBright(microstoreUrl))
    this.log()

    if (flags.open) await openMicrostoreUrl(microstoreUrl)

  }

}
