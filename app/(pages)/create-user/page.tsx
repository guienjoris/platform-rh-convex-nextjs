"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { showToast } from "nextjs-toast-notify";

export default function CreateUserPage() {
  const createUser = useMutation(api.users.createUser);
  const identity = useQuery(api.users.getForCurrentUser);
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
          try {
            await createUser({
              lastname,
              firstname,
              role: "collaborator",
              email,
              gender,
              subject: identity?.subject ?? "",
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
        }}
      >
        <div className="p-2">
          <label>
            Email:
            <input
              className="ml-2 border-s-stone-400 border-2 rounded"
              type="text"
              name="email"
              defaultValue={identity?.email}
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
              defaultValue={identity?.gender as string}
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
