"use client";
import { Box } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";
import Button from "./Button";
import Input from "./Input";
import { useEffect, useState } from "react";
import SpinnerMini from "./SpinnerMini";
import { Collaborator, User } from "../_utils/types";
import { useAuth } from "../_contexts/AuthProvider";
import { sendInvite as sendInviteApi } from "../_lib/actions";
import toast from "react-hot-toast";
import useCustomMutation from "../_hooks/useCustomMutation";

const URL = "https://mega-draw.vercel.app/api/v1";
// const URL = "http://localhost:5000/api/v1";

export default function AddCollaboratorForm({
  onClose,
  collaborators,
}: {
  onClose?: () => void;
  collaborators: Collaborator[];
}) {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { user: currentUser, getToken } = useAuth();

  const token = getToken();

  const { mutate: sendInvite, isPending: isLoading } =
    useCustomMutation(sendInviteApi);
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

          console.log(users);
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

  const handleSendInvite = function () {
    // Add user to organisation logic here
    if (!currentUser?.organisationId) return;
    setLoading(true);
    sendInvite(
      {
        organisationId: currentUser.organisationId,
        user: selectedUser,
        token,
      },
      {
        onSuccess: () => {
          toast.success("Invite sent successfully");
          setSelectedUser(null);
          setSearchInput("");
          onClose?.();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

    setLoading(false);
  };

  console.log(searchResults);

  return (
    <Box className="w-full  flex flex-col gap-[1.2rem] px-[3rem] py-[3rem] rounded-[var(--border-radius-lg)] shadow-lg z-50 bg-[var(--color-grey-0)]">
      <Box className="flex w-full items-center mb-[2rem] justify-between">
        <h2>Add a Collaborator</h2>
        <button onClick={onClose}>
          <IoCloseOutline size="3rem" />
        </button>
      </Box>

      <p className="mb-[1.2rem] ">
        Search by entering a username or email address below.
      </p>

      {selectedUser ? (
        <>
          <Box className="grid border rounded-[var(--border-radius-md)] border-[var(--color-primary)] cursor-pointer px-[2rem] py-[1.5rem] items-center gap-[3rem] grid-cols-[3rem_1fr_3rem]">
            <Box className="flex w-[4.5rem] aspect-square relative items-center ">
              <Box
                className="flex w-[7rem] aspect-square relative items-center rounded-full"
                style={{
                  backgroundImage: `url(${selectedUser.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Box>
            <Box>
              <p>{selectedUser.userName}</p>
              <p className="text-[var(--color-grey-500)]">
                {selectedUser.email}
              </p>
            </Box>
            <button
              className="ml-auto"
              onClick={() => {
                setSelectedUser(null);
              }}
            >
              <IoCloseOutline size="3rem" />
            </button>
          </Box>

          <Button
            onClick={handleSendInvite}
            disabled={isLoading}
            type="primary"
            className="mt-[2rem] text-[1.6rem] w-full  h-[5.2rem]"
          >
            {isLoading ? (
              <SpinnerMini />
            ) : (
              `Add ${selectedUser.userName} to organisation`
            )}
          </Button>
        </>
      ) : (
        <form>
          <Input
            onChange={(event) => setSearchInput(event.currentTarget.value)}
            type="text"
            placeholder="Find collaborator"
            required={true}
            className="w-full"
            name="search"
            id="search"
          />

          <Box className="w-full max-h-[30rem] overflow-y-scroll">
            {searchResults
              ?.filter((user: User) => currentUser?._id !== user._id)
              ?.map((user: User, index: number) => {
                const collaborator = collaborators.find(
                  (collab) => collab.user.email === user.email
                );

                if (collaborator)
                  console.log("is existing collab", collaborator);
                console.log(user.image);
                return collaborator ? (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!collaborator) {
                        setSearchResults([]);
                        setSelectedUser(user);
                      }
                    }}
                    className={`grid px-[2rem] ${
                      !collaborator
                        ? "hover:bg-[var(--color-grey-50)] cursor-pointer"
                        : "opacity-50"
                    } py-[1.5rem] items-center gap-[3rem] grid-cols-[3rem_1fr]`}
                  >
                    <Box
                      className="flex w-[4.5rem] aspect-square relative items-center rounded-full"
                      style={{
                        backgroundImage: `url(${user.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    <Box>
                      <p className="font-semibold text-[var(--color-primary)]">
                        {user.userName}
                      </p>
                      <p className="text-[var(--color-grey-500)]">
                        {collaborator.status === "accepted"
                          ? "Already a collaborator"
                          : "Has a pending invite"}
                      </p>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!collaborator) {
                        setSearchResults([]);
                        setSelectedUser(user);
                      }
                    }}
                    className={`grid px-[2rem] ${
                      !collaborator
                        ? "hover:bg-[var(--color-grey-50)] cursor-pointer"
                        : "opacity-50"
                    } py-[1.5rem] items-center gap-[3rem] grid-cols-[3rem_1fr]`}
                  >
                    <Box className="flex w-[4.5rem] aspect-square relative items-center">
                      <Box
                        className="flex w-[4.5rem] aspect-square relative items-center rounded-full"
                        style={{
                          backgroundImage: `url(${user.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </Box>
                    <Box>
                      <p>{user.userName}</p>
                      <p className="text-[var(--color-grey-500)]">
                        Invite to organisation
                      </p>
                    </Box>
                  </Box>
                );
              })}
          </Box>

          <Button
            disabled={loading || !selectedUser}
            type="primary"
            className="mt-[2rem] text-[1.6rem] w-full  h-[5.2rem]"
          >
            {loading ? <SpinnerMini /> : "Add to organisation"}
          </Button>
        </form>
      )}
    </Box>
  );
}
