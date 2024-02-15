'use client'

import Image from "next/image";

import deleteImage from "@/assets/delete.svg";
import { useRouter } from "next/navigation";

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
import { deleteUser } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs";

function DeleteAccount({userId}: {userId: string}) {
    const router = useRouter()

    if(!userId) {
        return null;
    }

    async function handleClick() {
        const userStatus = await deleteUser(userId);

        if(userStatus.success) {
            router.push('/sing-in')
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Image 
                    src={deleteImage}
                    alt="delete post"
                    width={32} 
                    height={32}
                    className="cursor-pointer"
                />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Ви впевнені що хочите  видалити аккаунт?</DialogTitle>
                <DialogDescription className="py-3">
                    <div className="mt-6 flex flex-col gap-4">
                        <p>Ви впевнені, що хочете видалити свій акаунт? Це дія є незворотньою, і всі ваші дані будуть втрачені назавжди. Це включає в себе всі особисті налаштування, історію дій, та будь-яку іншу інформацію, пов'язану з вашим профілем.</p>
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

export default DeleteAccount;