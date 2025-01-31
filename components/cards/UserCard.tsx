"use client"

import { getTopTags } from '@/lib/actions/tag.actions';
import Image from 'next/image';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Badge } from '../ui/badge';
import RenderTag from '../shared/RenderTag';

interface Props {
    user: {
        _id: string;
        clerkId: string;
        name: string;
        username: string;
        email: string;
        picture?: string;
        bio?: string;
        joinedAt: Date | string
    }
}

interface Tag {
    _id: string;
    name: string;
}

const UserCard = ({ user }: Props) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const fetchedTags = await getTopTags({ userId: user._id });
                setTags(fetchedTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTags();
    }, [user._id]);

    return (
        <Link href={`profile/${user.clerkId}`}
            className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'
        >
            <article className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8'>
                <Image
                    src={user.picture || '/assets/images/default_user.png'}
                    alt={user.name}
                    width={100}
                    height={100}
                    className='rounded-full'
                />
                <div className='mt-4 text-center'>
                    <h3 className='h3-bold text-dark200_light900 line-clamp-1'>
                        {user.name}
                    </h3>
                    <p className='body-regular text-dark500_light500 mt-2'>{user.email}</p>
                </div>

                <div className='mt-5'>
                    {isLoading ? (
                        <Badge className='text-dark200_light900'>Loading tags...</Badge>
                    ) : tags.length > 0 ? (
                        <div className='flex items-center gap-2'>
                            {tags.map((tag) => (
                                <RenderTag
                                    key={tag._id}
                                    _id={tag._id}
                                    name={tag.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <Badge className='text-dark200_light900'>No tags yet</Badge>
                    )}
                </div>
            </article>
        </Link>
    )
}

export default UserCard