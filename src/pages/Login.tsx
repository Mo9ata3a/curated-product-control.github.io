
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
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
