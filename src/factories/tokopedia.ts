import axios from 'axios'
import * as cheerio from 'cheerio'

const tokopediaFactory = async (url: string) => {
  const { data } = await axios.get<string>(url)

  let $ = cheerio.load(data)

  const redirectLink = $('.secondary-action').first().attr('href')

  let title: string, price: string | number, images: Array<string | undefined>

  if (redirectLink) {
    const { data: originalPageData } = await axios.get<string>(redirectLink)

    $ = cheerio.load(originalPageData)

    title = $('#pdp_comp-product_content h1').text()
    price = $('#pdp_comp-product_content .price').first().text()
    images = $('[data-testid=PDPMainImage]')
      .get()
      .map((img) => $(img).attr('src'))
  } else {
    title = $('#pdp_comp-product_content h1').text()
    price = $('#pdp_comp-product_content .price').first().text()
    images = $('[data-testid=PDPMainImage]')
      .get()
      .map((img) => $(img).attr('src'))
  }

  price = price.replace(/\D/g, '')

  return { title, price, images }
}

export default tokopediaFactory
