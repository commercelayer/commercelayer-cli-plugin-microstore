import { clApi, clConfig } from '@commercelayer/cli-core'
import type { ChildProcess } from 'child_process'
import open from 'open'


export type MicrostoreLanguage = 'en' | 'it'


type MicrostoreOptions = {
  all: boolean,
  lang: MicrostoreLanguage
} & (
  {
    cart: false | undefined
  }
  |
  {
    cart: true
    inline: boolean | undefined
  }
)


export type UrlOptions = {
  staging?: boolean
  domain?: string
} & MicrostoreOptions


export type UrlType = 'sku' | 'sku-list'



const buildMicrostoreUrl = (organization: string, type: UrlType, id: string, accessToken: string, options: UrlOptions): string => {

  const subdomain = options?.staging? 'stg.' : ''
  const domain = `${subdomain}${options?.domain || clConfig.api.default_app_domain}`
  const baseUrl = clApi.baseURL('core', organization, domain)

  const path = (type === 'sku')? 'sku' : 'list'

  let microstoreUrl = `${baseUrl}/microstore/${path}/${id}?accessToken=${accessToken}`
  if (options.all) microstoreUrl += '&all=true'
  if (options.cart) microstoreUrl += '&cart=true'
  if (options.cart && options.inline) microstoreUrl += '&inline=true'

  return microstoreUrl

}


const openMicrostoreUrl = async (microstoreUrl: string): Promise<ChildProcess> => {
  return open(microstoreUrl)
}


export { buildMicrostoreUrl, openMicrostoreUrl }
