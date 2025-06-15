
import { Menu } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type AdminSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTabSelect: (tab: string) => void;
  activeTab: string;
};

const tabs = [
  { value: "products", label: "Produits" },
  { value: "bignos", label: "Bignos" },
  { value: "contributions", label: "Contributions" },
  { value: "users", label: "Utilisateurs" },
  { value: "audit", label: "Journal d'audit" },
  { value: "settings", label: "Paramètres" },
];

export function AdminSidebar({ open, onOpenChange, onTabSelect, activeTab }: AdminSidebarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xs w-[85vw] bg-white">
        <nav className="flex flex-col divide-y divide-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                onTabSelect(tab.value);
                onOpenChange(false);
              }}
              className={`px-6 py-4 text-left text-lg font-medium ${
                activeTab === tab.value
                  ? "bg-gray-100 text-primary"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}

export function AdminHamburger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="md:hidden mr-2"
      aria-label="Ouvrir le menu"
      onClick={onClick}
    >
      <Menu className="w-6 h-6" />
    </Button>
  );
}
