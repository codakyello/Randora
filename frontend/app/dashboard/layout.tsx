import { Box } from "@chakra-ui/react";
import Header from "../_components/Header";
import ProtectedRoute from "../_components/ProtectedRoute";
import SideBar from "../_components/SideBar";
import { ReactNode } from "react";
import { NavProvider } from "../_contexts/NavProvider";

function Page({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <Box className="grid relative overflow-x-hidden min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr] md:grid-cols-[2rem_1fr]">
        <NavProvider>
          <SideBar />
          <Header />
        </NavProvider>
        <main className="md:ml-[23rem]  w-screen md:w-[calc(100vw-22rem)] mt-[6rem] min-h-[calc(100vh-7rem)] bg-[var(--color-grey-50)] pl-6 pr-[3rem] pt-14 md:pt-[4rem] md:pb-[6.4rem] md:px-[4.8rem]">
          <Box className="max-w-[120rem] mx-auto no-scroll overflow-auto">
            {children}
          </Box>
        </main>
      </Box>
    </ProtectedRoute>
  );
}

export default Page;
