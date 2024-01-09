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
    console.log(JSON.stringify([
      {
        to,
        title: title,
        body: description,
        data: {
          link: link || null
        }
      }
    ]))
    try {
      await expo.sendPushNotificationsAsync([
        {
          to,
          title: title,
          body: description,
          data: {
            link: link || null
          }
        }
      ]);
    } catch (error) {
      console.error(error);
    } 
  }

  return res.status(201).end()
})

webhook.post('/bid', async (req, res) => {
  const {
    created_at,
    offer_id,
    amount,
    price,
    company,
    pax,
    cancell_return_percentage,
    direction,
    is_vcm,
    claims,
    is_mastermiles,
    is_mentoria,
    member_since,
    recommendations,
    date_of_first_join,
    number_of_communities,
  } = req.body

  try {
    await db.bid.create({
      data: {
        created_at: new Date(created_at),
        amount: Number(amount),
        cancell_return_percentage: Number(cancell_return_percentage),
        company,
        direction,
        is_vcm: Boolean(parseInt(is_vcm)),
        offer_id: Number(offer_id),
        pax: Number(pax),
        price: Number(price),
        claims: Number(claims),
        date_of_first_join: new Date(date_of_first_join),
        is_mastermiles: Boolean(parseInt(is_mastermiles)),
        is_mentoria: Boolean(parseInt(is_mentoria)),
        member_since: new Date(member_since),
        number_of_communities: Number(number_of_communities),
        recommendations: Number(recommendations)
      }
    })

    return res.status(201).end()
  } catch (e) {
    return res.status(500).json({
      message: (e as Error)?.message
    })
  }
})

webhook.delete('/bid/:offer_id', async (req, res) => {
  const offer_id = Number(req.params.offer_id)

  try {
    const bid = await db.bid.findUnique({
      where: {
        offer_id: offer_id
      }
    })

    if (!bid) {
      return res.status(204).json({
        message: 'Oferta não encontrada.'
      })
    }

    await db.bid.delete({
      where: {
        offer_id: offer_id
      }
    })

    return res.status(204).end()
  } catch (e) {
    return res.status(500).json({
      message: (e as Error)?.message
    })
  }
})

webhook.post('/bdm', async (req, res) => {
  return res.status(201).end()
})
