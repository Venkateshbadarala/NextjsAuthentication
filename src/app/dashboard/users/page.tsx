"use client";
import axios from 'axios';
import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import SingleUser from '@/components/users/singleUser';

const fetchData = async ({ pageParam = 1, limit = 10 }) => {
  try {
    const response = await axios.get(`/api/users/list?cursor=${pageParam}&limit=${limit}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Error fetching users');
    }
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

const PageUser = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, ...result } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam }) => fetchData({ pageParam, limit: 5 }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: 0,
  });

  return (
    <div className="p-4">
      <div className="grid grid-cols-5 gap-4 font-bold border-b pb-2">
        <div>Name</div>
        <div>Role</div>
        <div>is_admin</div>
        <div>Status</div>
        <div>Action</div>
      </div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="border-b">
          {page.users.map((user: IUser, userIndex: number) => (
            <SingleUser user={user} key={userIndex} />
          ))}
        </div>
      ))}
      <div className="flex justify-center p-4">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more users'}
        </button>
      </div>
    </div>
  );
};

export default PageUser;
