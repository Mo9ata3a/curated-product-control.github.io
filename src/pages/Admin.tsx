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
import { toast } from "sonner";
import { ProductTableHeader } from '@/components/admin/ProductTableHeader';
import { BignosTableHeader } from '@/components/admin/bignos/BignosTableHeader';
import { validateSearchTerm } from '@/lib/validation';
import { productColumnsConfig, ColumnVisibilityState } from '@/components/admin/ProductTableColumnToggle';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AdminSidebar, AdminHamburger } from "@/components/admin/AdminSidebar";
import { useMediaQuery } from "react-responsive";

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

  const [currentTab, setCurrentTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detect mobile
  const isMobile = window.innerWidth < 768;

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
      toast.success("Déconnexion réussie", {
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast.error("Erreur de déconnexion", {
        description: error.message || "Une erreur est survenue lors de la déconnexion.",
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
    <div className="min-h-screen bg-gray-50 py-4 px-1 sm:px-3 md:py-8">
      {/* Mobile Hamburger + Sidebar */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center">
          <AdminHamburger onClick={() => setSidebarOpen(true)} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Administration</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
              Gestion sécurisée des produits, bignos et contributions
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex items-center gap-2 w-auto"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
      <AdminSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onTabSelect={setCurrentTab}
        activeTab={currentTab}
      />
      <div className="max-w-full md:max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
        {/* Hide shadcn Tabs on mobile ⟶ use our custom tab switching logic */}
        <div className="md:block hidden">
          <Tabs defaultValue="products" value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <ScrollArea className="w-full whitespace-nowrap md:mb-6">
              <TabsList>
                <TabsTrigger value="products">Produits</TabsTrigger>
                <TabsTrigger value="bignos">Bignos</TabsTrigger>
                <TabsTrigger value="contributions">Contributions</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="audit">Journal d'audit</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <TabsContent value="products">{currentTab === "products" && (
              <>
                <ProductTableHeader onAddProduct={() => setIsAddProductDialogOpen(true)} columnVisibility={productColumnVisibility} onColumnVisibilityChange={setProductColumnVisibility} />
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="relative w-full max-w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Rechercher des produits..." value={productSearchTerm} onChange={(e) => setProductSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <ProductTable searchTerm={productSearchTerm} onActionSuccess={handleProductActionSuccess} columnVisibility={productColumnVisibility} />
                </div>
              </>
            )}</TabsContent>
            <TabsContent value="bignos">{currentTab === "bignos" && (
              <>
                <BignosTableHeader onAddBigno={() => setIsAddBignoDialogOpen(true)} />
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="relative w-full max-w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Rechercher des bignos..." value={bignoSearchTerm} onChange={(e) => setBignoSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
                  </div>
                </div>
                <div className="w-full overflow-x-auto">
                  <BignosTable searchTerm={bignoSearchTerm} onActionSuccess={handleBignoActionSuccess} />
                </div>
              </>
            )}</TabsContent>
            <TabsContent value="contributions">{currentTab === "contributions" && (
              <div className="w-full overflow-x-auto">
                <ContributionsTable />
              </div>
            )}</TabsContent>
            <TabsContent value="users">{currentTab === "users" && (
              <div className="w-full overflow-x-auto">
                <UserManagement />
              </div>
            )}</TabsContent>
            <TabsContent value="audit">{currentTab === "audit" && (
              <div className="w-full overflow-x-auto">
                <AuditLogViewer />
              </div>
            )}</TabsContent>
            <TabsContent value="settings">{currentTab === "settings" && (
              <AccountSettings />
            )}</TabsContent>
          </Tabs>
        </div>
        {/* Mobile version (hide tabs list, show content according to currentTab) */}
        <div className="md:hidden block">
          {currentTab === "products" && (
            <>
              <ProductTableHeader onAddProduct={() => setIsAddProductDialogOpen(true)} columnVisibility={productColumnVisibility} onColumnVisibilityChange={setProductColumnVisibility} />
              <div className="flex flex-col items-center space-y-2 mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher des produits..." value={productSearchTerm} onChange={(e) => setProductSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <ProductTable searchTerm={productSearchTerm} onActionSuccess={handleProductActionSuccess} columnVisibility={productColumnVisibility} />
              </div>
            </>
          )}
          {currentTab === "bignos" && (
            <>
              <BignosTableHeader onAddBigno={() => setIsAddBignoDialogOpen(true)} />
              <div className="flex flex-col items-center space-y-2 mb-4">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Rechercher des bignos..." value={bignoSearchTerm} onChange={(e) => setBignoSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
                </div>
              </div>
              <div className="w-full overflow-x-auto">
                <BignosTable searchTerm={bignoSearchTerm} onActionSuccess={handleBignoActionSuccess} />
              </div>
            </>
          )}
          {currentTab === "contributions" && (
            <div className="w-full overflow-x-auto">
              <ContributionsTable />
            </div>
          )}
          {currentTab === "users" && (
            <div className="w-full overflow-x-auto">
              <UserManagement />
            </div>
          )}
          {currentTab === "audit" && (
            <div className="w-full overflow-x-auto">
              <AuditLogViewer />
            </div>
          )}
          {currentTab === "settings" && (
            <AccountSettings />
          )}
        </div>
        {/* Dialogs pour l'ajout */}
        <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            </DialogHeader>
            <SecureProductForm onSuccess={handleAddProductSuccess} onCancel={() => setIsAddProductDialogOpen(false)} />
          </DialogContent>
        </Dialog>
        <Dialog open={isAddBignoDialogOpen} onOpenChange={setIsAddBignoDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau bigno</DialogTitle>
            </DialogHeader>
            <SecureBignosForm onSuccess={handleAddBignoSuccess} onCancel={() => setIsAddBignoDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
