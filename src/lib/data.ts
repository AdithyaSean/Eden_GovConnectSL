
import type { NavItem, Service } from "./types";
import { Home, Briefcase, Users, MoreHorizontal, Landmark, FileQuestion, Car, Fingerprint, GraduationCap, FileText, HeartPulse, CreditCard, LifeBuoy, Zap, BookUser, ReceiptText, Calendar, FilePenLine } from 'lucide-react';

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "My Applications",
    href: "/my-applications",
    icon: Briefcase,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Support",
    href: "/support",
    icon: LifeBuoy,
  },
];

export const services: Service[] = [
  {
    title: "Missing Documents",
    slug: "missing-documents",
    description: "Report and replace lost official documents.",
    status: "Active",
    statusVariant: "success",
    icon: "FileQuestion",
    actions: [],
     content: {
      longDescription: "This service assists citizens in reporting and obtaining replacements for lost or stolen official documents such as National Identity Cards, Passports, and Driving Licenses. The process involves lodging a police complaint and submitting an application to the respective issuing authority.",
      sections: [
        {
          title: "Procedure to Follow",
          content: "If you have lost an important document, follow these steps to get a replacement:",
          list: [
            "File a complaint at the nearest police station immediately and obtain a certified copy of the complaint.",
            "Visit the official website or the nearest office of the authority that issued the document (e.g., Department for Registration of Persons for NIC).",
            "Fill out the appropriate application form for a duplicate document.",
            "Submit the application along with the police report, photographs, and any other required supporting documents.",
            "Pay the prescribed fee for the issuance of a duplicate document."
          ]
        },
        {
          title: "Required Documents",
          content: "You will typically need the following:",
           list: [
            "Certified copy of the police complaint.",
            "Completed application form.",
            "Recent passport-sized photographs (as specified).",
            "Proof of identity (e.g., birth certificate, affidavit).",
            "Receipt of payment for the processing fee."
          ]
        }
      ]
    }
  },
  {
    title: "Driving Licence Services",
    slug: "driving-licence-services",
    description: "Apply for a new license or renew an existing one.",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Car",
    actions: [],
    content: {
        longDescription: "This service enables citizens to apply for a new driving license or renew their existing one. A medical fitness certificate may be required for certain age groups and license categories.",
        sections: [
            {
                title: "Application Process",
                content: "To apply for or renew your driving license, please follow these steps:",
                list: [
                    "Obtain a medical fitness certificate from a government hospital or a registered medical practitioner if required.",
                    "Visit the Department of Motor Traffic (DMT) head office or a district office.",
                    "Submit the completed application form for a new license or renewal.",
                    "Provide your National Identity Card and other necessary documents.",
                    "Pay the relevant fee at the counter.",
                    "Your photograph and biometric data will be captured. For new licenses, a written and practical test is required."
                ]
            },
            {
                title: "Fees and Charges",
                content: "The fees depend on the license category and the type of service. Please refer to the latest fee schedule on the DMT website for accurate information."
            }
        ]
    }
  },
  {
    title: "Passport Services",
    slug: "passport-services",
    description: "Apply for a new passport or renew your existing one.",
    status: "Active",
    statusVariant: "success",
    icon: "BookUser",
    actions: [],
    content: {
      longDescription: "This service allows you to apply for a new Sri Lankan passport or renew an existing one online. You can fill out the form, upload the required documents, and submit your application for processing.",
      sections: [
        {
          title: "Instructions",
          content: "Please ensure all details are accurate and the uploaded documents are clear and legible. Any incorrect information may lead to delays or rejection of your application."
        },
      ]
    }
  },
  {
    title: "National ID Services",
    slug: "national-id-services",
    description: "Apply for or manage your National Identity Card.",
    status: "Not Applied",
    statusVariant: "destructive",
    icon: "Fingerprint",
    actions: [],
    content: {
        longDescription: "The National Identity Card (NIC) is a crucial document for every Sri Lankan citizen. The Department for Registration of Persons is responsible for issuing new NICs, renewing them, and making amendments.",
        sections: [
            {
                title: "Applying for a New NIC",
                content: "Citizens who have reached the age of 15 are required to apply for a National Identity Card. The application must be certified by the Grama Niladhari and submitted to the Divisional Secretariat.",
                list: [
                    "Obtain the application form from the Grama Niladhari or download it online.",
                    "Fill the form accurately and get it certified by the Grama Niladhari.",
                    "Attach the birth certificate, and certified photographs.",
                    "Submit the application to your local Divisional Secretariat."
                ]
            },
            {
                title: "Amending Details on NIC",
                content: "To change your name, address, or other details on the NIC, a separate application must be submitted with documentary proof for the requested change (e.g., marriage certificate for name change)."
            }
        ]
    }
  },
  {
    title: "Land Registry",
    slug: "land-registry",
    description: "Access land ownership records and related services.",
    status: "Active",
    statusVariant: "success",
    icon: "Landmark",
    actions: [{ label: "View Records", variant: "secondary" }],
    content: {
        longDescription: "The Land Registry Department maintains records of land ownership and transactions in Sri Lanka. Citizens can access these records to verify ownership, check for encumbrances, and obtain certified copies of deeds.",
        sections: [
            {
                title: "Services Offered",
                content: "The Land Registry provides a range of services:",
                list: [
                    "Registration of new land deeds and titles.",
                    "Issuance of certified copies of deeds and title reports.",
                    "Search of land records to verify ownership and check for liens.",
                    "Registration of mortgages and other encumbrances."
                ]
            },
            {
                title: "How to Search for a Property",
                content: "To perform a search, you need to visit the respective Land Registry office where the property is located. You will need to provide the property details such as the deed number, volume, and folio numbers. A search fee is applicable."
            }
        ]
    }
  },
  {
    title: "Exam Re-correction Appeal",
    slug: "exam-recorrection-appeal",
    description: "Appeal for a re-correction of your exam results.",
    status: "Not Applied",
    statusVariant: "default",
    icon: "FilePenLine",
    actions: [{ label: "Submit Appeal", variant: "default" }],
    content: {
        longDescription: "This service allows candidates who are not satisfied with their G.C.E. O/L or A/L results to apply for a re-correction of their answer scripts. Applications must be submitted within the specified period.",
        sections: [
            {
                title: "How to Apply for Re-correction",
                content: "If you believe there has been an error in the marking of your exam papers, you can submit an appeal for re-correction through this portal.",
                list: [
                    "Select the examination type (G.C.E. O/L or A/L).",
                    "Enter your index number and the year of the examination.",
                    "Specify the subject(s) you wish to have re-corrected.",
                    "Provide a valid reason for your appeal.",
                    "Pay the re-correction fee online to complete the submission."
                ]
            },
            {
                title: "Important Notice",
                content: "Please note that the re-correction process may result in your marks increasing, decreasing, or remaining unchanged. The decision of the Department of Examinations will be final."
            }
        ]
    }
  },
  {
    title: "Pension Department",
    slug: "pension-department",
    description: "Access pension schemes and information for government retirees.",
    status: "Not Applied",
    statusVariant: "destructive",
    icon: "FileText",
    actions: [{ label: "Learn More", variant: "secondary" }],
    content: {
        longDescription: "The Department of Pensions is dedicated to managing the pension schemes for retired public sector employees. The department ensures timely payment of pensions and provides various services to pensioners.",
        sections: [
            {
                title: "Services for Pensioners",
                content: "The department offers several services to support retired government employees:",
                list: [
                    "Processing of new pension applications.",
                    "Monthly disbursement of pension payments.",
                    "Issuance of Pensioner's ID cards.",
                    "Management of the Widows' and Orphans' Pension Scheme.",
                    "Addressing pensioner grievances and inquiries."
                ]
            },
            {
                title: "Obtaining a Pension",
                content: "The process of obtaining a pension begins a few months before retirement. The respective government institution initiates the process by forwarding the pension files to the Department of Pensions. The retiree must ensure all their service records are accurate and complete."
            }
        ]
    }
  },
  {
    title: "Tax Payments (IRD)",
    slug: "tax-payments-ird",
    description: "File tax returns and manage payments with the Inland Revenue Department.",
    status: "Active",
    statusVariant: "success",
    icon: "FileText",
    actions: [{ label: "File Return", variant: "default" }],
    content: {
        longDescription: "The Inland Revenue Department (IRD) of Sri Lanka is the primary body responsible for the administration of the country's tax system. This service allows individuals and businesses to file their tax returns and make payments online.",
        sections: [
            {
                title: "Filing Your Tax Return",
                content: "Taxpayers can register for an online account on the IRD e-Services portal to file their returns electronically. This is a convenient and efficient way to meet your tax obligations.",
                list: [
                    "Visit the IRD e-Services portal and register for an account.",
                    "Log in with your credentials.",
                    "Select the appropriate tax type and year.",
                    "Fill in the online tax return form with your income and deduction details.",
                    "Review the summary and submit your return."
                ]
            },
            {
                title: "Making Tax Payments",
                content: "Online payments can be made through the portal using various methods, including direct bank transfers and credit/debit cards. Ensure you make payments before the due date to avoid penalties."
            }
        ]
    }
  },
  {
    title: "Health Services",
    slug: "health-services",
    description: "Access public health services, records, and appointments.",
    status: "Active",
    statusVariant: "success",
    icon: "HeartPulse",
    actions: [],
    content: {
      longDescription: "Manage your public health needs by accessing vaccination records, booking hospital appointments, downloading medical reports, and applying for health-related benefits.",
      sections: [
        {
          title: "Vaccination Records",
          content: "View your complete history of vaccinations, including COVID-19 and other national immunization programs."
        },
        {
          title: "Book Appointments",
          content: "Schedule appointments at government hospitals and clinics for consultations, check-ups, and specialized treatments."
        }
      ]
    }
  },
  {
    title: "Fine Payment",
    slug: "fine-payment",
    description: "View and pay traffic or other government fines.",
    status: "Active",
    statusVariant: "success",
    icon: "ReceiptText",
    actions: [],
    content: {
      longDescription: "View your fine history and pay any outstanding penalties for traffic violations or other government-related infractions.",
      sections: [
        {
          title: "Your Fines",
          content: "Below is a list of all pending and paid fines associated with your account."
        }
      ]
    }
  },
  {
    title: "Registered Vehicles",
    slug: "registered-vehicles",
    description: "View all vehicles registered under your NIC.",
    status: "Active",
    statusVariant: "success",
    icon: "Car",
    actions: [],
    content: {
      longDescription: "View and manage all vehicles registered under your National Identity Card. Check registration status, download certificates, and get notified about upcoming renewals.",
      sections: [
        {
          title: "Your Registered Vehicles",
          content: "A list of all vehicles currently registered under your name."
        }
      ]
    }
  }
];
