
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, History, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import type { Payment, Fine, TaxRecord } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";


export default function PaymentsPage() {
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [mustPayItems, setMustPayItems] = useState<(Fine | TaxRecord)[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMustPay, setLoadingMustPay] = useState(true);
    const [viewMode, setViewMode] = useState<'history' | 'mustPay'>('history');
    const { user } = useAuth();

    useEffect(() => {
        const fetchPayments = async () => {
            if (!user) {
              setLoading(false);
              return;
            }
            
            setLoading(true);
            try {
                const q = query(collection(db, "payments"), where("userId", "==", user.id));
                const querySnapshot = await getDocs(q);
                const paymentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
                
                const sortedPayments = paymentsData.sort((a, b) => {
                    const dateA = a.date instanceof Timestamp ? a.date.toMillis() : new Date(a.date).getTime();
                    const dateB = b.date instanceof Timestamp ? b.date.toMillis() : new Date(b.date).getTime();
                    return dateB - dateA;
                });

                setPaymentHistory(sortedPayments);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMustPayItems = async () => {
            if (!user || !user.nic) {
                setLoadingMustPay(false);
                return;
            }
            setLoadingMustPay(true);
            try {
                const finesQuery = query(collection(db, "fines"), where("nic", "==", user.nic), where("status", "==", "Pending"));
                const taxesQuery = query(collection(db, "taxRecords"), where("nic", "==", user.nic), where("status", "==", "Due"));

                const [finesSnapshot, taxesSnapshot] = await Promise.all([
                    getDocs(finesQuery),
                    getDocs(taxesQuery)
                ]);

                const finesData = finesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fine));
                const taxesData = taxesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TaxRecord));
                
                setMustPayItems([...finesData, ...taxesData]);

            } catch (error) {
                console.error("Error fetching must-pay items:", error);
            } finally {
                setLoadingMustPay(false);
            }
        };

        if(user){
            fetchPayments();
            fetchMustPayItems();
        }
    }, [user]);
    
    const formatDate = (date: Timestamp | string | undefined) => {
        if (!date) return 'N/A';
        if (typeof date === 'string') return new Date(date).toLocaleDateString();
        if(date instanceof Timestamp) return date.toDate().toLocaleDateString();
        return 'Invalid Date';
    };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
        
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <CardTitle>Payment Center</CardTitle>
                    <CardDescription>
                        {viewMode === 'history' 
                            ? "View your past transactions and download receipts."
                            : "A list of outstanding payments that require your attention."}
                    </CardDescription>
                </div>
                 <div className="flex items-center gap-2 mt-4 md:mt-0 p-1 bg-muted rounded-lg">
                    <Button variant={viewMode === 'history' ? 'default' : 'ghost'} onClick={() => setViewMode('history')} className="flex-1 justify-center">
                        <History className="mr-2 h-4 w-4" /> Payment History
                    </Button>
                    <Button variant={viewMode === 'mustPay' ? 'default' : 'ghost'} onClick={() => setViewMode('mustPay')} className="flex-1 justify-center relative">
                        <AlertTriangle className="mr-2 h-4 w-4" /> Must Pay
                         {mustPayItems.length > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 px-2">{mustPayItems.length}</Badge>
                         )}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                 {viewMode === 'history' ? (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reference ID</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount (LKR)</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : paymentHistory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">You have no payment history.</TableCell>
                                </TableRow>
                            ) : (
                                paymentHistory.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium truncate max-w-28">{payment.applicationRef || payment.id}</TableCell>
                                    <TableCell>{payment.service}</TableCell>
                                    <TableCell>{formatDate(payment.date)}</TableCell>
                                    <TableCell>{payment.amount}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${payment.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{payment.status}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/receipt/${payment.id}`}>
                                                View Receipt <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )))}
                        </TableBody>
                    </Table>
                 ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item/Service</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Amount (LKR)</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {loadingMustPay ? (
                                <TableRow><TableCell colSpan={5}><Skeleton className="h-8"/></TableCell></TableRow>
                             ) : mustPayItems.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="h-24 text-center">No outstanding payments found. Great job!</TableCell></TableRow>
                             ) : (
                                 mustPayItems.map(item => (
                                     <TableRow key={item.id}>
                                         <TableCell className="font-medium">{'year' in item ? 'Tax Payment' : 'Fine Payment'}</TableCell>
                                         <TableCell>{item.type}</TableCell>
                                         <TableCell>{formatDate(item.dueDate)}</TableCell>
                                         <TableCell>LKR {item.amount}</TableCell>
                                         <TableCell className="text-right">
                                             <Button asChild size="sm">
                                                  <Link href={`/payment?service=${encodeURIComponent('year' in item ? `Tax: ${item.type}` : `Fine: ${item.type}`)}&amount=${item.amount}&ref=${item.id}`}>
                                                      Pay Now
                                                  </Link>
                                             </Button>
                                         </TableCell>
                                     </TableRow>
                                 ))
                             )}
                        </TableBody>
                    </Table>
                 )}
              </div>
            </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
