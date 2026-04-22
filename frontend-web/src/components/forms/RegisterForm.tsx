"use client";


import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api";


const userSchema = z.object({
  username: z.string().min(3, "Username is required"),
  fullName: z.string().min(3, "Full name is required"),
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
      fullName: "",
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
    }

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
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

      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          {...register("fullName")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
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

    <button className="btn btn-primary" style={{ width: "100%" }} type="submit">
        Register
      </button>

    </form>
  );
}