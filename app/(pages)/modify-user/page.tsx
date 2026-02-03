"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { ConvexError } from "convex/values";
import { forbidden } from "next/navigation";
import { ROLES, rolesTypes } from "@/app/constants/roles";
import { Id } from "@/convex/_generated/dataModel";
import { addToast } from "@heroui/react";

import { Spinner, Select, Input, SelectItem } from "@heroui/react";

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
    return (
      <Spinner
        classNames={{ label: "text-foreground mt-4" }}
        label="gradient"
        variant="gradient"
      />
    );
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

      addToast({ title: "Compte modifié avec succès", color: "success" });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof ConvexError
          ? (error.data as { message: string }).message
          : "Unexpected error";

      addToast({ title: message, color: "danger" });
    }
  };

  return (
    <main className="flex flex-col items-center h-auto justify-center">
      <h2 className="font-bold text-center p-2 mb-5">Modifier mon compte</h2>
      <form
        className="flex flex-col border-gray-300 border rounded-2xl p-2 shadow-xl"
        onSubmit={async (event: React.SyntheticEvent) => {
          await handleSubmit(event);
        }}
      >
        <div className="p-2">
          <Input
            type="email"
            name="email"
            defaultValue={user.email}
            label="Email:"
            labelPlacement="outside-left"
            isRequired
          />
        </div>
        <div className="p-2">
          <Input
            type="text"
            name="lastname"
            defaultValue={user.lastname}
            label="Nom de famille:"
            labelPlacement="outside-left"
            isRequired
          />
        </div>
        <div className="p-2">
          <Input
            type="text"
            name="firstname"
            defaultValue={user.firstname}
            label="Prénom:"
            labelPlacement="outside-left"
            isRequired
          />
        </div>
        <div className="p-2">
          <Select
            name="gender"
            label="Genre:"
            onChange={() => {}}
            defaultSelectedKeys={user.gender}
            labelPlacement="outside-left"
            placeholder="Veuillez sélectionner un genre"
            isRequired
          >
            {[
              { key: "male", label: "Homme" },
              { key: "female", label: "Femme" },
              { key: "other", label: "Autre" },
            ].map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>

        {isRHOrAdmin && (
          <div>
            <div className="p-2">
              <Select
                name="role"
                label="Rôle:"
                onChange={() => {}}
                labelPlacement="outside-left"
                placeholder="Veuillez sélectionner un rôle"
                defaultSelectedKeys={user?.role}
                isRequired
              >
                {ROLES.map((item) => (
                  <SelectItem key={item}>{item}</SelectItem>
                ))}
              </Select>
            </div>
            {users && (
              <div className="p-2">
                <Select
                  name="manager"
                  label="Responsable Hiérarchique:"
                  onChange={() => {}}
                  labelPlacement="outside-left"
                  placeholder="Veuillez sélectionner un supérieur hiérarchique"
                  defaultSelectedKeys={user?.role}
                  isRequired
                >
                  {users.map((user) => (
                    <SelectItem
                      key={user._id}
                    >{`${user.firstname}  ${user.lastname} (${user.email})}`}</SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10 hover:cursor-pointer"
        >
          Valider
        </button>
      </form>
    </main>
  );
}
