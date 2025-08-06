"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '../file-upload';

const documentsMap = {
  nic: ["Police Report", "Birth Certificate", "Certified Photograph"],
  passport: ["Police Report", "National Identity Card Copy", "Birth Certificate Copy"],
  driving_license: ["Police Report", "National Identity Card Copy", "Medical Certificate (if applicable)"],
};

export function MissingDocumentsService({ service }) {
  const [selectedService, setSelectedService] = useState('');
  const requiredDocs = selectedService ? documentsMap[selectedService] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report and Replace Missing Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Document Type</label>
          <Select onValueChange={setSelectedService} value={selectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Select the document you lost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nic">National Identity Card (NIC)</SelectItem>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="driving_license">Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedService && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Required Documents:</h3>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                {requiredDocs.map(doc => <li key={doc}>{doc}</li>)}
              </ul>
            </div>
            
            <h3 className="font-semibold pt-4 border-t">Upload Your Documents:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocs.map(doc => (
                    <FileUpload key={doc} label={doc} />
                ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Save Progress</Button>
        <Button disabled={!selectedService}>Submit Application</Button>
      </CardFooter>
    </Card>
  );
}
