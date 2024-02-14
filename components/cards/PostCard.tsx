import Link from "next/link";
import Image from "next/image";
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

import reply from "@/assets/reply.svg";
import DeletePost from "../atoms/DeletePost";
import LikePost from "../atoms/LikePost";
import RepostedPost from "../atoms/RepostedPost";



interface Props {
    id: string,
    currentUserId: string,
    parentId: string | null,
    content: string,
    image: string,
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
        image: string
    }[],
    likedStatus: boolean,
    createdAt:  string,
    comments: {
        author: {
            image: string
            name: string,
        }
    }[],
    isComment?: boolean,
    isFullPost?: boolean,
}

const PostCard = ({
    id,
    currentUserId,
    parentId,
    content,
    image,
    author,
    likes,
    likedStatus,
    community,
    createdAt,
    comments,
    isComment,
    isFullPost = false,
}: Props) => {
    const date = format(new Date(createdAt),"HH:mm - dd MMMM yyyy", {locale: uk});

    function truncateText(text: string) {
        if (text.length > 447) {
            return text.slice(0, 447) + '...';
        }
        return text;
    }

    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? 'px-0 xs:px-6 mt-1' : 'bg-dark-2 p-6'} max-sm:p-4`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11 max-sm:h-8 max-sm:w-8">
                            <Image 
                                src={author.image}
                                alt={author.name}
                                fill
                                className="cursor-pointer object-cover rounded-full"
                            />
                        </Link>

                        <div className="thread-card_bar" />
                    </div>
                    <div className="flex w-full flex-col">
                        <div className="flex w-full justify-between">
                            <div className="flex gap-3 items-center">
                                <Link href={`/profile/${author.id}`} className="w-fit">
                                    <h4 className="cursor-pointer text-base-semibold text-light-2">{author.name}</h4>
                                </Link>
                                {
                                    !isComment && community && (
                                        <Link href={`/communities/${community.id}`} className="flex items-center max-sm:hidden">
                                            <p className="text-subtle-medium text-gray-1">| {community.name} </p>
                                            <Image 
                                                src={community.image}
                                                alt={community.name}
                                                width={28}
                                                height={28}
                                                className="rounded-full ml-2 object-cover w-[28px] h-[28px]"
                                            />
                                        </Link>
                                    )
                                }
                            </div>
                            <div>
                                <DeletePost 
                                    userId={currentUserId}
                                    authorId={author.id}
                                    content={content}
                                    postId={id}
                                />
                            </div>
                        </div>

                        <div className="mt-2 text-small-regular text-light-2 max-sm:text-[12px]">
                            {
                                isFullPost 
                                ? <>{content}</>
                                :(
                                    content.length < 400
                                    ? <>{content}</>
                                    : 
                                    <div>
                                        {truncateText(content)}
                                        <Link href={`post/${id}`} className="block mt-1 text-blue dark:text-blue-500 hover:underline">Показати більше</Link>
                                    </div>
                                )
                            }

                            {
                                image && 
                                <Image 
                                    src={image}
                                    alt="image post"
                                    width={100} height={100}
                                    className='object-scale-down w-full h-auto max-h-[500px] mt-5'
                                />
                            }
                        </div>

                        <div className={`${isComment && 'mb-7'} mt-5 flex-col gap-3`}>
                            <div className="flex gap-4">
                                <LikePost 
                                    userId={currentUserId}
                                    likedStatus={likedStatus}
                                    postId={id}
                                />
                                <Link href={`/post/${id}`}>
                                    <Image src={reply} alt="reply" width={26} height={26} className="cursor-pointer object-contain"/>
                                </Link>
                                {/* <RepostedPost 
                                    userId={currentUserId}
                                    content={content}
                                    image={image}
                                    community={community}
                                /> */}
                            </div>

                            <div className="flex gap-2 mt-2">
                                {
                                    isComment && likes.length > 0 && (
                                    <Link href={`/post/likes/${id}`}>
                                            <p className='mt-1 text-subtle-medium text-gray-1'>{likes.length} лайків</p>
                                    </Link>
                                    )
                                }
                                {
                                    isComment && comments.length > 0 && (
                                    <Link href={`/post/${id}`}>
                                            <p className='mt-1 text-subtle-medium text-gray-1'>{comments.length} відповіді</p>
                                    </Link>
                                    )
                                }
                            </div>
                            {
                                !isComment && community && (
                                    <Link href={`/communities/${community.id}`} className="items-center mt-1 hidden max-sm:flex">
                                        <p className="text-subtle-big text-gray-1">{community.name} </p>
                                        <Image 
                                            src={community.image}
                                            alt={community.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full ml-2 object-cover w-[32px] h-[32px]"
                                        />
                                    </Link>
                                )
                            }
                            {
                                isComment && (
                                    <p className="mt-4 text-subtle-medium text-gray-1">
                                        {date}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                {
                        !isComment && likes && likes.length > 0 && (
                        <Link
                            href={`/post/likes/${id}`} 
                            className="mt-4 flex items-center"
                        >
                            {
                                likes && likes.length > 0 && 
                                    likes.map((like, index) => {
                                        if(index <= 2) {
                                            return (
                                                <Image
                                                    key={`likedUser_${index}`}
                                                    src={like.image}
                                                    alt={`user_${index}`}
                                                    width={28}
                                                    height={28}
                                                    className={`${
                                                    index !== 0 && "-ml-3"
                                                    } rounded-full object-cover w-[28px] h-[28px] max-sm:w-[24px] max-sm:h-[24px]`}
                                                />
                                            )
                                        }
                                    })
                            }
                            <span className="ml-2 text-subtle-medium text-gray-1">{likes.length} Лайків</span>
                        </Link>
                    )
                }
                {
                    !isComment && comments && comments.length > 0 && (
                        <Link
                            href={`/post/${id}`} 
                            className="mt-4 flex items-center"
                        >
                            {
                                !isComment && comments && comments.length > 0 && 
                                comments.map((comment, index) => {
                                    if(index <= 2) {
                                        return (
                                            <Image
                                            key={index}
                                            src={comment.author.image}
                                            alt={`user_${index}`}
                                            width={28}
                                            height={28}
                                            className={`${
                                            index !== 0 && "-ml-3"
                                            } rounded-full object-cover w-[28px] h-[28px] max-sm:w-[24px] max-sm:h-[24px]`}
                                        />
                                        )
                                    }
                                })
                            }
                            <span className="ml-2 text-subtle-medium text-gray-1">{comments.length} Коментарі</span>
                        </Link>
                    )
                }
            </div>
            {
                !isComment && (
                    <p className="mt-4 text-subtle-medium text-gray-1">
                        {date}
                     </p>
                )
            }
        </article>
    )
}

export default PostCard;