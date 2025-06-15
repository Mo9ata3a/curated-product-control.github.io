import { useAuth } from '@/contexts/AuthContext';
import BignosTable from '@/components/admin/bignos/BignosTable';
import { ContributionsTable } from '@/components/admin/ContributionsTable';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import AccountSettings from '@/components/admin/AccountSettings';
import UserManagement from '@/components/admin/UserManagement';
import { SecureProductForm } from '@/components/admin/SecureProductForm';
import { SecureBignosForm } from '@/components/admin/bignos/SecureBignosForm';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut } from "lucide-react";
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { AdminSidebar, AdminHamburger } from "@/components/admin/AdminSidebar";
import { ProductTabContent } from '@/components/admin/tabs/ProductTabContent';
import { BignosTabContent } from '@/components/admin/tabs/BignosTabContent';

const Admin = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isAddBignoDialogOpen, setIsAddBignoDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const tabContentMap: { [key: string]: React.ReactNode } = {
    products: <ProductTabContent onAddProduct={() => setIsAddProductDialogOpen(true)} onActionSuccess={handleProductActionSuccess} />,
    bignos: <BignosTabContent onAddBigno={() => setIsAddBignoDialogOpen(true)} onActionSuccess={handleBignoActionSuccess} />,
    contributions: <div className="w-full overflow-x-auto"><ContributionsTable /></div>,
    users: <div className="w-full overflow-x-auto"><UserManagement /></div>,
    audit: <div className="w-full overflow-x-auto"><AuditLogViewer /></div>,
    settings: <AccountSettings />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-1 sm:px-3 md:py-8">
      {/* Mobile Hamburger + Sidebar */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center min-w-0">
          <AdminHamburger onClick={() => setSidebarOpen(true)} />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">Administration</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 hidden sm:block">
              Gestion sécurisée des produits, bignos et contributions
            </p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="hidden md:flex items-center gap-2 w-auto flex-shrink-0"
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
        onLogout={handleLogout}
      />
      <div className="max-w-full md:max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
        {/* Desktop Tabs */}
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

            <TabsContent value="products">{currentTab === "products" && tabContentMap.products}</TabsContent>
            <TabsContent value="bignos">{currentTab === "bignos" && tabContentMap.bignos}</TabsContent>
            <TabsContent value="contributions">{currentTab === "contributions" && tabContentMap.contributions}</TabsContent>
            <TabsContent value="users">{currentTab === "users" && tabContentMap.users}</TabsContent>
            <TabsContent value="audit">{currentTab === "audit" && tabContentMap.audit}</TabsContent>
            <TabsContent value="settings">{currentTab === "settings" && tabContentMap.settings}</TabsContent>
          </Tabs>
        </div>
        
        {/* Mobile version */}
        <div className="md:hidden block">
          {tabContentMap[currentTab]}
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
