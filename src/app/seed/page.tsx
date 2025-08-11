
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, writeBatch, Timestamp, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const seedData = {
    users: [
        { id: "user-nimal", name: "Nimal Silva", email: "nimal.s@example.com", nic: "199012345V", role: "Citizen", status: "Active" },
        { id: "user-kamala", name: "Kamala Perera", email: "kamala.p@example.com", nic: "198523456V", role: "Citizen", status: "Active" },
        { id: "super-admin", name: "Admin User", email: "admin@gov.lk", nic: "", role: "Super Admin", status: "Active" },
        { id: "worker-transport", name: "Transport Worker", email: "worker.transport@gov.lk", nic: "", role: "worker_transport", status: "Active" },
        { id: "worker-immigration", name: "Immigration Worker", email: "worker.immigration@gov.lk", nic: "", role: "worker_immigration", status: "Active" },
        { id: "worker-identity", name: "Identity Worker", email: "worker.identity@gov.lk", nic: "", role: "worker_identity", status: "Active" },
        { id: "worker-missingdocuments", name: "Missing Docs Worker", email: "worker.missingdocuments@gov.lk", nic: "", role: "worker_missingdocuments", status: "Active" },
    ],
    applications: [
        { user: "Nimal Silva", service: "Renew Driving License", status: "In Progress", submitted: new Date("2024-07-20") },
        { user: "Nimal Silva", service: "Passport Renewal", status: "Approved", submitted: new Date("2024-06-15") },
        { user: "Nimal Silva", service: "Fine Payment", status: "Completed", submitted: new Date("2024-07-10") },
        { user: "Kamala Perera", service: "National ID Services", status: "Pending", submitted: new Date("2024-07-22") },
        { user: "Kamala Perera", service: "Registered Vehicles", status: "In Review", submitted: new Date("2024-05-30") },
        { user: "Kamala Perera", service: "Missing Documents", status: 'Pending Payment', submitted: new Date("2024-07-25") },
    ],
    fines: [
        { id: "TFC-2024-001", type: "Speeding Violation", issuedDate: "2024-07-01", amount: "2000.00", dueDate: "2024-07-15", status: "Paid" },
        { id: "PRK-2024-015", type: "Parking Violation", issuedDate: "2024-07-18", amount: "1500.00", dueDate: "2024-08-01", status: "Pending" },
        { id: "TFC-2024-002", type: "Reckless Driving", issuedDate: "2024-06-10", amount: "5000.00", dueDate: "2024-06-24", status: "Paid" },
    ],
    vehicles: [
        { id: "ABC-1234", type: "Car", licensePlate: "CBA-4321", registrationDate: "2020-01-15", chassisNumber: "VEHCHASSIS12345", status: "Active", insuranceExpiry: "2025-01-14", emissionTestExpiry: "2024-12-20" },
        { id: "XYZ-5678", type: "Motorcycle", licensePlate: "BCA-9876", registrationDate: "2018-05-20", chassisNumber: "VEHCHASSIS67890", status: "Active", insuranceExpiry: "2024-08-30", emissionTestExpiry: "2024-10-15" },
    ],
    payments: [
        { service: "Fine Payment", date: new Date("2024-07-10"), amount: "2000.00", status: "Success" },
        { service: "Passport Renewal Fee", date: new Date("2024-06-15"), amount: "3500.00", status: "Success" },
        { service: "Driving License Renewal", date: new Date("2023-08-01"), amount: "2500.00", status: "Success" },
    ],
};


export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSeed = async () => {
        setLoading(true);
        setStatus("idle");

        try {
            const batch = writeBatch(db);

            // Seed Users
            seedData.users.forEach(user => {
                const userRef = doc(db, "users", user.id);
                batch.set(userRef, { ...user, joined: Timestamp.now() });
            });

            // Seed Applications
            seedData.applications.forEach(app => {
                const appRef = doc(collection(db, "applications")); // Auto-generates ID
                batch.set(appRef, { ...app, submitted: Timestamp.fromDate(app.submitted) });
            });

            // Seed Fines
            seedData.fines.forEach(fine => {
                const fineRef = doc(db, "fines", fine.id);
                batch.set(fineRef, fine);
            });

            // Seed Vehicles
            seedData.vehicles.forEach(vehicle => {
                const vehicleRef = doc(db, "vehicles", vehicle.id);
                batch.set(vehicleRef, vehicle);
            });
            
             // Seed Payments
            seedData.payments.forEach(payment => {
                const paymentRef = doc(collection(db, "payments")); // Auto-generates ID
                batch.set(paymentRef, { ...payment, date: Timestamp.fromDate(payment.date) });
            });

            await batch.commit();
            setStatus("success");
        } catch (error) {
            console.error("Error seeding database: ", error);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <Card className="max-w-xl w-full">
                <CardHeader>
                    <CardTitle>Database Seeder</CardTitle>
                    <CardDescription>
                        Use this utility to populate your Firestore database with sample data.
                        This will create users, applications, fines, vehicles, and payment records.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        Click the button below to start the seeding process. This action is irreversible and will overwrite any existing data with the same IDs.
                    </p>
                    <Button onClick={handleSeed} disabled={loading} className="w-full">
                        {loading ? "Seeding..." : "Seed Database"}
                    </Button>

                    {status === 'success' && (
                        <Alert variant="default" className="bg-green-50 border-green-200">
                           <CheckCircle className="h-4 w-4 text-green-600" />
                           <AlertTitle className="text-green-800">Seeding Successful!</AlertTitle>
                           <AlertDescription className="text-green-700">
                               Your database has been populated with sample data. You can now use the application.
                                <div className="mt-4 flex gap-4">
                                     <Button asChild variant="outline">
                                         <Link href="/login">Go to Citizen Login</Link>
                                     </Button>
                                     <Button asChild>
                                        <Link href="/admin/login">Go to Admin/Worker Login</Link>
                                     </Button>
                                </div>
                           </AlertDescription>
                        </Alert>
                    )}

                    {status === 'error' && (
                         <Alert variant="destructive">
                           <AlertTriangle className="h-4 w-4" />
                           <AlertTitle>Seeding Failed</AlertTitle>
                           <AlertDescription>
                             There was an error populating the database. Check the browser console for more details.
                           </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
