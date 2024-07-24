"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';

interface CustomInputProps  {
    route: string;
    iconPosition: string;
    imgSrc: string;
    placeholder: string;
    otherClasses?: string;
}

const LocalSearchbar = ({
        route,
        iconPosition,
        imgSrc,
        placeholder,
        otherClasses
}: CustomInputProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get('q');

    const [search, setSearch] = useState(query ||"" );

    useEffect(() => {
        const delayDebouncedFn = setTimeout(() => {
            if(search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search
                })
                router.push(newUrl, { scroll: false})
            } else {
                if(pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q']
                    })
                    router.push(newUrl, { scroll: false})
                }
            }
        }, 300);

        return () => clearTimeout(delayDebouncedFn);
    }, [search, route, pathname, router, searchParams, query])


  return (
    <div>
        <div className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 text-dark100_light900 ${otherClasses}`}>
            {iconPosition === 'left' && (
            <Image
                src={imgSrc}
                alt="search icon"
                width={24}
                height={24}
                className='cursor-pointer'
            />
            )}

            <Input
                type='text'
                placeholder={placeholder}
             
                onChange={(e) => setSearch(e.target.value)}
                className='paragraph-regular no-focus placeholder  border-none shadow-none outline-none bg-transparent'
            />
        </div>
    </div>
  )
}

export default LocalSearchbar