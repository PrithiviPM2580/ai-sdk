import { tavily } from "@tavily/core"

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! })

export async function webSearch(query: string) {
  const response = await tvly.search(query, {
    maxPages: 2,
  })
  return response
}

export async function extractWebpages(urls: string[]) {
  const response = await tvly.extract(urls)

  return response
}

export async function crawlWebpages(url: string) {
  const response = await tvly.crawl(url)

  return response
}

export async function mapWebpages(url: string) {
  const response = await tvly.map(url)
  return response
}

export async function createResearchTask(query: string) {
  const response = await tvly.research(query)

  return response
}
