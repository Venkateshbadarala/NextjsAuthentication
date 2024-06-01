"use client"
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string>("https://placehold.co/300x300.png");
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isNameEditable, setIsNameEditable] = useState<boolean>(false);
    const [isEmailEditable, setIsEmailEditable] = useState<boolean>(false);
    const [isPasswordEditable, setIsPasswordEditable] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const { data: session, status } = useSession();

    useEffect(() => {
        if (session?.user) {
            setImageSrc(session.user.image || "https://placehold.co/300x300.png");
            setEmail(session.user.email || "");
            setName(session.user.name || "");
        }
    }, [session]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            const imageUrl = URL.createObjectURL(e.target.files[0]);
            setImageSrc(imageUrl);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        let imageData = '';
        if (selectedImage) {
            imageData = await convertToBase64(selectedImage);
        }

        const formData = {
            image: imageData,
            name,
            email,
            password
        };

        try {
            const response = await axios.post(`/api/users/profile?id=${session?.user?.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.error(error);
              toast.error("Error updating profile. Please try again.");
        }
    };

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 rounded">
                <div className="flex flex-col items-center gap-5">
                    <label htmlFor="profilePic">PROFILE PIC</label>
                    <Image
                        src={imageSrc}
                        alt="User Avatar"
                        height={112}
                        width={112}
                        className="h-28 w-28 rounded-full"
                        onError={() => setImageSrc("https://placehold.co/300x300.png")}
                    />
                    <input type="file" id="profilePic" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name" className="text-base font-bold">Name</Label>
                    <div className="flex flex-row gap-5">
                        <Input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-96 h-12"
                            disabled={!isNameEditable}
                        />
                        <Button type="button" className="w-24 h-12" onClick={() => setIsNameEditable(!isNameEditable)}>
                            {isNameEditable ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email" className="text-base font-bold">Email</Label>
                    <div className="flex flex-row gap-5">
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Example@gmail.com"
                            className="w-96 h-12"
                            disabled={!isEmailEditable}
                        />
                        <Button type="button" className="w-24 h-12" onClick={() => setIsEmailEditable(!isEmailEditable)}>
                            {isEmailEditable ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password" className="text-base font-bold">Password</Label>
                    <div className="flex flex-row gap-5">
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            className="w-96 h-12"
                            disabled={!isPasswordEditable}
                        />
                        <Button type="button" className="w-24 h-12" onClick={() => setIsPasswordEditable(!isPasswordEditable)}>
                            {isPasswordEditable ? "Save" : "Edit"}
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <Button type="submit" className="w-24 h-12">Submit</Button>
                    {feedbackMessage && <p className="text-red-500 mt-2">{feedbackMessage}</p>}
                </div>
            </form>
        </div>
    );
};

export default ProfileForm;
