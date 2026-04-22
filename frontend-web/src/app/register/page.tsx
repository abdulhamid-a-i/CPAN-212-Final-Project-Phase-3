"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { BookOpenText } from 'lucide-react';



const userSchema = z.object({
  username: z.string().min(3, "Username is required"),
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),

});

type UserFormData = z.infer<typeof userSchema>;




export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      firstName: "",
      email: "",
      password: "",
    }
  });



  const onSubmit = async (data: UserFormData) => {
    try {
    {
      await apiRequest<UserFormData>("/auth/register", {
        method: "POST",
        body: data
      });

      router.push("/login")
    }

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
      <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-badge">
            <BookOpenText size={22} />
          </div>
          <div>
            <h1>Bookaneers</h1>
            {/* <p>Secure digital Shopping and inventory management platform</p> */}
          </div>
        </div>

            <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-(--panel) border-(--border) p-6 rounded-2xl shadow-md border space-y-6"
            >
            <h2 className="text-xl font-semibold">
                Register
            </h2>


            {/* USERNAME */}
            <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                {...register("username")}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
            </div>

            {/* First NAME */}
            <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                {...register("firstName")}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
            </div>

            {/* Last NAME */}
            <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                {...register("lastName")}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
            </div>

            {/* EMAIL */}
            <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                {...register("email")}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>

            {/* PASSWORD */}
                <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                    type="password"
                    {...register("password")}
                    className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                </div>

            <button className="btn btn-primary" type="submit">
                Register
            </button>

            </form>
        </div>
      </div>
  );
}