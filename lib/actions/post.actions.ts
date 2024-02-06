"use server"

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import Post from "../models/post.model";
import User from "../models/user.model";
import Community from "../models/community.model";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

export async function createPost({text, author, communityId, path}: Params) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const post = await Post.create({text, author, community: communityIdObject});
    
        await User.findByIdAndUpdate(author, {
            $push: { posts: post._id }
        });

        if (communityIdObject) {
            await Community.findByIdAndUpdate(communityIdObject, {
              $push: { posts: post._id },
            });
        }
    
        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Відбулася помилка при створені поста: ${error.message}`)
    }
}

export async function fetchPost(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB();

        const skipAmout = (pageNumber - 1) * pageSize;

        // $in: [null, undefined] - забирає коментарі
        const postQuery = Post.find({parentId: { $in: [null, undefined]}})
            .sort({createdAt: 'desc'})
            .skip(skipAmout)
            .limit(pageSize)
            .populate({
                path: 'author', 
                model: User
            })
            .populate({
                path: "community",
                model: Community,
            })
            .populate({
                path: 'likes',
                model: User,
                select: "_id id name username image"
            })
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            })

            const totalPostCount = await Post.countDocuments({parentId: { $in: [null, undefined]}});

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
                path: "community",
                model: Community,
                select: "_id id name image",
            })
            .populate({
                path: 'likes',
                model: User,
                select: '_id id name username image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: '_id id name parentId image'
                    },
                    {
                        path: 'children',
                        model: Post,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();

        return post
    } catch (error: any) {
        throw new Error(`Виникла помилка: ${error.message}`);
    }        
}

export async function addCommentToPost(
    postId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    connectToDB();
  
    try {
      const originalPost = await Post.findById(postId);
  
      if (!originalPost) {
        throw new Error("Пост не найдено");
      }
  
      const commentPost = new Post({
        text: commentText,
        author: userId,
        parentId: postId,
      });

      const savedCommentPost = await commentPost.save();

      await User.findByIdAndUpdate(userId, {
        $push: { posts: savedCommentPost._id }
    });

      await originalPost.children.push(savedCommentPost._id);
  
      await originalPost.save();
  
      revalidatePath(path);
    } catch (error: any) {;
      throw new Error(`Не вдалося добавити коментарій ${error.message}`);
    }
}

export async function deletePostId({authorId, postId}: {authorId: string, postId: string}) {
    try {
        connectToDB();

        const posts = await Post.findById(postId);
    } catch (error: any) {;
        throw new Error(`Не вдалося видалити пост ${error.message}`);
    }
}

// export async function ({posts, userId}: {posts: any, userId: string}) {
//     try {
//         posts.
//     } catch (error: any) {;
//         throw new Error(`Не вдалося добавити лайк ${error.message}`);
//     }
// }

export async function likedPost({userId, postId}: {userId: string, postId: string}) {
    try {
        connectToDB();

        const post = await Post.findById(postId);
        const user = await User.findOne({id: userId});

        const status = await (post.likes.includes(user._id) && user.liked.includes(post._id));

        if(status) {
            post.likes.pull(user._id);
            user.liked.pull(post._id);
        } else {
            post.likes.push(user._id);
            user.liked.push(post._id);
        }

        await user.save();
        await post.save();

    } catch (error: any) {
        throw new Error(`Не вдалося добавити лайк ${error.message}`);
      }
}