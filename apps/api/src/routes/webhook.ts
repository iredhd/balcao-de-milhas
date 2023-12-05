import { Router } from 'express'
import { db } from '../db'

export const webhook = Router()

webhook.post('/milha-news', async (req, res) => {
  const title = req.body.title
  const link = req.body.link
  const description = req.body.description || null
  
  await db.news.create({
    data: {
      title,
      link,
      description
    }
  })

  return res.status(201).end()
})

webhook.post('/bdm', async (req, res) => {
  return res.status(201).end()
})
