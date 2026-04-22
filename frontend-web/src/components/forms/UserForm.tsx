"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Alert from "@/components/feedback/Alert";
import { apiRequest } from "@/lib/api";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const userSchema = z.object({
  username: z.string().min(3, "Username is required"),
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  phone: z.string().regex(phoneRegex, "Invalid Phone Number"),
  city: z.string().optional(),
  country: z.string().optional(),
  userType: z.string().min(3, "User Type is required")
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: UserFormData;
  isEdit?: boolean;
  userId?: string;
}

const roleOptions = [
  "ADMIN",
  "MANAGER",
  "CUSTOMER",
  "EMPLOYEE"
];

export default function UserForm({ initialData, isEdit = false, userId }: UserFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: initialData?.username || "",
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      password: "",
      roles: initialData?.roles || [],
      status: initialData?.status || "ACTIVE",
      phone: initialData?.phone || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      userType: initialData?.userType || ""
    }
  });


  const selectedRoles = watch("roles");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const toggleRole = (role: string) => {
    const current = selectedRoles || [];
    if (current.includes(role)) {
      setValue("roles", current.filter((r) => r !== role));
    } else {
      setValue("roles", [...current, role]);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
    if (isEdit) {
      await apiRequest<UserFormData>(`/admin/users/${userId}`, {
        method: "PUT",
        body: data
      });
    } else {
      await apiRequest<UserFormData>("/admin/users", {
        method: "POST",
        body: data
      });
    }

      router.push("/admin/users");
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
        {isEdit ? "Edit User" : "Create User"}
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
      {!isEdit && (
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password")}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {/* ROLES */}
      <div>
        <label className="block text-sm font-medium mb-2">Roles</label>
        <div className="flex flex-wrap gap-3">
          {roleOptions.map((role) => (
            <button
              type="button"
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-4 py-2 rounded-lg border-b-(--border) ${
                selectedRoles?.includes(role)
                  ? "bg-blue-600 text-white"
                  : "bg-(--accent)"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {errors.roles && (
          <p className="text-red-500 text-sm">{errors.roles.message}</p>
        )}
      </div>


            {/* Phone */}
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          {...register("phone")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>


            {/* City */}
      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          {...register("city")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>



            {/* Country */}
      <div>
        <label className="block text-sm font-medium">Country</label>
        <input
          {...register("country")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country.message}</p>
        )}
      </div>

                  {/* Country */}
      <div>
        <label className="block text-sm font-medium">User Type</label>
        <input
          {...register("userType")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        />
        {errors.userType && (
          <p className="text-red-500 text-sm">{errors.userType.message}</p>
        )}
      </div>
      

      {/* STATUS */}
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          {...register("status")}
          className="mt-1 w-full border rounded-lg px-3 py-2"
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}