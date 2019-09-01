import * as express from 'express'
import fetch from 'node-fetch'
const app = express()
const port = 80

app.get('/', async (req: express.Request, res: express.Response) => {
    try {
        const response = await fetch('http://a')
        const text = await response.text()
        res.send(text)
    } catch ( e ) {
        console.error(e)
        res.send('')
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))