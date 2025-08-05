import type { NavItem, Service } from "./types";
import { Home, Settings, Fingerprint, BookUser, Car, Briefcase, Landmark, GraduationCap } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "National ID",
    href: "#",
    icon: Fingerprint,
  },
  {
    title: "Passport",
    href: "#",
    icon: BookUser,
  },
  {
    title: "Driving License",
    href: "#",
    icon: Car,
  },
  {
    title: "Business Registration",
    href: "#",
    icon: Briefcase,
  },
  {
    title: "Land Registry",
    href: "#",
    icon: Landmark,
  },
  {
    title: "Exam Results",
    href: "#",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    href: "#",
    icon: Settings,
  },
];

export const services: Service[] = [
  {
    title: "National Identity Card",
    description: "Apply for a new NIC or renew your existing one.",
    status: "Active",
    statusVariant: "success",
    icon: "Fingerprint",
    actions: [
      { label: "View Details", variant: "secondary" },
      { label: "Renew", variant: "default" },
    ],
  },
  {
    title: "Passport Services",
    description: "Apply for a new passport or renew your travel document.",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "BookUser",
    actions: [{ label: "Renew Now", variant: "default" }],
  },
  {
    title: "Driving License",
    description: "Services for new licenses, renewals, and information updates.",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Car",
    actions: [{ label: "Renew Now", variant: "default" }],
  },
  {
    title: "Business Registration",
    description: "Register a new business or manage existing registrations.",
    status: "Not Applied",
    statusVariant: "destructive",
    icon: "Briefcase",
    actions: [{ label: "Apply Now", variant: "default" }],
  },
  {
    title: "Land Registry",
    description: "Access land ownership records and related services.",
    status: "Active",
    statusVariant: "success",
    icon: "Landmark",
    actions: [{ label: "View Records", variant: "secondary" }],
  },
  {
    title: "Exam Results",
    description: "Check national examination results for GCE O/L and A/L.",
    status: "Not Applied",
    statusVariant: "default",
    icon: "GraduationCap",
    actions: [{ label: "Check Results", variant: "default" }],
  },
  {
    title: "Pension Department",
    description: "Access pension schemes and information for government retirees.",
    status: "Not Applied",
    statusVariant: "destructive",
    icon: "FileText",
    actions: [{ label: "Learn More", variant: "secondary" }],
  },
  {
    title: "Tax Payments (IRD)",
    description: "File tax returns and manage payments with the Inland Revenue Department.",
    status: "Active",
    statusVariant: "success",
    icon: "FileText",
    actions: [{ label: "File Return", variant: "default" }],
  },
];