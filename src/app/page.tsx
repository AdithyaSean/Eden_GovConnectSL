import { DashboardLayout } from "@/components/dashboard-layout";
import { ServiceCard } from "@/components/service-card";
import { services, trafficServices } from "@/lib/data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { AiChatbot } from "@/components/ai-chatbot";
import { Button } from "@/components/ui/button";
import { User, Bell, Settings, Search, LifeBuoy, ArrowRight, UserSquare, Car, BookUser } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {

  const digitalDocuments = [
    { name: "Citizen ID", icon: UserSquare, color: "bg-green-100" },
    { name: "Passport", icon: BookUser, color: "bg-purple-100" },
    { name: "Driving License", icon: Car, color: "bg-blue-100" },
  ];

  const IconMap = {
    UserSquare,
    BookUser,
    Car
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-primary">
         <header className="p-4 flex justify-between items-center text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
            <div>
              <p className="font-semibold text-lg">Hamad Saad Khalid</p>
              <p className="text-sm opacity-80">ID No.: 12496</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Bell className="w-6 h-6" />
            </Button>
             <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <Settings className="w-6 h-6" />
            </Button>
          </div>
        </header>
      </div>
      <div className="bg-background rounded-t-3xl -mt-6 p-4 pt-8 space-y-6">
          
        <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold">My Digital Documents</h2>
              <Button variant="link" className="text-primary pr-0">See All</Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {digitalDocuments.map(doc => {
                 const Icon = IconMap[doc.icon as keyof typeof IconMap] || UserSquare;
                 return (
                 <Card key={doc.name} className="p-4 text-center space-y-2 flex flex-col items-center justify-center aspect-square shadow-sm">
                  <div className={`p-3 rounded-full ${doc.color}`}>
                    <Icon className="w-6 h-6 text-primary"/>
                  </div>
                  <p className="text-sm font-semibold">{doc.name}</p>
                 </Card>
                 )
              })}
            </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search by Service, Vehicle..." className="pl-10 h-12 rounded-full" />
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
             <h2 className="text-xl font-bold">Services</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {services.slice(0, 4).map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </div>

         <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
             <h2 className="text-xl font-bold">Traffic Services</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {trafficServices.map((service) => (
              <Card key={service.title} className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{service.title}</p>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
               <LifeBuoy className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Help & Support</p>
              <p className="text-sm opacity-80">Get help with our services</p>
            </div>
          </div>
          <ArrowRight />
        </Card>

      </div>
      <AiChatbot />
    </DashboardLayout>
  );
}
