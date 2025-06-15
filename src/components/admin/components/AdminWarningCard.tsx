
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const AdminWarningCard = () => {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="h-5 w-5" />
          Information importante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-700 text-sm">
          Pour des raisons de sécurité, l'invitation automatique d'utilisateurs n'est pas disponible avec la configuration actuelle. 
          Pour ajouter un administrateur, vous devez saisir l'ID utilisateur d'un compte Supabase existant.
        </p>
      </CardContent>
    </Card>
  );
};
