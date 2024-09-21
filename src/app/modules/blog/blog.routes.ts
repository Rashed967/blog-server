import express from 'express'
import verifyUser from '../../middlewares/verify.user'
import checkRole from '../../middlewares/checkRole'
import { blogPostController } from './blog.post.controller'

//--------------- public routes------------
const blogRoutes = express.Router()
// get all blog post for all user
blogRoutes.get('/', blogPostController.getAllPost)

blogRoutes.get("/post-by-status", verifyUser, checkRole(['admin', 'editor']), blogPostController.getAllPendingPost)

//get a blog post by post id
blogRoutes.get('/:id', blogPostController.getAPostById)



//------------- private routes -------------
// const privateRoutes = express.Router()

// get singel user's posts
blogRoutes.get(
    '/users/:id',
    verifyUser,
    blogPostController.getPostsOfASingleUserById
)

// create post, (for only verified usre, logged in user)
blogRoutes.post(
    '/',
    verifyUser,
    checkRole(['admin', 'editor', 'author']),
    blogPostController.createPost
)


// Route to update a blog post by id
blogRoutes.put(
    '/:postId',
    verifyUser,
    checkRole(['admin', 'editor', 'author']),
    blogPostController.updatePostById
)

// delete a post by post id (athorized user only)
blogRoutes.delete(
    '/:postId',
    verifyUser,
    checkRole(['admin', 'editor', 'author']),
    blogPostController.deletePostById
)

export const blogPostRoutes = {
    blogRoutes
}
