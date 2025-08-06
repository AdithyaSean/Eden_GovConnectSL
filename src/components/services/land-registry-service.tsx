
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import Link from 'next/link';

export function LandRegistryService({ service }) {
  return (
    <div className="space-y-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Records</TabsTrigger>
            <TabsTrigger value="register">New Registration</TabsTrigger>
          </TabsList>
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Search for Land Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="deedNumber">Deed Number</Label>
                        <Input id="deedNumber" placeholder="e.g., 1234/56" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ownerName">Owner's Name</Label>
                        <Input id="ownerName" placeholder="Full name of the owner" />
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Search Records</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Apply for New Land Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold">Property Details</h3>
                     <div className="space-y-2">
                        <Label htmlFor="propertyAddress">Property Address</Label>
                        <Textarea id="propertyAddress" placeholder="Full address of the land" />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold">Upload Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUpload label="Deed / Title Document" />
                        <FileUpload label="Survey Plan" />
                    </div>
                </div>
              </CardContent>
               <CardFooter className="flex justify-between items-center">
                <div>
                    <p className="font-semibold">Applicable Fees</p>
                    <p className="text-muted-foreground">Stamp Duty: 4%, Registration Fee: LKR 1000</p>
                </div>
                <Button asChild>
                    <Link href="/payment?service=Land+Registration&amount=1000.00">Submit for Registration</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
         <Card>
            <CardHeader>
                <CardTitle>Contact Regional Offices</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Colombo Land Registry:</strong> 011-2694561</p>
                <p><strong>Kandy Land Registry:</strong> 081-2223456</p>
                <p><strong>Galle Land Registry:</strong> 091-2232456</p>
            </CardContent>
        </Card>
    </div>
  );
}
