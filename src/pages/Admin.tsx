
import { useAuth } from '@/contexts/AuthContext';
import ProductTable from '@/components/admin/ProductTable';
import { ContributionsTable } from '@/components/admin/ContributionsTable';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const Admin = () => {
  const { session, isAdmin, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="mt-2 text-gray-600">Gestion des produits et contributions</p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <ProductTable 
              searchTerm={searchTerm}
              onActionSuccess={handleActionSuccess}
            />
          </TabsContent>
          
          <TabsContent value="contributions" className="space-y-6">
            <ContributionsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
