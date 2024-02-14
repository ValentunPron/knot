'use client'

import Image from "next/image";
import { SignOutButton, SignedIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import logout from '@/assets/logout.svg';
import { Button } from "../ui/button";

function Exit() {
    const router = useRouter();

    return (
        <Dialog>
            <DialogTrigger>
            <div className='flex cursor-pointer gap-4 p-4'>
                <Image src={logout} alt='logout' width={24} height={24}/>
                
                <p className='text-light-1 max-lg:hidden'>Вихід</p>
            </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Ви впевнені що хочете вийти?</DialogTitle>
                <DialogDescription className="py-3">
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="mt-6 flex justify-end gap-8 w-full">
                            <DialogClose asChild>
                                <Button className="rounded-full w-24 hover:opacity-85">Ні</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <SignedIn>
                                    <SignOutButton signOutCallback={() => router.push('/sing-in')}>
                                    <Button className="comment-form_btn w-24 hover:opacity-85">Так</Button>
                                    </SignOutButton>
                                </SignedIn>
                            </DialogClose>
                        </div>
                    </div>
                </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Exit;