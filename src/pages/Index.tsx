
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { session, isAdmin, loading } = useAuth();

  console.log('Index - loading:', loading);
  console.log('Index - session:', !!session);
  console.log('Index - isAdmin:', isAdmin);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Chargement...</p>
      </div>
    );
  }

  if (session && isAdmin) {
    console.log('Redirecting to admin...');
    return <Navigate to="/admin" replace />;
  }

  console.log('Redirecting to login...');
  return <Navigate to="/login" replace />;
};

export default Index;
