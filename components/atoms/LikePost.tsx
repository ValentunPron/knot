'use client'

import Image from "next/image";

import heart from "@/assets/heart-gray.svg";
import heartFilled from "@/assets/heart-filled.svg";
import { likedPost } from "@/lib/actions/post.actions";
import React from "react";
import { redirect, useRouter } from "next/navigation";

function LikePost({
    userId,
    likedStatus,
    postId,
    
}: {
    userId: string | null,
    likedStatus: boolean,
    postId: string,
}) {
    const router = useRouter();

    async function handleClick() {
        if(!userId) {
            router.push('/sing-in');
        } else {
            await likedPost({userId, postId});
            router.refresh()
        }
    }
    
    return (
        <Image 
            src={likedStatus ? heartFilled : heart} 
            alt="heart" 
            width={26} 
            height={26} 
            className="cursor-pointer object-contain fill-white" 
            onClick={handleClick}
        />
    )
}

export default LikePost;