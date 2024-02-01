import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import heart from "@/assets/heart-gray.svg";
import reply from "@/assets/reply.svg";
import repost from "@/assets/repost.svg";
import share from "@/assets/share.svg";
import { Button } from "../ui/button";


interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    author: {
        id: string,
        name: string,
        image: string,
    },
    community: {
        id: string,
        name: string,
        image: string,
    } | null,
    likes: {
        author: {
            image: string
        }
    }[],
    createdAt:  string,
    comments: {
        author: {
            image: string
        }
    }[],
    isComment?: boolean,
}

const PostCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    likes,
    community,
    createdAt,
    comments,
    isComment
}: Props) => {
    const date = format(new Date(),"dd MMMM", {locale: uk});

    const onToggleLike = async () => {
        alert('Like');
    }

    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-6 mt-1' : 'bg-dark-2 p-6'}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                                src={author.image}
                                alt={author.name}
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>

                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-2">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">{content}</p>

                        <div className={`${isComment && 'mb-7'} mt-5 flex-col gap-3`}>
                            <div className="flex gap-4">
                                <Image src={heart} alt="heart" width={26} height={26} className="cursor-pointer object-contain"/>
                                <Link href={`/post/${id}`}>
                                    <Image src={reply} alt="reply" width={26} height={26} className="cursor-pointer object-contain"/>
                                </Link>
                                <Image src={repost} alt="repost" width={26} height={26} className="cursor-pointer object-contain"/>
                                <Image src={share} alt="share" width={26} height={26} className="cursor-pointer object-contain"/>
                            </div>

                            {
                                isComment && comments.length > 0 && (
                                    <Link href={`/post/${id}`}>
                                        <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} відповіді</p>
                                    </Link>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <span className="mt-4 text-light-2 text-small-medium">
                {date}
            </span> */}
        </article>
    )
}

export default PostCard;