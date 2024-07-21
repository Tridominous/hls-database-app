"use client";

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import GlobalResult from './GlobalResult';


const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get('q');

  const [search, setSearch] = useState(query ||"" );
  const [isopen, setIsopen] = useState(false);

  useEffect(() => {
        const delayDebouncedFn = setTimeout(() => {
            if(search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'global',
                    value: search
                })
                router.push(newUrl, { scroll: false})
            } else {
                if(query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['global, type']
                    })
                    router.push(newUrl, { scroll: false})
                }
            }
        }, 300);

        return () => clearTimeout(delayDebouncedFn);
    }, [search, pathname, router, searchParams, query])

  return (
    <div className='relative w-full max-w-[600px] max-lg:hidden'>
        <div className='background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
            <Image
                src="/assets/icons/search.svg"
                alt='search'
                width={24}
                height={24}
                className='cursor-pointer'
            />
            <Input 
                type='text'
                placeholder='type here to search globally'
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if(!isopen) setIsopen(true);
                  if(e.target.value === "" && isopen)
                    setIsopen(false);
                }}
                className='paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none text-dark400_light700'
            />
        </div>
        {isopen && <GlobalResult/>}
    </div>
  )
}

export default GlobalSearch