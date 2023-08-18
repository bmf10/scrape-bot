import express, { Express, json, urlencoded } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import tokopediaFactory from './factories/tokopedia'
import { Joi, schema, validate } from 'express-validation'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8000

app.use(json())
app.use(urlencoded({ extended: false }))

app.use(
  cors({ origin: 'https://tokomu.vercel.app', optionsSuccessStatus: 200 }),
)

app.get('/', (_req, res) => {
  res.send('Hello World!')
})

interface Body {
  readonly url: string
}

const validationSchema: schema = {
  body: Joi.object<Body>({
    url: Joi.string().trim(),
  }),
}

app.post('/', validate(validationSchema), async (req, res) => {
  try {
    const { url } = req.body

    const result = await tokopediaFactory(url as string)

    return res.json({ result })
  } catch (error) {
    return res
      .json({ error: 'Internal Server Error', reason: error })
      .status(500)
  }
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
