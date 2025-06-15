
import { Menu, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AdminSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTabSelect: (tab: string) => void;
  activeTab: string;
  onLogout: () => void;
};

const tabs = [
  { value: "products", label: "Produits" },
  { value: "bignos", label: "Bignos" },
  { value: "contributions", label: "Contributions" },
  { value: "users", label: "Utilisateurs" },
  { value: "audit", label: "Journal d'audit" },
  { value: "settings", label: "Paramètres" },
];

export function AdminSidebar({ open, onOpenChange, onTabSelect, activeTab, onLogout }: AdminSidebarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-xs w-[85vw] bg-white flex flex-col h-auto max-h-[85vh]">
        <nav className="flex-1 flex flex-col divide-y divide-gray-100 overflow-y-auto">
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
        <div className="mt-auto p-4 border-t border-gray-100">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onLogout();
              onOpenChange(false);
            }}
          >
            <LogOut />
            <span>Se déconnecter</span>
          </Button>
        </div>
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
