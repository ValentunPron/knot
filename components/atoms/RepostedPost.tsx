'use client'

import Image from "next/image";

import repost from "@/assets/repost.svg";
import { createPost } from "@/lib/actions/post.actions";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";
  

function RepostedPost({
    userId,
    content,
    image,
    community,
    
}: {
    userId: string | null,
    content: string,
    image: string,
    community: {
        id: string,
        name: string,
        image: string,
    } | null,
}) {
    const router = useRouter();
    const pathname = usePathname();

    async function onSubmit() {
        if(!userId) {
            router.push('/sing-in');
        } else {
            await createPost({ 
                text: content,
                author: userId,
                communityId: community ? community.id : null,
                image: image ? image : '',
                path: pathname,
            });

            router.push(`/profile/${userId}`)
        }
    }
    
    return (
        <Dialog>
            <DialogTrigger>
                <Image 
                    src={repost} 
                    alt="repost" 
                    width={26} 
                    height={26} 
                    className="cursor-pointer object-contain"
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Ви впевнені що хочите  зробити репост цього поста?</DialogTitle>
                <DialogDescription className="py-3">
                    <div className="mt-6 flex flex-col gap-4">
                        <p>{content}</p>
                        <div className="mt-6 flex justify-end gap-8 w-full">
                            <DialogClose asChild>
                                <Button className="rounded-full w-24 hover:opacity-85">Ні</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button className="comment-form_btn w-24 hover:opacity-85" onClick={onSubmit}>Так</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default RepostedPost;