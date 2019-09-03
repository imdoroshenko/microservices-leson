import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'

export async function fetchUrlMeta(url: string) {
    const response = await fetch(url)
    const text = await response.text()
    const dom = new JSDOM(text)
    const title = dom.window.document.querySelector('title')
    const metaTitle = dom.window.document.querySelector(`meta[name='title']`) 
    const metaDescription = dom.window.document.querySelector(`meta[name='description']`)
    return {
        title: metaTitle ? metaTitle.getAttribute('content') : title ? title.textContent : '',
        description: metaDescription ? metaDescription.getAttribute('content') : '',
    }
}