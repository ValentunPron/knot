'use client'

import Image from "next/image";

import deleteImage from "@/assets/delete.svg";
import { redirect, usePathname, useRouter } from "next/navigation";
import { deletePostId } from "@/lib/actions/post.actions";

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

function DeletePost({
    userId, 
    authorId,
    content, 
    postId,
}: {
    userId: string | null, 
    authorId: string, 
    content: string
    postId: string,
}) {
    const router = useRouter();
    const pathname = usePathname();
    
    if(userId !== authorId) {
        return null
    }

    async function handleClick() {
        if(!userId) {
            redirect('/sing-in')
        } else {
            await deletePostId({authorId, postId});
            if(pathname === '/' || pathname.match(/^\/profile/)) {
                router.refresh();
            } else {
                router.push('/');
            }
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Image 
                    src={deleteImage}
                    alt="delete post"
                    width={24} 
                    height={24}
                    className="cursor-pointer"
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Ви впевнені що хочите  видалити цей пост?</DialogTitle>
                <DialogDescription className="py-3">
                    <div className="mt-6 flex flex-col gap-4">
                        <p>{content}</p>
                        <div className="mt-6 flex justify-end gap-8 w-full">
                            <DialogClose asChild>
                                <Button className="rounded-full w-24 hover:opacity-85">Ні</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button className="comment-form_btn w-24 hover:opacity-85" onClick={handleClick}>Так</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePost;