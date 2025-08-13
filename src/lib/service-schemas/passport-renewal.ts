/* eslint-disable @typescript-eslint/no-explicit-any */

export type SubmissionMode = "direct" | "pdf" | "externalAutomation";

export type InputMode = "text" | "email" | "nic";

export interface PaymentConfig {
  amount: number;
  currency: string;
  requiredBeforeSubmission?: boolean;
}

export interface Step {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // ids referencing Field
  // For prototype keep condition/DSL minimal (future: Expr DSL)
  condition?: unknown;
}

export interface FieldBase {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
  // Prototype only: structure reserved for future logic
  dependsOn?: Array<{ fieldId: string; equals?: any }>;
}

export interface TextField extends FieldBase {
  type: "text";
  inputMode?: InputMode;
  maxLength?: number;
}

export interface DateField extends FieldBase {
  type: "date";
  min?: string; // ISO or relative (prototype uses ISO only)
  max?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectField extends FieldBase {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
}

export interface FileField extends FieldBase {
  type: "file";
  accept: string[]; // e.g. ["image/jpeg"]
  maxSizeMB?: number;
}

export interface RatingField extends FieldBase {
  type: "rating";
  scale: number;
}

export interface NicField extends FieldBase {
  type: "nic";
  autoFill: true;
}

export type Field =
  | TextField
  | DateField
  | SelectField
  | FileField
  | RatingField
  | NicField;

export interface ServiceFormSchema {
  serviceSlug: string;
  version: number;
  steps: Step[];
  paymentConfig?: PaymentConfig;
  submissionMode: SubmissionMode;
  fields: Field[]; // flat registry by id for reference in steps
}

// Helper to find a field by id
export function getField(schema: ServiceFormSchema, id: string): Field | undefined {
  return schema.fields.find((f) => f.id === id);
}

/**
 * Example Schema: Passport Renewal (Prototype)
 * Mirrors docs/service-schema.md
 */
export const passportRenewalSchema: ServiceFormSchema = {
  serviceSlug: "passport-renewal",
  version: 1,
  submissionMode: "externalAutomation",
  paymentConfig: { amount: 5000, currency: "LKR", requiredBeforeSubmission: false },
  fields: [
    { id: "fullName", type: "text", label: "Full Name", required: true },
    { id: "nic", type: "nic", label: "National ID", required: true, helpText: "Auto-filled", autoFill: true },
    { id: "dob", type: "date", label: "Date of Birth", required: true },
    { id: "photo", type: "file", label: "Passport Photo", accept: ["image/jpeg"], required: true, maxSizeMB: 2 },
    { id: "appointmentDate", type: "date", label: "Preferred Appointment Date" },
    {
      id: "urgency",
      type: "select",
      label: "Urgency",
      options: [
        { value: "normal", label: "Normal" },
        { value: "urgent", label: "Urgent" },
      ],
    },
  ],
  steps: [
    { id: "personal", title: "Personal Info", fields: ["fullName", "nic", "dob"] },
    { id: "documents", title: "Documents", fields: ["photo"] },
    { id: "appointment", title: "Appointment", fields: ["appointmentDate", "urgency"] },
  ],
};
