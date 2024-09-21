// blogPostService.ts
import { IBlogPost } from './blog.interface'
import Blog from './blog.model'

// Function to create a single blog post
export const createBlogPostInDB = async (blogPostData: IBlogPost) => {
    // Create a new blog post instance
    const newBlogPost = new Blog(blogPostData)
    // Save the blog post to the database
    const savedPost = await newBlogPost.save()
    return savedPost // Return the saved post
}


// update single by id
const updateBlogPostByIdInDB = async (postId, updateData) => {
    try {
        // Find and update the post
        const updatedPost = await Blog.findOneAndUpdate(
            { id: postId, isDeleted: false }, // Ensure post is not marked as deleted
            { ...updateData, updatedAt: new Date() }, // Set updated fields and update timestamp
            { new: true, runValidators: true } // Return the updated document
        )

        if (!updatedPost) {
            throw new Error('Post not found')
        }

        return updatedPost
    } catch (error: any) {
        throw new Error(error.message)
    }
}

// get all posts from database
const getAllPostFromDb = async (skip, limit) => {
    const result = await Blog.find({ status: 'published' })
        .skip(skip)
        .limit(limit)
    const totalPosts = await Blog.find().countDocuments()
    return {
        result,
        totalPosts,
    }
}

// get post by id from db
const getPostOfASingleUserByIDFromDb = async (authorId) => {
    const result = await Blog.find({ authorId })
    return result
}

// get a blog post by post id
const getAPostIdFromDb = async (id) => {
    const result = await Blog.findOne({ id, status: 'published' })
    return result
}

// delete post by post id (authorized user only)
const deltePostByIdInDb = async (id) => {
    const result = await Blog.deleteOne({ id })
    return result
}

// get all pending posts
const getAllPendingPostFromDb = async(status) => {
    const result = await Blog.find({status})
    return result
} 


export const blogPostServices = {
    createBlogPostInDB,
    updateBlogPostByIdInDB,
    getAllPostFromDb,
    getPostOfASingleUserByIDFromDb,
    getAPostIdFromDb,
    deltePostByIdInDb,
    getAllPendingPostFromDb
}
