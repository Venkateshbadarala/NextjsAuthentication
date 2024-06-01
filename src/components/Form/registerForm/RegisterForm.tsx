"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface UserRegister {
  name: string;
  password: string;
  email: string;
}

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserRegister>({
    reValidateMode: "onChange",
    mode: "onBlur",
    defaultValues: {
      name: "",
      password: "",
      email: "",
    },
  });

  const handleSubmitForm = async (data: UserRegister) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/register", data);
     
      toast.success('User registered successfully!');
      toast.success('Link Send Your Email');
      // Handle success if needed
    } catch (error: any) {
      console.log("error", error?.message);
      if (error.response && error.response.data.error === "Email already exists") {
        toast.error('Email already exists');
      } else {
        setErrorMessage("Failed to register user: " + error?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className='items-center justify-center flex flex-col gap-5 rounded'
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name" className='text-base font-bold'>Username:</Label>
          <Input
            type="text"
            id="name"
            placeholder="venkatesh"
            {...register("name", {
              required: "Name is required",
            })}
            className='w-96 h-12'
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email" className='text-base font-bold'>Email:</Label>
          <Input
            type="email"
            id="email"
            placeholder="Example@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className='w-96 h-12'
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password" className='text-base font-bold'>Password:</Label>
          <Input
            type="password"
            id="password"
            placeholder="********"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            className='w-96 h-12'
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <Button type='submit' className='w-full h-12 bg-blue-600' disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
