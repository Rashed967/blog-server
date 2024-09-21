import { Schema, model } from 'mongoose'
import { IBlogModel, IBlogPost } from './blog.interface'

// Define the BlogPost schema
const blogPostSchema = new Schema<IBlogPost, IBlogModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true, // Ensures unique UUID for each post
        },
        title: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends
        },
        authorId: { type: String, required: true },
        imageUrl: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => {
                    return /^(http|https):\/\/[^ "]+$/.test(v) // Simple URL validation regex
                },
                message: (props: any) => `${props.value} is not a valid URL!`,
            },
        },
        content: {
            type: String,
            required: true,
        },
        tags: {
            type: [String], // Array of strings
            required: true,
            default: [],
        },
        categories: {
            type: [String], // Array of strings
            required: true,
            default: [],
        },
        status: {
            type: String,
            enum: ['pending', 'published', 'draft', 'scheduled'],
            default: 'draft',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Automatically manages `createdAt` and `updatedAt`
    }
)

// static method for getting post by id
blogPostSchema.static(
    'isPostExists',
    async function isPostExists(postId: string) {
        const existingPost = await Blog.findOne({ id: postId })
        return existingPost
    }
)

// Pre-save hook to check for duplicate id
blogPostSchema.pre('save', async function (next) {
    const blogPost = this
    // Check if a blog post with the same id already exists
    const existingPost = await Blog.findOne({ id: blogPost.id })

    if (existingPost) {
        const error = new Error(
            `A blog post with id ${blogPost.id} already exists.`
        )
        return next(error)
    }

    next() // Proceed if no duplicate is found
})

// Pre-hook to check if the post exists
blogPostSchema.pre('findOneAndUpdate', async function (next) {
    const postId = this.getQuery().id
    const post = await this.model.findOne({ id: postId })
    if (!post) {
        const err = new Error('Post not found')
        err.statusCode = 404
        return next(err)
    }
    next()
})

// Create the BlogPost model
const Blog = model<IBlogPost, IBlogModel>('BlogPost', blogPostSchema)

// Export the model
export default Blog
