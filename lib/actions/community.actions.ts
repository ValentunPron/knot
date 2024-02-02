"use server";

import { FilterQuery, SortOrder } from "mongoose";

import Community from "../models/community.model";
import Post from "../models/post.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
    try {
        connectToDB();

        const user = await User.findOne({id: createdById});

        if(!user) {
           throw new Error('Не існує даного користувача!');
        }

        const newCommunity = new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy: user._id,
        });

        const createCommunity = await newCommunity.save();

        user.community.push(createCommunity._id);
        await user.save();
    } catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function fetchCommunityDetalis(id: string) {
    try {
        connectToDB();

        const communityDetalis = await Community.findOne({ id })
            .populate([
                "createdBy", 
                {
                    path: 'members',
                    model: User,
                    select: 'name username image id _id',
                }
            ]);

        return communityDetalis;
    } catch (error: any) {
        throw new Error(`Виникла помилка при загрузці групи: ${error.message}`);
    }
}

export async function fetchCommunityPosts(id: string) {
    try {
        connectToDB();

        const communityPosts = await Community.findById(id)
            .populate({
                path: 'posts',
                model: Post,
                populate: [ 
                {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                },
                {
                    path: 'children',
                    model: Post,
                    populate: {
                        path: "author",
                        model: User,
                        select: "image _id",
                      },
                }
            ]});

        return communityPosts;
    } catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function fetchCommunities({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
  }) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regax = new RegExp(searchString, "i");

        const query: FilterQuery<typeof Community> = {};

        if(searchString.trim() !== "") {
            query.$or = [
                { username: { $regax: regax } },
                { name: { $regax: regax } },
            ];
        }

        const sortOptions = { createdAt: sortBy };

        const communityQury = Community.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
            .populate('members');

        const totalCommunitiesCount = await Community.countDocuments(query);

        const communities = await communityQury.exec();

        const isNext = totalCommunitiesCount > skipAmount + communities.length;

        return { communities, isNext };
    } catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function addMemberToCommunity(communityId: string, memberId: string) {
    try {
        connectToDB();

        const community = await Community.findOne({ id: communityId });

        if(!community) {
            throw new Error('Групи не найдено');
        }

        const user = await User.findOne({ id: memberId });

        if(!user) {
            throw new Error('Користувача не найдено');
        }

        if (community.members.includes(user._id)) {
            throw new Error("User is already a member of the community");
        }
    
        community.members.push(user._id);
        await community.save();
    
        user.communities.push(community._id);
        await user.save();
    
        return community;
    } catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function removeUserFromCommunity(userId: string, communityId: string) {
    try {
        connectToDB();

        const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
        const communityIdObject = await Community.findOne(
          { id: communityId },
          { _id: 1 }
        );
    
        if (!userIdObject) {
          throw new Error("User not found");
        }
    
        if (!communityIdObject) {
          throw new Error("Community not found");
        }
    
        // Remove the user's _id from the members array in the community
        await Community.updateOne(
          { _id: communityIdObject._id },
          { $pull: { members: userIdObject._id } }
        );
    
        // Remove the community's _id from the communities array in the user
        await User.updateOne(
          { _id: userIdObject._id },
          { $pull: { communities: communityIdObject._id } }
        );
    
        return { success: true };
    } catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function updateCommunityInfo(
    communityId: string,
    name: string,
    username: string,
    image: string
    ){
    try {
        connectToDB();

        const updatedCommunity = await Community.findOneAndUpdate(
        { id: communityId },
        { name, username, image }
        );

        if (!updatedCommunity) {
        throw new Error("Групу не найдено");
        }

        return updatedCommunity;
    }  catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}

export async function deleteCommunity(communityId: string) {
    try {
        connectToDB();
    
        const deletedCommunity = await Community.findOneAndDelete({
          id: communityId,
        });
    
        if (!deletedCommunity) {
          throw new Error("Групу не найдено");
        }
    
        await Post.deleteMany({ community: communityId });
    
        const communityUsers = await User.find({ communities: communityId });
    
        const updateUserPromises = communityUsers.map((user) => {
          user.communities.pull(communityId);
          return user.save();
        });
    
        await Promise.all(updateUserPromises);
    
        return deletedCommunity;
      }  catch (error: any) {
        throw new Error(`Виникла помилка при створені групи: ${error.message}`);
    }
}