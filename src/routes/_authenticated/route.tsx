import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Building2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-30 backdrop-blur-sm bg-card/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elegant">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-sm tracking-tight">Alpha Condomínios</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Propostas Comerciais</div>
            </div>
          </Link>
          <Button variant="ghost" size="sm" onClick={sair}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
