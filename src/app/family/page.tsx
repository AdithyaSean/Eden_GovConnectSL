import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";

const familyMembers = [
    { id: 1, name: "Kamala Perera", relationship: "Spouse", nic: "197512345V", status: "Active" },
    { id: 2, name: "Nimal Perera", relationship: "Son", nic: "200512345V", status: "NIC Application In Review" },
    { id: 3, name: "Sunitha Perera", relationship: "Daughter", nic: "200812345V", status: "Health ID Pending" },
];

export default function FamilyPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Family & Dependents</h1>
          <Button>Add New Member</Button>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>My Household</CardTitle>
                <CardDescription>Manage services for your family members and dependents.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Relationship</TableHead>
                            <TableHead>NIC Number</TableHead>
                            <TableHead>Status / Active Services</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {familyMembers.map((member) => (
                             <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.name}</TableCell>
                                <TableCell>{member.relationship}</TableCell>
                                <TableCell>{member.nic}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{member.status}</Badge>
                                </TableCell>
                                 <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Manage Member</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
