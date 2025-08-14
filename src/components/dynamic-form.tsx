"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/file-upload";
import { useAuth } from "@/hooks/use-auth";
import type {
  Field,
  ServiceFormSchema,
  TextField,
  DateField,
  SelectField,
  FileField,
  RatingField,
  NicField,
} from "@/lib/service-schemas/passport-renewal";

type Values = Record<string, any>;
type Errors = Record<string, string | undefined>;

export interface DynamicFormProps {
  schema: ServiceFormSchema;
  initialValues?: Values;
  onSubmit: (payload: {
    schema: ServiceFormSchema;
    values: Values;
    submittedAt: string;
  }) => Promise<void> | void;
}

export default function DynamicForm({
  schema,
  initialValues,
  onSubmit,
}: DynamicFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Values>(initialValues ?? {});
  const [errors, setErrors] = useState<Errors>({});

  const steps = schema.steps;
  const currentStep = steps[currentStepIndex];

  // Compute fields for current step
  const stepFields: Field[] = useMemo(() => {
    return currentStep.fields
      .map((fid) => schema.fields.find((f) => f.id === fid))
      .filter(Boolean) as Field[];
  }, [currentStep, schema.fields]);

  // Autofill NIC if defined and empty
  useEffect(() => {
    const nicField = schema.fields.find((f) => f.type === "nic") as NicField | undefined;
    if (nicField?.autoFill && user?.nic && !values[nicField.id]) {
      setValues((v) => ({ ...v, [nicField.id]: user.nic }));
    }
  }, [schema.fields, user?.nic, values]);

  const setValue = useCallback((id: string, val: any) => {
    setValues((v) => ({ ...v, [id]: val }));
    setErrors((e) => ({ ...e, [id]: undefined }));
  }, []);

  const validateFields = useCallback(
    (fields: Field[]): Errors => {
      const stepErrors: Errors = {};
      for (const f of fields) {
        const val = values[f.id];
        if (f.required) {
          const isEmpty =
            val === undefined ||
            val === null ||
            (typeof val === "string" && val.trim() === "") ||
            (Array.isArray(val) && val.length === 0);
          if (isEmpty) {
            stepErrors[f.id] = "This field is required.";
            continue;
          }
        }
        // Basic custom checks for prototype
        if (f.type === "file") {
          const ff = f as FileField;
          if (val && ff.maxSizeMB) {
            // We only have base64 here; size already checked by FileUpload. Skip.
          }
        }
        if (f.type === "text") {
          const tf = f as TextField;
          if (tf.inputMode === "email" && val) {
            const re =
              // Simple RFC5322-ish email check
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(val)) {
              stepErrors[f.id] = "Enter a valid email.";
            }
          }
          if (tf.maxLength && typeof val === "string" && val.length > tf.maxLength) {
            stepErrors[f.id] = `Max length is ${tf.maxLength}.`;
          }
        }
      }
      return stepErrors;
    },
    [values]
  );

  const goNext = () => {
    const errs = validateFields(stepFields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast({
        variant: "destructive",
        title: "Fix required fields",
        description: "Please complete the highlighted fields to continue.",
      });
      return;
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i: number) => i + 1);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i: number) => i - 1);
    }
  };

  const handleSubmit = async () => {
    const allErrs = validateFields(stepFields);
    if (Object.keys(allErrs).length > 0) {
      setErrors(allErrs);
      toast({
        variant: "destructive",
        title: "Fix required fields",
        description: "Please complete the highlighted fields to submit.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        schema,
        values,
        submittedAt: new Date().toISOString(),
      };
      // Structured debug log
      // eslint-disable-next-line no-console
      console.log("[DynamicForm] Submit payload", payload);
      await onSubmit(payload);
      toast({
        title: "Submitted",
        description: "Your application has been submitted.",
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error("Submit failed", e);
      toast({
        variant: "destructive",
        title: "Submit failed",
        description: e?.message ?? "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (f: Field) => {
    const err = errors[f.id];
    const help = f.helpText;

    switch (f.type) {
      case "text": {
        const tf = f as TextField;
        let type: React.HTMLInputTypeAttribute = "text";
        if (tf.inputMode === "email") type = "email";
        return (
          <div key={f.id} className="space-y-2">
            <Label htmlFor={f.id}>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <Input
              id={f.id}
              type={type}
              value={values[f.id] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(f.id, e.target.value)}
              placeholder={tf.inputMode === "nic" ? "Enter NIC" : undefined}
            />
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      case "date": {
        const df = f as DateField;
        return (
          <div key={f.id} className="space-y-2">
            <Label htmlFor={f.id}>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <Input
              id={f.id}
              type="date"
              value={values[f.id] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(f.id, e.target.value)}
              min={df.min}
              max={df.max}
            />
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      case "select": {
        const sf = f as SelectField;
        return (
          <div key={f.id} className="space-y-2">
            <Label>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <Select
              value={values[f.id] ?? ""}
              onValueChange={(val: string) => setValue(f.id, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {sf.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      case "file": {
        const ff = f as FileField;
        return (
          <div key={f.id} className="space-y-2">
            <Label>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <FileUpload
              id={f.id}
              label={`Upload (${ff.accept?.join(", ") || "file"})`}
              onUploadComplete={(base64) => setValue(f.id, base64)}
              onFileRemove={() => setValue(f.id, undefined)}
            />
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      case "rating": {
        const rf = f as RatingField;
        return (
          <div key={f.id} className="space-y-2">
            <Label htmlFor={f.id}>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <Input
              id={f.id}
              type="number"
              min={1}
              max={rf.scale}
              value={values[f.id] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(f.id, Number(e.target.value))}
            />
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      case "nic": {
        const nf = f as NicField;
        const isReadonly = nf.autoFill === true;
        return (
          <div key={f.id} className="space-y-2">
            <Label htmlFor={f.id}>
              {f.label} {f.required ? <span className="text-destructive">*</span> : null}
            </Label>
            <Input
              id={f.id}
              type="text"
              value={values[f.id] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(f.id, e.target.value)}
              readOnly={isReadonly}
              disabled={isReadonly}
              placeholder={isReadonly ? "Auto-filled" : "Enter NIC"}
            />
            {help ? <p className="text-xs text-muted-foreground">{help}</p> : null}
            {err ? <p className="text-xs text-destructive">{err}</p> : null}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{currentStep.title}</h2>
        {currentStep.description ? (
          <p className="text-sm text-muted-foreground">{currentStep.description}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stepFields.map((f) => renderField(f))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
        <div className="flex gap-2">
          {currentStepIndex > 0 ? (
            <Button type="button" variant="secondary" onClick={goBack} disabled={submitting}>
              Back
            </Button>
          ) : null}
          {currentStepIndex < steps.length - 1 ? (
            <Button type="button" onClick={goNext} disabled={submitting}>
              Next
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
