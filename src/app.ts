import express, { Request, Response } from 'express'
const app = express()
import cors from 'cors'
import { userRoutes } from './app/modules/userModules/user.route'
import { blogPostRoutes } from './app/modules/blog/blog.routes'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import router from './app/routes'

// parser
app.use(express.json())
app.use(express.text())
app.use(cors())

// routes
app.use('/api/v1', router) // auth users

// app.use('api/v1/authenticated/posts', blogPostRoutes.publicRoutes ) 

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use(globalErrorHandler)


export default app
