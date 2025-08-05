import { DashboardLayout } from "@/components/dashboard-layout";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, UserCheck, UserPlus, Users } from "lucide-react";
import { AiChatbot } from "@/components/ai-chatbot";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services Used
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                in the last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Passport application pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renewals Due</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                Driving License & Passport
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Services</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1</div>
              <p className="text-xs text-muted-foreground">
                Business Registration available
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight font-headline">
            Your Services
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </div>
      <AiChatbot />
    </DashboardLayout>
  );
}
