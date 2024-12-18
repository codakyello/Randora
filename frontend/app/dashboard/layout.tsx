import { Box } from "@chakra-ui/react";
import Header from "@/app/_components/Header";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import SideBar from "@/app/_components/SideBar";
import { ReactNode } from "react";
import { NavProvider } from "@/app/_contexts/NavProvider";
import { getOrganisation, getUser } from "../_lib/data-service";
import SubscriptionWarning from "../_components/SubscriptionWarning";

async function Page({ children }: { children: ReactNode }) {
  const user = await getUser();
  const organisation = await getOrganisation(user?.organisationId);
  return (
    <ProtectedRoute>
      {user?.accountType === "organisation" &&
        organisation?.subscriptionStatus === "expired" && (
          <SubscriptionWarning userType="organisation" />
        )}
      {user?.accountType === "individual" &&
        user?.subscriptionStatus === "expired" && (
          <SubscriptionWarning userType="individual" />
        )}
      <Box className="grid relative overflow-x-hidden h-screen grid-cols-[1fr] grid-rows-[auto_1fr] md:grid-cols-[28rem_1fr]">
        <NavProvider>
          <SideBar />
          <Header />
        </NavProvider>
        <main className=" no-scrollbar overflow-scroll h-[calc(100vh-7rem)] bg-[var(--color-grey-50)] py-[4rem]">
          <Box className="max-w-[120rem] mx-auto no-scrollbar">{children}</Box>
        </main>
      </Box>
    </ProtectedRoute>
  );
}

export default Page;
