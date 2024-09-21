// blogPostController.ts

import { NextFunction, Request, Response } from 'express'
import blogPostValidationSchema from './blog.validation'
import { blogPostServices } from './blog.post.services'
import Blog from './blog.model'
import { User } from '../userModules/user.model'
import httpStatus from 'http-status'
import sendResponse from '../../utils/sendResponse'


// Controller function to create a new blog post
export const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
        const newPost = req.body.post
        // Validate incoming data using Joi schema
        const { error, value } = blogPostValidationSchema.validate(newPost, {
            abortEarly: false,
        })
        if (error) {
            // Return 400 Bad Request with validation errors
            res.status(400).json({
                message: 'Validation errors',
                errors: error.details.map((err) => err.message),
            })
        } else {
            if (
                user.role === 'author' &&
                (newPost.status === 'published' ||
                    newPost.status === 'schedule')
            ) {
                res.status(400).json({
                    success: false,
                    message:
                        'Author only can choose post status pending or draft',
                })
            } else if (
                (user.role === 'admin' || user.role === 'editor') &&
                newPost.status === 'pending'
            ) {
                res.status(400).json({
                    success: false,
                    message: 'Admin and editor cannot choose pending as status',
                })
            } else {
                const post = { ...value, authorId: user.id }
                const blogPost = await blogPostServices.createBlogPostInDB(post)
                res.status(201).json({
                    message: 'Blog post created successfully.',
                    data: blogPost,
                })
            }

            // Create the blog post using the service

            // Respond with 201 Created status and the new post data
        }
    } catch (err: any) {
        // Send 500 Internal Server Error in case of exceptions
        res.status(500).json({
            message: 'Failed to create blog post.',
            error: err.message,
        })
    }
}

// update single post by id
const updatePostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        const { role: roleFromJwt, id } = req.user
        const existingPost = await Blog.isPostExists(postId)
        const authorId = existingPost?.authorId
        const existingUser = await User.isUserExists(authorId as string)
        const role = existingUser?.role
        if (authorId) {
            if (
                (roleFromJwt === 'author' && id === authorId) ||
                (roleFromJwt === 'editor' && role !== 'admin') ||
                roleFromJwt === 'admin'
            ) {
                const updateData = req.body.updateData // Dynamic update fields from the request body
                const updatedPost =
                    await blogPostServices.updateBlogPostByIdInDB(
                        postId,
                        updateData
                    )
                res.status(200).json({
                    message: 'Post updated successfully',
                    data: updatedPost,
                })
            } else {
                throw new Error('You have no permission to update the post')
            }
        } else {
            throw new Error('You have no permission to update the post')
        }
    } catch (error: any) {
        return res.status(404).json({
            success: false,
            message: 'updating user faild',
            error: error.message || 'Internal Server Error',
        })
    }
}

// get All post
const getAllPost = async (req: Request, res: Response) => {
    try {
        const limit = Number(req.query.limit)
        const page = Number(req.query.page)
        const skip = (page - 1) * 3
        const { result, totalPosts } = await blogPostServices.getAllPostFromDb(
            skip,
            limit
        )
        res.status(200).json({
            success: true,
            message: 'Post found successfully',
            data: result,
            pagination: {
                currentPage: limit > totalPosts ? page : 1,
                totalPosts: totalPosts,
                totalPages: Math.ceil(totalPosts / Number(limit)),
            },
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Post getting Faild!',
            error: error.message || 'Something went wrong',
        })
    }
}

// get single user's post
const getPostsOfASingleUserById = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { id } = req.params
        const {id: authorId} = req.user
        if (id === authorId) {
            const result =
            await blogPostServices.getPostOfASingleUserByIDFromDb(id)
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true, 
                message: "all post found successfully",
                data: result
            })
        } else {
            throw new Error('Access denied')
        }
    } catch (error: any) {
       next(error)
    }
}

// get a blog post by post id
const getAPostById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const result = await blogPostServices.getAPostIdFromDb(id)
        if (result) {
            res.status(200).json({
                success: true,
                message: 'Post getting Faild!',
                data: result,
            })
        } else {
            throw new Error('Post Not found, try Different')
        }
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: 'Post getting Faild!',
            error: error.message || 'Something went wrong',
        })
    }
}

// get all pending posts
const getAllPendingPost = async (req: Request, res: Response) => {
    try {
        const {status} = req.query
        const result = await blogPostServices.getAllPendingPostFromDb(status)
        if (result) {
            res.status(200).json({
                success: true,
                message: 'all pending post successfully found',
                data: result,
            })
        } else {
            throw new Error('did not found pending posts')
        }
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: 'Post getting Faild!',
            error: error.message || 'Something went wrong',
        })
    }
}

// delete post by post id (authorized user only)
const deletePostById = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params
        const { role, id } = req.user
        // custom static method for gettin post
        const existingPost = await Blog.isPostExists(postId)
        const existingUser = await User.isUserExists(
            existingPost?.authorId as string
        )
        if (
            (role === 'author' && id === existingPost?.authorId) ||
            (role === 'editor' && existingUser?.role !== 'admin') ||
            role === 'admin'
        ) {
            const result = await blogPostServices.deltePostByIdInDb(postId)
            res.status(200).json({
                success: true,
                message: 'post successfully deleted',
                data: result,
            })
        } else {
            throw new Error('You have no permission to delete this post')
        }
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: 'post deletion faild',
            error: error.message || 'something went wrong',
        })
    }
}

export const blogPostController = {
    createPost,
    updatePostById,
    getAllPost,
    getPostsOfASingleUserById,
    getAPostById,
    deletePostById,
    getAllPendingPost
}
