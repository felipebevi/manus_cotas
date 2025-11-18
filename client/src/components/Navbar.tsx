import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl, APP_TITLE, APP_LOGO } from "@/const";
import { Link } from "wouter";
import { LanguageSelector } from "./LanguageSelector";
import { useI18n } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, Home } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function Navbar() {
  const { user, isAuthenticated, loading } = useAuth();
  const { t } = useI18n();
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />}
              <span>{APP_TITLE}</span>
            </a>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />

            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">{user.name || user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/">
                          <a className="flex items-center gap-2 w-full">
                            <Home className="h-4 w-4" />
                            {t('nav_home', 'Home')}
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      
                      {user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">
                            <a className="flex items-center gap-2 w-full">
                              <LayoutDashboard className="h-4 w-4" />
                              {t('nav_admin', 'Admin Panel')}
                            </a>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      {user.role === 'cotista' && (
                        <DropdownMenuItem asChild>
                          <Link href="/cotista">
                            <a className="flex items-center gap-2 w-full">
                              <LayoutDashboard className="h-4 w-4" />
                              {t('nav_cotista', 'Cotista Portal')}
                            </a>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link href="/my-reservations">
                          <a className="flex items-center gap-2 w-full">
                            <LayoutDashboard className="h-4 w-4" />
                            {t('nav_my_reservations', 'My Reservations')}
                          </a>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('nav_logout', 'Logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={getLoginUrl()}>{t('nav_login', 'Login')}</a>
                    </Button>
                    <Button size="sm" asChild>
                      <a href={getLoginUrl()}>{t('nav_signup', 'Sign Up')}</a>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
