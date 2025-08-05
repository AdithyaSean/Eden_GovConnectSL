import { DashboardLayout } from "@/components/dashboard-layout";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AiChatbot } from "@/components/ai-chatbot";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const featuredServices = services.slice(0, 4);
  const otherServices = services.slice(4, 8);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
        <Card className="overflow-hidden bg-primary text-primary-foreground shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="p-8 space-y-4">
              <CardTitle className="text-3xl font-bold">
                Welcome, Citizen User
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 max-w-lg">
                Your central hub for all government services. Easily access applications, check statuses, and discover new services available to you.
              </CardDescription>
              <Button variant="secondary" size="lg" className="mt-4">
                View Profile
              </Button>
            </div>
            <div className="relative md:w-1/3">
              <Image
                src="https://placehold.co/600x400.png"
                alt="Sri Lanka landscape"
                data-ai-hint="sri lanka landscape"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Card>


        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Featured Services
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight font-headline">
            Explore Other Services
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {otherServices.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </div>
      <AiChatbot />
    </DashboardLayout>
  );
}
