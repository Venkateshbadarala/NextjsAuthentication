"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const menuItems = [
  {
    title: 'Profile',
    linkUrl: '/profile',
  },
];

const HoverCard = () => {
  const { data: session, status } = useSession();
  const [showHovercard, setShowHovercard] = useState(false);
  const [imageSrc, setImageSrc] = useState("https://placehold.co/300x300.png");

  useEffect(() => {
    if (session?.user?.image) {
      setImageSrc(session.user.image);
    }
  }, [session]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
  if (!session) {
    return redirect('/login');
  }

  return (
    <div className="relative">
      <button onClick={() => setShowHovercard((i) => !i)}>
        <Image
          src={imageSrc}
          alt="User Avatar"
          height={50}
          width={50}
          className="h-10 w-10 rounded-full"
          onError={() => setImageSrc("https://placehold.co/300x300.png")}
        />
      </button>

      {showHovercard && (
        <div className="absolute top-10 right-3 flex flex-col bg-slate-800 items-center justify-center p-3 gap-3 rounded-xl">
          {menuItems.map((items, index) => (
            <Link
              className="font-medium text-xl w-full text-white hover:bg-gray-400 p-1 rounded-xl shadow-xl"
              href={items.linkUrl}
              key={index}
            >
              {items.title}
            </Link>
          ))}

          <button 
            onClick={() => signOut()} 
            className="font-medium text-xl text-left w-full text-white hover:bg-gray-400 p-1 rounded-xl shadow-xl"
              >
            LogOut
          </button>
        </div>
      )}
    </div>
  );
};

export default HoverCard;
