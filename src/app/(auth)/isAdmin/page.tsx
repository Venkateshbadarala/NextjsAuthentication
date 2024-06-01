
import React from 'react'
import Link from 'next/link';
import PrimaryNavigation from '@/components/navigation/PrimaryNavigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const page =async () => {

const session = await getServerSession(authOptions)


  return (
    <div>
       <PrimaryNavigation/>
       <ToastContainer/>
      <div className='flex  flex-col items-center justify-center h-screen font-semibold'>
       <h1 className='text-xl font-extrabold'>ADMIN DASHBOARD</h1>
       <div>{session?.user?.name}</div>
      <div>{session?.user?.email}</div>
      <div>{session?.user?.image}</div>
      <Link href="/dashboard/users" className="text-black-500 text-xl font-bold border p-3 bg-blue-500 rounded-lg">
                      Admin Controller
                    </Link>
      </div>

    </div>
  )
}

export default page