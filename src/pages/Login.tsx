
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const { session, isAdmin, loading, user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Vérification de la session...</p>
      </div>
    );
  }

  if (session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (session && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md text-center p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Accès non autorisé</h1>
          <p className="mb-6">
            L'utilisateur <span className="font-semibold">{user?.email}</span> est connecté mais n'a pas les droits d'administrateur.
          </p>
          <Button onClick={handleLogout} variant="destructive">
            Se déconnecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Connexion Admin</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
