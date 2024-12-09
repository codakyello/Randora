import ProtectedRoute from "../_components/ProtectedRoute";

export const metadata = {
  title: "Lottery",
};

export default function LotteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
