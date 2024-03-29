"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";

import User from "../models/user.model";
import Post from "../models/post.model";
import Community from "../models/community.model";
import { clerkClient } from "@clerk/nextjs";
import { error } from "console";

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

        const user = await User.findOne({ id: userId }).populate({
            path: "communities",
            model: Community,
        });

        return user;
    } catch (error: any) {
        throw new Error(`Помилка з полученням даних про користувача ${error.message}`)
    }
}

export async function deleteUser(userId: string) {
    try {
        connectToDB();

        const user = await User.findOne({id: userId});
        

        await Post.deleteMany({_id: { $in: user.posts}});
        await Post.updateMany({_id: { $in: user.liked}}, { $pull: { likes: user._id}});
        await User.updateMany({_id: { $in: user.following}}, { $pull: { followers: user._id}});
        await User.updateMany({_id: { $in: user.followers}}, { $pull: { following: user._id}});
        await Community.updateMany({_id: { $in: user.communities}}, { $pull: { members: user._id}});
        
        await clerkClient.users.deleteUser(userId);
        await User.findOneAndDelete({id: userId});

        return { success: true }
    } catch (error: any) {
        throw new Error(`Невдалося видалити аккаунт ${error.message}`)
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
            id: {$ne: userId},
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

export const reccomendUsers = async (userId: string) => {
    try {
        connectToDB();

        const user = await User.findOne({id: userId});

        if (!user) {
            throw new Error('Користувача не найдено');
        }

        const filterUser = await User.find({ _id: { $nin: user.following, $ne: user._id }}).limit(4);

        return filterUser

    } catch (error: any) {
        throw new Error(`Не вдалося загрузити активність користувача: ${error.message}`);
    }
}

export const getActivity = async (userId: string) => {
    try {
        connectToDB();

        const userPosts = await Post.find({ author: userId });
        const user = await User.findById(userId);

        const childrenPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.children);
        }, []);

        const likesPostIds = userPosts.reduce((acc, userPost) => {
            return acc.concat(userPost.likes);
        }, []);

        let comments, likes;

        if(childrenPostIds.length > 0) {
            comments = await Post.find({
                _id: { $in: childrenPostIds },
                author: { $ne: userId }
            }).populate({
                path: 'author',
                model: User,
                select: 'name image _id'
            });
        }

        if(likesPostIds.length > 0) {
            likes = await User.find({
                _id: { $in: likesPostIds, $ne: userId},
            })
        }

        const followed = await User.find({
            _id: { $in: user.followers },
        })

        return { comments, likes, followed }
    } catch (error: any) {
        throw new Error(`Не вдалося загрузити активність користувача: ${error.message}`);
    }
}

export async function fetchUserPost({userId}: {userId: string}) {
    try {
        connectToDB();

        const posts = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                match: { parentId: { $exists: false } },
                options: { sort: { createdAt: -1 }},
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: 'likes',
                        model: User,
                        select: '_id id name username image'
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

export async function fetchUserReplies({userId}: {userId: string}) {
    try {
        connectToDB();

        const posts = await User.findOne({id: userId})
            .populate({
                path: 'posts',
                model: Post,
                match: { parentId: { $exists: true } },
                options: { sort: { createdAt: -1 }},
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: 'likes',
                        model: User,
                        select: '_id id name username image'
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

export async function fetchLikedPost(userId: string) {
    try {
        connectToDB();

        const posts = await User.findOne({id: userId})
            .populate({
                path: 'liked',
                model: Post,
                options: { sort: { createdAt: -1 }},
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: 'likes',
                        model: User,
                        select: '_id id name username image'
                    },
                    {
                        path: "author",
                        model: User,
                        select: "id name image",
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

export async function followUser({userId, currentUserId}: {userId: string, currentUserId: string}) {
    try {
        connectToDB();
        
        const user = await User.findOne({id: userId});
        const currentUser = await User.findOne({id: currentUserId});

        if(!user) {
            throw new Error('Користувача не існує');
        }

        if(!currentUser) {
            throw new Error('Користувача не існує');
        }

        if(userId === currentUserId) {
            throw new Error('Однакові користувачі!');
        }

        if(user.followers.includes(currentUser._id)) {
            user.followers.pull(currentUser._id);
            currentUser.following.pull(user._id);
        } else {
            user.followers.push(currentUser._id);
            currentUser.following.push(user._id);
        }
        
        user.save();
        currentUser.save();
    } catch (error: any) {
        throw new Error(`Невдалося загрузити користувача: ${error.message}`);
    }
}

export async function fetchFollowerAndFollowing(userId: string) {    
    try {
        connectToDB();

        const user = await User.findOne({ id: userId })
        .populate({
            path: "followers",
            model: User,
            select: '_id id name username image'
        })
        .populate({
            path: "following",
            model: User,
            select: '_id id name username image'
        });

        return user;
    } catch (error: any) {
        throw new Error(`Помилка з полученням даних про користувача ${error.message}`)
    }
}

export async function checkFollowedUser(currentUserId: string, userId: string) {
    try {
        connectToDB();

        const currentUser = await User.findOne({id: currentUserId});

        const isFollowing = await User.findOne({id: userId});

        if (isFollowing.followers.includes(currentUser._id)) {
            return true
        } else {
            return false
        }

    } catch (error: any) {
        throw new Error(`Помилка з полученням даних про користувача ${error.message}`)
    }
}