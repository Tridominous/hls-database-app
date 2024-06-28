import Equipment from '@/components/forms/Equipment';
import React from 'react'

const Page = () => {
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Add an Equipment</h1>

      <div className='mt-9'>
        <Equipment/>
      </div>
    </div>
  )
}

export default Page;