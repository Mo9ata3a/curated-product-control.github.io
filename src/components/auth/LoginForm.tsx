import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import { useAuthAttempts } from "@/hooks/useAuthAttempts";
import { AlertTriangle, Clock } from "lucide-react";
import { Alert, AlertDescription as AlertDesc } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { persistSessionToLocalStorage, clearSessionFromLocalStorage } from "@/lib/auth-storage";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z
    .string()
    .min(1, { message: "Le mot de passe ne peut pas être vide." }),
  rememberMe: z.boolean().default(true),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState<{ blocked: boolean; remainingTime?: number }>({ blocked: false });
  
  const {
    isBlocked,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    getRemainingAttempts,
    getAttemptInfo
  } = useAuthAttempts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const emailValue = form.watch("email");

  // Vérifier le statut de blocage quand l'email change
  useEffect(() => {
    if (emailValue) {
      const blockStatus = isBlocked(emailValue);
      setBlockedInfo(blockStatus);
    }
  }, [emailValue, isBlocked]);

  // Timer pour mettre à jour le temps restant
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (blockedInfo.blocked && blockedInfo.remainingTime) {
      interval = setInterval(() => {
        if (emailValue) {
          const blockStatus = isBlocked(emailValue);
          setBlockedInfo(blockStatus);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [blockedInfo.blocked, blockedInfo.remainingTime, emailValue, isBlocked]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Vérifier si l'utilisateur est bloqué
    const blockStatus = isBlocked(values.email);
    if (blockStatus.blocked) {
      toast({
        title: "Trop de tentatives",
        description: `Veuillez attendre ${blockStatus.remainingTime} secondes avant de réessayer.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      // Enregistrer la tentative échouée
      recordFailedAttempt(values.email);
      
      // Mettre à jour le statut de blocage
      const newBlockStatus = isBlocked(values.email);
      setBlockedInfo(newBlockStatus);
      
      const remainingAttempts = getRemainingAttempts(values.email);
      
      let errorMessage = "Email ou mot de passe incorrect.";
      if (remainingAttempts > 0) {
        errorMessage += ` Il vous reste ${remainingAttempts} tentative(s).`;
      }
      
      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      // Connexion réussie, reset les tentatives
      if (values.rememberMe) {
        persistSessionToLocalStorage();
      } else {
        clearSessionFromLocalStorage();
      }
      recordSuccessfulAttempt(values.email);
      toast({
        title: "Connexion réussie",
        description: "Vous allez être redirigé vers le panneau d'administration.",
      });
    }
    setIsSubmitting(false);
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
  };

  const attemptInfo = emailValue ? getAttemptInfo(emailValue) : null;
  const remainingAttempts = emailValue ? getRemainingAttempts(emailValue) : 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accès sécurisé</CardTitle>
        <CardDescription>
          Veuillez vous connecter pour accéder au panneau d'administration.
        </CardDescription>
      </CardHeader>
      
      {blockedInfo.blocked && blockedInfo.remainingTime && (
        <CardContent className="pb-0">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDesc className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Trop de tentatives de connexion. Veuillez attendre {formatTime(blockedInfo.remainingTime)} avant de réessayer.
            </AlertDesc>
          </Alert>
        </CardContent>
      )}
      
      {attemptInfo && attemptInfo.attempts > 0 && !blockedInfo.blocked && (
        <CardContent className="pb-0">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDesc>
              {remainingAttempts > 0 
                ? `Attention : il vous reste ${remainingAttempts} tentative(s) avant blocage temporaire.`
                : "Compte temporairement bloqué pour sécurité."
              }
            </AlertDesc>
          </Alert>
        </CardContent>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Se souvenir de moi</FormLabel>
                    <FormDescription>
                      Pour rester connecté après la fermeture du navigateur.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || blockedInfo.blocked}
            >
              {isSubmitting ? "Connexion en cours..." : 
               blockedInfo.blocked ? "Compte bloqué" : "Se connecter"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LoginForm;
