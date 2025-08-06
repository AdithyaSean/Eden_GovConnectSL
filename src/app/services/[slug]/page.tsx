import { DashboardLayout } from "@/components/dashboard-layout";
import { services } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }
  
  const Icon = LucideIcons[service.icon] as React.ElementType;

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-4 rounded-lg bg-muted hidden md:flex">
                  {Icon && <Icon className="w-8 h-8 text-primary" />}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{service.title}</h1>
                  <p className="text-lg text-muted-foreground">{service.content.longDescription}</p>
                </div>
            </div>
             <Badge variant={service.statusVariant} className="text-base px-4 py-2 capitalize">{service.status}</Badge>
        </header>

        <div className="grid gap-8">
            {service.content.sections.map((section, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{section.content}</p>
                        {section.list && (
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                {section.list.map((item, itemIndex) => (
                                    <li key={itemIndex}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Optional: Generate static pages for each service at build time
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}
