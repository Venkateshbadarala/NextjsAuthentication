"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/helper/userHelper';

interface IUser {
  _id: string;
  name: string;
  roles: number[];
  is_admin: boolean;
  active: boolean;
}

interface IProp {
  user: IUser;
}

const SingleUser: React.FC<IProp> = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      name: user.name,
    },
  });

  const [selectedRoles, setSelectedRoles] = useState<number[]>(user.roles);
  const [selectedAdmin, setSelectedAdmin] = useState<boolean>(user.is_admin);
  const [selectedActive, setSelectedActive] = useState<boolean>(user.active);
  const [loading, setLoading] = useState(false);

  const handleSubmitForm = async (data: IUser) => {
    try {
      data.is_admin = selectedAdmin;
      data.roles = selectedRoles;
      data.active = selectedActive;
      setLoading(true);
      const response = await axios.post(`/api/users/update?id=${user._id}`, data);
      console.log("response", response);
      toast.success('Updated successfully!');
    } catch (error: any) {
      console.log("error", error?.message);
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = (val: number) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(val) ? prevRoles.filter((role) => role !== val) : [...prevRoles, val]
    );
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdmin(e.target.value === "true");
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedActive(e.target.value === "true");
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-5 gap-4 items-center p-4"
      >
        <div>{user.name}</div>
        <div>
          {UserRole.map((role) => (
            <div key={role.value} className="flex items-center">
              <input
                type="checkbox"
                value={role.value}
                checked={selectedRoles.includes(Number(role.value))}
                onChange={() => handleChangeRole(Number(role.value))}
              />
              <label>{role.label}</label>
            </div>
          ))}
        </div>
        <div>
          <select
            value={selectedAdmin ? "true" : "false"}
            className="block w-full p-2 border border-gray-300 rounded"
            onChange={handleAdminChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <select
            value={selectedActive ? "true" : "false"}
            className="block w-full p-2 border border-gray-300 rounded"
            onChange={handleActiveChange}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </>
  );
};

export default SingleUser;
