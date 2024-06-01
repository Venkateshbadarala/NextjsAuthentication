import Link from 'next/link';
import React from 'react'
import HoverCard from './HoverCard';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth'
const menuItems =[
    {
        title:'Home',
        linkUrl:'/',
    },
    {
        title:'Dashboard',
        linkUrl:'/dashboard',
    },
];



const PrimaryNavigation = async() => {
  const session = await getServerSession(authOptions);
   console.log("dashbaord",session);


  return (
    <div className='p-5 flex gap-10 justify-end items-center bg-slate-700'>
        <div className='flex gap-10 justify-end '>
        {
        menuItems?.map((items,index)=>
        <Link className='font-medium text-xl text-white'
        href={items?.linkUrl} 
        key={index}>
        {items?.title}
        </Link>
         )}
      </div>
      <HoverCard/>
    </div>
    
  )
}

export default PrimaryNavigation