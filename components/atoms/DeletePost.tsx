'use client'

import Image from "next/image";

import deleteImage from "@/assets/delete.svg";
import { useRouter } from "next/navigation";
import { deletePostId } from "@/lib/actions/post.actions";

function DeletePost({
    userId, 
    authorId, 
    postId,
}: {
    userId: string, 
    authorId: string, 
    postId: string,
}) {
    const router = useRouter();
    
    if(userId !== authorId) {
        return null
    }

    async function handleClick() {
        await deletePostId({authorId, postId});
    }

    return (
        <Image 
            src={deleteImage}
            alt="delete post"
            width={24} 
            height={24}
            className="cursor-pointer"
            onClick={handleClick}
        />
    )
}

export default DeletePost;