
import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Logout failed:", error.message);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <div className="flex items-center gap-2">
          {/* Ce bouton ouvrira la modale de création */}
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
          </Button>
        </div>
      </header>
      <main>
        <ProductTable />
      </main>
    </div>
  );
};

export default AdminPage;
