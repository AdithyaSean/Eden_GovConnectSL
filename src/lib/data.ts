import type { NavItem, Service } from "./types";
import { Home, Briefcase, User, MoreHorizontal } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "My Services",
    href: "#",
    icon: Briefcase,
  },
  {
    title: "Family",
    href: "#",
    icon: User,
  },
  {
    title: "Other Services",
    href: "#",
    icon: MoreHorizontal,
  },
];

export const services: Service[] = [
  {
    title: "Missing Documents",
    description: "",
    status: "Active",
    statusVariant: "success",
    icon: "FileQuestion",
    actions: [],
  },
  {
    title: "Renew Driving License",
    description: "",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Car",
    actions: [],
  },
  {
    title: "Taqdeer",
    description: "",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Landmark",
    actions: [],
  },
  {
    title: "National ID Services",
    description: "",
    status: "Not Applied",
    statusVariant: "destructive",
    icon: "Fingerprint",
    actions: [],
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


export const trafficServices = [
  {
    title: "Toyota Aqua",
    description: "WP-CAR-1234",
    icon: "Car"
  },
   {
    title: "Honda Vezel",
    description: "SP-CAB-5678",
    icon: "Car"
  }
]
