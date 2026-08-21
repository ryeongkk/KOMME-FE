"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { logout } from "@/lib/api/auth";
import { clearAuthTokens, getRefreshToken } from "@/lib/auth-tokens";

export function MyAccountScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => {
      const refreshToken = getRefreshToken();
      return refreshToken ? logout(refreshToken) : Promise.resolve();
    },
    // Log out locally either way — a stale/expired token means the server already
    // considers the session gone, so there's nothing left to "fail" the user's intent.
    onSettled: () => {
      clearAuthTokens();
      // Drop the cached profile so a back-navigation into /my after logout can't
      // flash the previous user's nickname before the (now-401) refetch lands.
      queryClient.removeQueries({ queryKey: ["me"] });
      router.replace("/login");
    },
  });

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-2.5">
        <button type="button" aria-label="Back" onClick={() => router.back()} className="text-gray-900">
          <ArrowLeftIcon className="size-6" />
        </button>
        <p className="text-body-sb-16 text-black">My Account</p>
        <div className="size-6" aria-hidden />
      </div>

      <div className="flex w-full flex-col">
        <button
          type="button"
          onClick={() => router.push("/my/account/edit")}
          className="w-full p-4 text-left text-body-m-14 text-black"
        >
          Edit Profile
        </button>
        <button
          type="button"
          popoverTarget="logout-dialog"
          className="w-full p-4 text-left text-body-m-14 text-black"
        >
          Log Out
        </button>
        <button
          type="button"
          onClick={() => router.push("/my/account/delete")}
          className="w-full p-4 text-left text-body-m-14 text-black"
        >
          Delete Account
        </button>
      </div>

      <div
        id="logout-dialog"
        popover="auto"
        className="fixed inset-0 m-auto h-fit w-[299px] flex-col items-start gap-3 rounded-2xl border-0 bg-white p-4 [&::backdrop]:bg-black/30 [&:popover-open]:flex"
      >
        <div className="flex w-full flex-col gap-0.5">
          <p className="w-full text-body-sb-16 text-black">Log out?</p>
          <p className="w-full text-body-m-14 text-gray-600">
            {`You'll need to sign in again to continue.`}
          </p>
        </div>
        <div className="flex gap-[9px]">
          <button
            type="button"
            popoverTarget="logout-dialog"
            popoverTargetAction="hide"
            className="h-10 w-[129px] rounded-lg border border-gray-100 bg-white text-body-m-14 text-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            className="h-10 w-[129px] rounded-lg bg-gray-900 text-body-m-14 text-white"
          >
            {logoutMutation.isPending ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>
    </>
  );
}
