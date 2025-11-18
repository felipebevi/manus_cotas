import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, FileText, Users, AlertTriangle, CreditCard, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { t } = useI18n();
  const { user } = useAuth();

  const { data: dashboardData, isLoading } = trpc.admin.getDashboard.useQuery();

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t('admin_access_required', 'Admin access required')}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t('pending_documents', 'Pending Documents'),
      value: dashboardData?.pendingDocuments || 0,
      icon: FileText,
      link: '/admin/documents',
      color: 'text-blue-500',
    },
    {
      title: t('pending_cotistas', 'Pending Cotistas'),
      value: dashboardData?.pendingCotistas || 0,
      icon: Users,
      link: '/admin/cotistas',
      color: 'text-green-500',
    },
    {
      title: t('pending_vouchers', 'Pending Vouchers'),
      value: dashboardData?.pendingVouchers || 0,
      icon: FileText,
      link: '/admin/vouchers',
      color: 'text-purple-500',
    },
    {
      title: t('open_disputes', 'Open Disputes'),
      value: dashboardData?.openDisputes || 0,
      icon: AlertTriangle,
      link: '/admin/disputes',
      color: 'text-red-500',
    },
    {
      title: t('fraud_flags', 'Fraud Flags'),
      value: dashboardData?.fraudFlags || 0,
      icon: AlertTriangle,
      link: '/admin/fraud',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {t('admin_dashboard', 'Admin Dashboard')}
          </h1>
          <p className="text-muted-foreground">
            {t('admin_dashboard_desc', 'Manage platform operations and approvals')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link href={stat.link}>
                      <a className="text-sm text-muted-foreground hover:text-primary">
                        {t('view_all', 'View all')} →
                      </a>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('quick_actions', 'Quick Actions')}</CardTitle>
              <CardDescription>
                {t('common_admin_tasks', 'Common administrative tasks')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/documents">
                  <a>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('review_documents', 'Review Documents')}
                  </a>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/cotistas">
                  <a>
                    <Users className="h-4 w-4 mr-2" />
                    {t('approve_cotistas', 'Approve Cotistas')}
                  </a>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/admin/developments">
                  <a>
                    <FileText className="h-4 w-4 mr-2" />
                    {t('manage_developments', 'Manage Developments')}
                  </a>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('external_tools', 'External Tools')}</CardTitle>
              <CardDescription>
                {t('third_party_integrations', 'Third-party integrations')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <a
                  href="https://dashboard.stripe.com/test/payments"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('stripe_dashboard', 'Stripe Dashboard')}
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <a
                  href="https://dashboard.stripe.com/test/customers"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t('stripe_customers', 'Stripe Customers')}
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
