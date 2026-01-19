"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { showToast } from "nextjs-toast-notify";
import { forbidden } from "next/navigation";
import { ROLES } from "@/app/constants/roles";
import { Id } from "@/convex/_generated/dataModel";

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

  console.log(users);

  if (!user) {
    return <div>Loading ...</div>;
  }

  const isRHOrAdmin = user.role === "rh" || user.role === "admin";

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
          <label>
            Email:
            <input
              className="ml-2 border-s-stone-400 border-2 rounded"
              type="text"
              name="email"
              defaultValue={user.email}
              required
            />
          </label>
        </div>
        <div className="p-2">
          <label>
            Nom de famille:
            <input
              className="ml-2 border-s-stone-400 border-2 rounded"
              type="text"
              name="lastname"
              defaultValue={user.lastname}
              required
            />
          </label>
        </div>
        <div className="p-2">
          <label>
            Prénom:
            <input
              className="ml-2 border-s-stone-400 border-2 rounded"
              type="text"
              name="firstname"
              defaultValue={user.firstname}
              required
            />
          </label>
        </div>
        <div className="p-2">
          <label>
            Genre:
            <select
              name="gender"
              className="ml-2 border-s-stone-400 border-2 rounded"
              defaultValue={user.gender}
            >
              <option value="">Veuillez sélectionner un genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </label>
        </div>

        {isRHOrAdmin && (
          <div>
            <div className="p-2">
              <label>
                Rôle:
                <select
                  name="role"
                  className="ml-2 border-s-stone-400 border-2 rounded"
                  defaultValue={user?.role}
                >
                  <option value="">Veuillez sélectionner un rôle</option>
                  {ROLES?.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {users && (
              <div className="p-2">
                <label>
                  Responsable Hiérarchique:
                  <select
                    name="manager"
                    className="ml-2 border-s-stone-400 border-2 rounded"
                    defaultValue={user?.manager}
                  >
                    <option value="">
                      Veuillez sélectionner un collaborateur
                    </option>
                    {users?.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </option>
                    ))}
                  </select>
                </label>
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
