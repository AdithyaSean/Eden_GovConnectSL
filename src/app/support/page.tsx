import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Support & Resources</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
                            <AccordionContent>
                            You can reset your password by clicking the "Forgot Password" link on the login page and following the on-screen instructions.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>What documents are needed for a new NIC?</AccordionTrigger>
                            <AccordionContent>
                            For a new National ID card, you typically need your birth certificate, certified photos, and a certificate from your Grama Niladhari.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>How can I track my application status?</AccordionTrigger>
                            <AccordionContent>
                             You can track the status of all your submitted applications under the "My Applications" section in the main navigation.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-4">
                    <LifeBuoy className="w-16 h-16 text-primary" />
                    <p className="text-muted-foreground">
                        If you need further assistance, please don't hesitate to reach out to our support team.
                    </p>
                    <Button size="lg">Contact Us</Button>
                </CardContent>
            </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
