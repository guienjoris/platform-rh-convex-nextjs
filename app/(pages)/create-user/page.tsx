"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { showToast } from "nextjs-toast-notify";
import { Input, Select } from "@/app/components/ui";

export default function CreateUserPage() {
  const createUser = useMutation(api.users.createUser);
  const identity = useQuery(api.users.getForCurrentUser);
  const router = useRouter();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);
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

      showToast.success("Compte crée avec succès", {
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
            defaultValue={identity?.email}
            label="Email:"
            required
          />
        </div>
        <div className="p-2">
          <Input type="text" name="lastname" label="Nom de famille:" required />
        </div>
        <div className="p-2">
          <Input type="text" name="firstname" label="Prénom:" required />
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
          />
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
