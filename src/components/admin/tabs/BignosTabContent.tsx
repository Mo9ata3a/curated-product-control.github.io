
import { useState } from 'react';
import { BignosTableHeader } from '@/components/admin/bignos/BignosTableHeader';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BignosTable from '@/components/admin/bignos/BignosTable';
import { validateSearchTerm } from '@/lib/validation';

interface BignosTabContentProps {
  onAddBigno: () => void;
  onActionSuccess: () => void;
}

export const BignosTabContent = ({ onAddBigno, onActionSuccess }: BignosTabContentProps) => {
  const [bignoSearchTerm, setBignoSearchTerm] = useState('');

  return (
    <>
      <BignosTableHeader onAddBigno={onAddBigno} />
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 my-4 sm:my-6">
        <div className="relative w-full max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Rechercher des bignos..." value={bignoSearchTerm} onChange={(e) => setBignoSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <BignosTable searchTerm={bignoSearchTerm} onActionSuccess={onActionSuccess} />
      </div>
    </>
  );
};
