"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UserRegister {
   email: string;
}

const ForgotForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      email: "",
    }
  });

  const handleSubmitForm = async (data: UserRegister) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgot", data);
      toast.success('Password reset link sent successfully!');
    } catch (error: any) {
      console.error("Error:", error.message);
      toast.error('Failed to send reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitForm)} className='items-center justify-center flex flex-col gap-5 rounded'>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email" className='text-base font-bold'>Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Example@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              }
            })}
            className='w-96 h-12'
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <Button type='submit' className='w-full h-12' disabled={loading}>{loading ? 'Loading...' : 'Submit'}</Button>
      </form>
    </div>
  );
}

export default ForgotForm;
