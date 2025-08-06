
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { vehicles } from '@/lib/data';
import { Download, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RegisteredVehiclesService({ service }) {
    const { toast } = useToast();

    const handleDownload = (plate) => {
        toast({
            title: "Download Started",
            description: `Downloading registration for vehicle ${plate}.`,
        });
    }
  
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Registered Vehicles</CardTitle>
                <CardDescription>
                    Below is a list of all vehicles registered under your NIC.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>License Plate</TableHead>
                                <TableHead>Vehicle Type</TableHead>
                                <TableHead>Registration Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Chassis Number</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((vehicle) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                                    <TableCell>{vehicle.type}</TableCell>
                                    <TableCell>{vehicle.registrationDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={vehicle.status === 'Active' ? 'default' : 'secondary'}
                                            className={vehicle.status === 'Active' ? 'bg-green-600' : ''}>
                                            {vehicle.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{vehicle.chassisNumber}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDownload(vehicle.licensePlate)}>
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Download Certificate</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
                 <h3 className="font-semibold">Important Dates</h3>
                 <div className="flex flex-wrap gap-4">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50 text-sm">
                            <Bell className="h-4 w-4 text-primary" />
                            <div>
                                <span className="font-semibold">{vehicle.licensePlate}: </span>
                                <span className="text-muted-foreground">Insurance expires on {vehicle.insuranceExpiry}</span>
                            </div>
                        </div>
                    ))}
                 </div>
            </CardFooter>
        </Card>
    );
}
