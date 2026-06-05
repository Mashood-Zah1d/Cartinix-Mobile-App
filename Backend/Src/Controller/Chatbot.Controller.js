import Product from '../Model/Product.Model.js'
import { asyncFuction } from '../Utils/asyncFunction.js'
import apiError from '../Utils/apiError.js'
import apiResponse from '../Utils/apiResponse.js'
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

export const chatbot = asyncFuction(async (req, res) => {
    const { message } = req.body

    if (!message || message.trim() === "") {
        throw new apiError(400, "Message is required")
    }

    const filterResponse = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "system",
            content: "Sirf valid JSON return karo. Kuch aur mat likho."
        }, {
            role: "user",
            content: `
User ne yeh pucha: "${message}"
Yeh JSON banao:
{
  "brand": "brand name ya null",
  "maxPrice": number ya null,
  "minPrice": number ya null,
  "keyword": "koi specific word ya null"
}

Rules:
- "high quality" "premium" "luxury" "best" Means minPrice: 7000 
- "budget" "sasta" "cheap" Means maxPrice: 5000 
- "mid range" Means minPrice: 4000 aur maxPrice: 8000 
            `
        }]
    })

    let filters = {}
    try {
        const raw = filterResponse.choices[0].message.content
        const cleaned = raw.replace(/```json|```/g, "").trim()
        filters = JSON.parse(cleaned)
    } catch {
        filters = {}
    }

    let query = {}

    if (filters.brand) {
        query.brand = { $regex: filters.brand, $options: "i" }
    }
    if (filters.maxPrice) {
        query.price = { ...query.price, $lte: filters.maxPrice }
    }
    if (filters.minPrice) {
        query.price = { ...query.price, $gte: filters.minPrice }
    }
    if (filters.keyword) {
        query.$or = [
            { title:       { $regex: filters.keyword, $options: "i" } },
            { description: { $regex: filters.keyword, $options: "i" } },
        ]
    }

    const products = await Product.find(query).limit(5)

    const context = products.length > 0
        ? products.map(p =>
            `- ${p.brand} | ${p.title} | Rs.${p.price} | ${p.description}`
          ).join("\n")
        : "Koi product nahi mila."

    const finalResponse = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{
            role: "system",
            content: `
You are Cartinix Watch Store's helpful assistant.

Answer only using the provided product information.
Do not make up, assume, or invent any details that are not available in the product data.

Keep responses short, friendly, and professiona
            `
        }, {
            role: "user",
            content: `
Products:
${context}

User ka sawal: "${message}"
            `
        }]
    })

    const answer = finalResponse.choices[0].message.content

    return res.status(200).json(
        new apiResponse(200, { answer, products }, "Chatbot Response")
    )
})