import ProductTable from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductForm } from "@/components/admin/ProductForm";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const AdminPage = () => {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/login");
    } else {
      console.error("Logout failed:", error.message);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setIsSheetOpen(false);
  };

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div className="container mx-auto py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>
        <div className="flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Ajouter un nouveau produit</SheetTitle>
                <SheetDescription>
                  Remplissez les informations ci-dessous pour créer un produit.
                </SheetDescription>
              </SheetHeader>
              <ProductForm onSuccess={handleFormSuccess} />
            </SheetContent>
          </Sheet>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
          </Button>
        </div>
      </header>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, marque, catégorie..."
            className="pl-10 w-full md:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <main>
        <ProductTable searchTerm={searchTerm} onActionSuccess={handleActionSuccess} />
      </main>
    </div>
  );
};

export default AdminPage;
