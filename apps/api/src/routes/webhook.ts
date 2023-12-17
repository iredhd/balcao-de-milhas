import { Router } from 'express'
import { db } from '../db'
import { Expo } from 'expo-server-sdk';

export const webhook = Router()

const expo = new Expo()

webhook.post('/milha-news', async (req, res) => {
  const title = req.body.title
  const link = req.body.link
  const description = req.body.description || null
  const push = Boolean(req.body.push) || false

  await db.news.create({
    data: {
      title,
      link,
      description
    }
  })

  if (push) {
    const devices = await db.device.findMany({
      where: {
        push_token: {
          not: null
        }
      }
    })

    const to = devices.filter(item => item.push_token !== null).map(item => item.push_token as string)

    try {
      await expo.sendPushNotificationsAsync([
        {
          to,
          title: title,
          body: description
        }
      ]);
    } catch (error) {
      console.error(error);
    } 
  }

  return res.status(201).end()
})

webhook.post('/bdm', async (req, res) => {
  return res.status(201).end()
})
