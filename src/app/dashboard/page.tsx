// "use client"
// import { useSession } from 'next-auth/react'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route';
import PrimaryNavigation from '@/components/navigation/PrimaryNavigation';


const DashboardPage =  async() => {
    
  const session = await getServerSession(authOptions);
 
  if(!session){
    redirect("/login")
  }
// const {data:session} = useSession();
return (
    <div>
      <div className='bg-slate-700'>
      <PrimaryNavigation/>
      </div>
     <div className='flex flex-col items-center justify-center h-screen'>
     <div>User Dashboard</div>
      <div>{session.user?.name}</div>
      <div>{session.user?.email}</div>
      <div>{session.user?.image}</div>
    </div>
       
     
    </div>
  )
}

export default DashboardPage