import { Router } from 'express'
import { userRoutes } from '../modules/userModules/user.route'
import { blogPostRoutes } from '../modules/blog/blog.routes'

const router = Router()

const routeModuels = [
    {
        path: '/auth',
        route: userRoutes,
    },
    {
        path: '/posts',
        route: blogPostRoutes.blogRoutes,
    },
]

routeModuels.forEach((route) => router.use(route.path, route.route))


export default router
