
import { useAuth } from '@/contexts/AuthContext';
import ProductTable from '@/components/admin/ProductTable';
import BignosTable from '@/components/admin/bignos/BignosTable';
import { ContributionsTable } from '@/components/admin/ContributionsTable';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import AccountSettings from '@/components/admin/AccountSettings';
import UserManagement from '@/components/admin/UserManagement';
import { SecureProductForm } from '@/components/admin/SecureProductForm';
import { SecureBignosForm } from '@/components/admin/bignos/SecureBignosForm';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, LogOut } from "lucide-react";
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "@/hooks/use-toast";
import { ProductTableHeader } from '@/components/admin/ProductTableHeader';
import { BignosTableHeader } from '@/components/admin/bignos/BignosTableHeader';
import { validateSearchTerm } from '@/lib/validation';
import { productColumnsConfig, ColumnVisibilityState } from '@/components/admin/ProductTableColumnToggle';

const Admin = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [bignoSearchTerm, setBignoSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddBignoDialogOpen, setIsAddBignoDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const [productColumnVisibility, setProductColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const initialState: Partial<ColumnVisibilityState> = {};
    for (const column of productColumnsConfig) {
        initialState[column.id] = true;
    }
    return initialState as ColumnVisibilityState;
  });

  const handleProductActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
  
  const handleBignoActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['bignos'] });
  };

  const handleAddProductSuccess = () => {
    handleProductActionSuccess();
    setIsAddProductDialogOpen(false);
  };
  
  const handleAddBignoSuccess = () => {
    handleBignoActionSuccess();
    setIsAddBignoDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
            <p className="mt-2 text-gray-600">Gestion sécurisée des produits, bignos et contributions</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="bignos">Bignos</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <ProductTableHeader
              onAddProduct={() => setIsAddProductDialogOpen(true)}
              columnVisibility={productColumnVisibility}
              onColumnVisibilityChange={setProductColumnVisibility}
            />
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(validateSearchTerm(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <ProductTable 
              searchTerm={productSearchTerm}
              onActionSuccess={handleProductActionSuccess}
              columnVisibility={productColumnVisibility}
            />
          </TabsContent>

          <TabsContent value="bignos" className="space-y-6">
            <BignosTableHeader onAddBigno={() => setIsAddBignoDialogOpen(true)} />
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher des bignos..."
                  value={bignoSearchTerm}
                  onChange={(e) => setBignoSearchTerm(validateSearchTerm(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <BignosTable 
              searchTerm={bignoSearchTerm}
              onActionSuccess={handleBignoActionSuccess}
            />
          </TabsContent>
          
          <TabsContent value="contributions" className="space-y-6">
            <ContributionsTable />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogViewer />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AccountSettings />
          </TabsContent>
        </Tabs>

        {/* Dialog pour ajouter un nouveau produit */}
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            </DialogHeader>
            <SecureProductForm
              onSuccess={handleAddProductSuccess}
              onCancel={() => setIsAddProductDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog pour ajouter un nouveau bigno */}
        <Dialog open={isAddBignoDialogOpen} onOpenChange={setIsAddBignoDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau bigno</DialogTitle>
            </DialogHeader>
            <SecureBignosForm
              onSuccess={handleAddBignoSuccess}
              onCancel={() => setIsAddBignoDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
