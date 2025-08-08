import DashboardHome from "../../dashboard/components/DashboardHome";
import { useDashboard } from "../../dashboard/context/DashboardContext";
<<<<<<< HEAD

export default function Home() {
  const { trades } = useDashboard();
  return <DashboardHome trades={trades || []} />;
=======
import { useUserProfile } from "../../dashboard/hooks/useUserProfile";

export default function Home() {
  const { trades } = useDashboard();
  const { getUserDisplayName, loading: userLoading } = useUserProfile();
  
  const userName = getUserDisplayName();
  
  return <DashboardHome trades={trades || []} userName={userName} />;
>>>>>>> 74acc0a (Initial commit of my project)
} 