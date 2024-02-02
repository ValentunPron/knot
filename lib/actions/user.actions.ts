"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

import User from "../models/user.model";
import Post from "../models/post.model";
import Community from "../models/community.model";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

export async function updateUser({userId, username, name, bio, image, path}: Params): Promise<void> {
    try {
        connectToDB();

        await User.findOneAndUpdate(
            {id: userId},
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true}
        );
            
        if(path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Помилка з create/update користувача ${error.message}`)
    }
}

export async function fecthUser(userId: string) {    
    try {
        connectToDB();

        return await User.findOne({ id: userId }).populate({
            path: "communities",
            model: Community,
          });
    } catch (error: any) {
        throw new Error(`Помилка з полученням даних про користувача ${error.message}`)
    }
}

export async function fetchUserPost(userId: string) {
    try {
        connectToDB();

        const posts = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                options: { sort: { createdAt: -1 }},
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: "children",
                        model: Post,
                        populate: {
                            path: "author",
                            model: User,
                            select: "id name image",
                        },
                    }
                ],
            });

            return posts
    } catch (error: any) {
        throw new Error(`Невдалося загрузити пости користувача: ${error.message}`);
    }
    
}

interface IUsers {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}

export const fetchUsers = async ({userId, searchString = '', pageNumber = 1, pageSize = 12, sortBy='desc'}: IUsers) => {
    try {
        connectToDB();

        const skipAmout = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i');

        const query: FilterQuery<typeof User> = {
            id: {$ne: userId}
        }

        if(searchString.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex} },
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmout)
            .limit(pageSize)

        const totalUserCount = await User.countDocuments(query);

        const users = await userQuery.exec();

        const isNext = totalUserCount > skipAmout + users.length;

        return { users, isNext }
    } catch (error: any) {
        throw new Error(`Невдалося загрузити пости користувача: ${error.message}`);
    }
}

export const getActivity = async (userId: string) => {
    try {
        connectToDB();

        const userPosts = await Post.find({ author: userId });

        const childrenPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children);
        }, []);


        const replies = await Post.find({
            _id: { $in: childrenPostIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies
    } catch (error: any) {
        throw new Error(`Не вдалося загрузити активність користувача: ${error.message}`);
    }
}