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
    image?: string | null,
    path: string,
}

export async function createPost({text, author, communityId, image, path}: Params) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const post = await Post.create({text, author, image, community: communityIdObject});
    
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

export async function editPost({
    postId,
    text,
    image,
    path,
  }: {
    postId: string;
    text: string;
    image: string
    path: string;
  }) {
    try {
      connectToDB();
  
      const post = await Post.findById(postId);
  
      if (!post) {
        throw new Error("Пост не найдено");
      }
  
      post.text = text;
      post.image = image;
  
      await post.save();
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Помилка при редагуванні поста: ${error.message}`);
    }
  }

export async function fetchPost(pageNumber = 1, pageSize = 15) {
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

async function deletePostAndLikedFromUser(user: any, resultId: string) {
    try {
        if (user.posts.includes(resultId)) {
            // Використовуйте $pull для видалення postIdToDelete з масиву posts
            await user.updateOne({ $pull: { posts: resultId } });
            user.save();
            console.log(`Пост ${resultId} видалено для користувача ${user.id}`);
        } else {
            console.log(`Поста ${resultId} немає у списку постів користувача ${user.id}`);
        }

        if (user.liked.includes(resultId)) {
            // Використовуйте $pull для видалення postIdToDelete з масиву posts
            await user.updateOne({ $pull: { liked: resultId } });
            user.save();
            console.log(`Пост ${resultId} видалено для користувача ${user.id}`);
        } else {
            console.log(`Поста ${resultId} немає у списку постів користувача ${user.id}`);
        }
    } catch (error: any) {
        throw new Error(`Не вдалося видалити children post ${error.message}`);
    }
}

export async function deletePostId({authorId, postId}: {authorId: string, postId: string}) {
    try {
        connectToDB();

        const post = await Post.findById(postId);
        let resultId = post._id;
        const user = await User.findOne({id: authorId})

        let community = null;

        if(post.community) {
            community = await Community.findByIdAndUpdate(post.community, { $pull: {posts: resultId} });
        }

        Promise.all(post.children.map(async (resultId: string) => {
            const postChildren = await Post.findById(resultId);
            const userPostChildren = await User.findOne(postChildren.author);

            deletePostAndLikedFromUser(userPostChildren, resultId);

            await Post.findByIdAndDelete(resultId);
        }));
        

        deletePostAndLikedFromUser(user, resultId);

        await Post.findByIdAndDelete(postId);
    } catch (error: any) {;
        throw new Error(`Не вдалося видалити пост ${error.message}`);
    }
}

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

export async function repostedPost({text, author, communityId, path}: Params) {
    try {
        connectToDB();

        const communityIdObject = await Community.findOne(
            { id: communityId },
            { _id: 1 }
        );

        const currentUser = await User.findOne({id: author});
        const currentUserId = currentUser._id

        const post = await Post.create({text, author: currentUserId, community: communityIdObject});
    
        await User.findByIdAndUpdate(currentUserId, {
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
