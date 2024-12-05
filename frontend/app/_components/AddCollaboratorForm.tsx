"use client";
import { Box } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "./Button";
import Input from "./Input";
import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";
import Image from "next/image";
import { User } from "../_utils/types";
import { useAuth } from "../_contexts/AuthProvider";

const URL = "https://mega-draw.vercel.app/api/v1";

export default function AddCollaboratorForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user: currentUser, getToken } = useAuth();
  const token = getToken();

  console.log(searchResults);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const debounceTimeout = setTimeout(() => {
      async function search() {
        try {
          if (!searchInput.trim()) {
            setSearchResults([]); // Clear results for empty input
            return;
          }

          setLoading(true); // Start loading state

          const res = await fetch(`${URL}/users/search?search=${searchInput}`, {
            signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }

          const {
            data: { users },
          } = data;

          // Ensure the data is an array
          if (Array.isArray(users)) {
            setSearchResults(users);
          } else if (users && Array.isArray(users)) {
            setSearchResults(users); // Handle wrapped array
          } else {
            setSearchResults([]); // Fallback to empty array
          }
        } catch (err) {
          if (err instanceof Error && err.name !== "AbortError") {
            console.error("Error during search:", err.message);
          }
        } finally {
          setLoading(false); // Stop loading state
        }
      }

      search();
    }, 300); // 300ms debounce delay

    // Cleanup function to abort request on component unmount or re-render
    return () => {
      clearTimeout(debounceTimeout);
      controller.abort();
    };
  }, [searchInput, token]);

  return (
    <Box className="w-full  flex flex-col gap-[1.2rem] px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)]">
      <Box className="flex w-full items-center mb-[2rem] justify-between">
        <h2>Add a Collaborator</h2>
        <button onClick={onClose}>
          <IoCloseOutline size="3rem" />
        </button>
      </Box>

      <p className="mb-[1.2rem] ">Search by entering email address below.</p>
      <form>
        <Input
          onChange={(event) => setSearchInput(event.currentTarget.value)}
          type="email"
          placeholder="Find collaborator"
          required={true}
          className="w-full"
          name="email"
          id="my-email"
        />

        <Box className="w-full max-h-[30rem] overflow-y-scroll">
          {searchResults
            ?.filter((user: User) => currentUser?._id !== user._id)
            ?.map((user: User, index: number) => (
              <Box
                key={index}
                className="grid hover:bg-[var(--color-grey-50)] cursor-pointer py-[2rem] items-center gap-[3rem] grid-cols-[3rem_1fr]"
              >
                <Box className="flex w-[4.5rem] aspect-square relative items-center ">
                  <Image
                    src={user.image}
                    alt="avatar"
                    fill
                    className="rounded-full"
                  />
                </Box>

                <Box>
                  <p>{user.userName}</p>
                  <p className="text-[var(--color-grey-500)]">{user.email}</p>
                </Box>
              </Box>
            ))}
        </Box>

        <Button
          type="primary"
          className="mt-[2rem] text-[1.6rem] w-full  h-[5.2rem]"
        >
          {loading ? <SpinnerMini /> : "Add to organisation"}
        </Button>
      </form>
    </Box>
  );
}
