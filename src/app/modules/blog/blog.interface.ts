import { Model } from "mongoose";

// Interface for Blog Post
export interface IBlogPost {
    id: string // UUID for the blog post
    title: string // Title of the blog post
    authorId : string;
    imageUrl: string // URL of the image
    content: string // Long content of the blog post
    tags: string[] // Array of tags for the blog post
    categories: string[] // Array of categories for the blog post
    status: 'pending' | 'published' | 'scheduled' | 'draft' // Whether the post is published
    isDeleted?: boolean // Whether the post is marked as deleted
}

export interface IBlogModel extends Model<IBlogPost> {
    isPostExists(postId:string): Promise<IBlogPost | null>
}
