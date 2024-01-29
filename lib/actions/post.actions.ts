"use server"

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Post from "../models/post.model";
import User from "../models/user.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createPost({text, author, communityId, path}: Params) {
    try {
        connectToDB();

        const post = await Post.create({text, author, community: null});
    
        await User.findByIdAndUpdate(author, {
            $push: { posts: post._id }
        });
    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Відбулася помилка при створені поста: ${error.message}`)
    }
}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        const skipAmout = (pageNumber - 1) * pageSize;

        const postQuery = Post.find({parrendId: { $in: [null, undefined]}})
            .sort({createdAt: 'desc'})
            .skip(skipAmout)
            .limit(pageSize)
            .populate({path: 'author', model: 'User'})
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            });

            const totalPostCount = await Post.countDocuments({parrendId: { $in: [null, undefined]}});

            const post = await postQuery.exec();

            const isNext = totalPostCount > skipAmout + post.length;

            return {post, isNext}
    } catch (error: any) {
        throw new Error(`Виникла помилка при загрузці поста: ${error.message}`)
    }
}

export async function fetchPostById(id: string) {
    try {
        connectToDB();

        const post = await Post.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image',
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name image'
                    },
                    {
                        path: 'children',
                        model: Post,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name image'
                        }
                    }
                ]
            }).exec();

        return post
    } catch (error: any) {
        throw new Error(`Виникла помилка: ${error.message}`);
    }        
}