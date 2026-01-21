"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { showToast } from "nextjs-toast-notify";
import { forbidden } from "next/navigation";
import { ROLES, rolesTypes } from "@/app/constants/roles";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/app/components/ui/input/input";
import { Select } from "@/app/components/ui/select/select";

export default function ModifyUserPage() {
  const modifyUser = useMutation(api.users.updateUser);
  const identity = useQuery(api.users.getForCurrentUser);
  const router = useRouter();

  if (!identity) {
    forbidden();
  }

  const user = useQuery(api.users.getConnectedAndCompletedUser, {
    subject: identity.subject,
  });

  const users = useQuery(api.users.get);

  if (!user) {
    return <div>Loading ...</div>;
  }

  const isRHOrAdmin =
    user.role === rolesTypes.rh || user.role === rolesTypes.admin;

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const lastname = formData.get("lastname") as string;
    const firstname = formData.get("firstname") as string;
    const email = formData.get("email") as string;
    const gender = formData.get("gender") as "male" | "female" | "other";
    const role = formData.get("role") as "admin" | "collaborator" | "rh";
    const manager = formData.get("manager") as Id<"users">;
    try {
      await modifyUser({
        userId: user._id,
        user: {
          lastname,
          firstname,
          email,
          gender,
          ...(isRHOrAdmin && {
            role,
            manager,
          }),
        },
      });

      showToast.success("Compte modifié avec succès", {
        duration: 5000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
        sound: false,
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof ConvexError
          ? (error.data as { message: string }).message
          : "Unexpected error";

      showToast.error(message, {
        duration: 5000,
        progress: true,
        position: "top-center",
        transition: "bounceIn",
        icon: "",
        sound: false,
      });
    }
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <form
        className="flex flex-col p-5 "
        onSubmit={async (event: React.SyntheticEvent) => {
          await handleSubmit(event);
        }}
      >
        <div className="p-2">
          <Input
            type="text"
            name="email"
            defaultValue={user.email}
            label="Email:"
            required
          />
        </div>
        <div className="p-2">
          <Input
            type="text"
            name="lastname"
            defaultValue={user.lastname}
            label="Nom de famille:"
            required
          />
        </div>
        <div className="p-2">
          <Input
            type="text"
            name="firstname"
            defaultValue={user.firstname}
            label="Prénom:"
            required
          />
        </div>
        <div className="p-2">
          <Select
            name="gender"
            label="Genre:"
            options={[
              { value: "male", label: "Homme" },
              { value: "female", label: "Femme" },
              { value: "other", label: "Autre" },
            ]}
            onChange={() => {}}
            defaultValue={user.gender}
          />
        </div>

        {isRHOrAdmin && (
          <div>
            <div className="p-2">
              <Select
                name="role"
                label="Rôle: "
                options={ROLES.map((role) => ({ value: role, label: role }))}
                onChange={() => {}}
                defaultValue={user?.role}
              />
            </div>
            {users && (
              <div className="p-2">
                <Select
                  name="manager"
                  label="Responsable Hiérarchique:"
                  options={users.map((user) => ({
                    value: user._id,
                    label: `${user.firstname}  ${user.lastname} (${user.email})}`,
                  }))}
                  onChange={() => {}}
                  defaultValue={user?.manager}
                />
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10 hover:cursor-pointer"
        >
          Créer
        </button>
      </form>
    </main>
  );
}
