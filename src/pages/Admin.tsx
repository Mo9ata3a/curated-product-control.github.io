
import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminPage = () => {
  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        {/* Ce bouton ouvrira la modale de création */}
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </header>
      <main>
        <ProductTable />
      </main>
    </div>
  );
};

export default AdminPage;
