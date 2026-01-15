"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const createUser = useMutation(api.users.createUser);
  const user = useQuery(api.users.getForCurrentUser);
  const router = useRouter();

  return (
    <main className="flex h-screen items-center justify-center">
      <form
        className="flex flex-col p-5 "
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const lastname = formData.get("lastname") as string;
          const firstname = formData.get("firstname") as string;
          const email = formData.get("email") as string;
          const gender = formData.get("gender") as "male" | "female" | "other";
          const userCreated = await createUser({
            lastname,
            firstname,
            role: "collaborator",
            email,
            gender,
            subject: user?.subject ?? "",
          });

          if (userCreated) {
            router.push("/");
          } else {
            alert("Failed to create user");
          }
        }}
      >
        <div className="p-2">
          <label>
            Email:
            <input
              className="ml-2 border-s-stone-400 border-2 rounded"
              type="text"
              name="email"
              defaultValue={user?.email}
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
              defaultValue={user?.lastname as string}
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
              defaultValue={user?.firstname as string}
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
              defaultValue={user?.gender as string}
            >
              <option value="">Veuillez sélectionner un genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </label>
        </div>
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
