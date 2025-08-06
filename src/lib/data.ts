import type { NavItem, Service } from "./types";
import { Home, Briefcase, Users, MoreHorizontal, Landmark, FileQuestion, Car, Fingerprint, GraduationCap, FileText, HeartPulse, CreditCard, LifeBuoy } from 'lucide-react';

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
    title: "Family & Dependents",
    href: "/family",
    icon: Users,
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
    title: "Renew Driving License",
    slug: "renew-driving-license",
    description: "Renew your driving license before it expires.",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Car",
    actions: [],
    content: {
        longDescription: "This service enables citizens to renew their driving licenses. The renewal process can be initiated before the expiry date. A medical fitness certificate is required for certain age groups and license categories.",
        sections: [
            {
                title: "Renewal Process",
                content: "To renew your driving license, please follow these steps:",
                list: [
                    "Obtain a medical fitness certificate from a government hospital or a registered medical practitioner.",
                    "Visit the Department of Motor Traffic (DMT) head office or a district office.",
                    "Submit the completed renewal application form.",
                    "Provide your current driving license, National Identity Card, and the medical certificate.",
                    "Pay the renewal fee at the counter.",
                    "Your photograph and biometric data will be captured, and the new license will be issued."
                ]
            },
            {
                title: "Fees and Charges",
                content: "The fee for renewal depends on the license category and the validity period. Please refer to the latest fee schedule on the DMT website for accurate information."
            }
        ]
    }
  },
  {
    title: "Taqdeer",
    slug: "taqdeer",
    description: "A government appreciation program for citizens.",
    status: "Renewal Due",
    statusVariant: "warning",
    icon: "Landmark",
    actions: [],
    content: {
        longDescription: "Taqdeer is a national appreciation program designed to recognize and reward the contributions of outstanding citizens and residents. The program aims to foster a culture of excellence and community service across various fields.",
        sections: [
            {
                title: "About the Program",
                content: "The Taqdeer program evaluates individuals based on their professional achievements, community involvement, and adherence to national values. It is open to all citizens who meet the eligibility criteria."
            },
            {
                title: "How to Participate",
                content: "Nominations can be submitted through the official Taqdeer portal. Applicants are required to provide detailed information about their accomplishments and contributions, supported by relevant documents.",
                list: [
                    "Visit the official Taqdeer program website.",
                    "Create an account or log in.",
                    "Complete the online nomination form with accurate details.",
                    "Upload supporting documents, awards, and certificates.",
                    "Submit the application before the deadline."
                ]
            }
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
    title: "Exam Results",
    slug: "exam-results",
    description: "Check national examination results for GCE O/L and A/L.",
    status: "Not Applied",
    statusVariant: "default",
    icon: "GraduationCap",
    actions: [{ label: "Check Results", variant: "default" }],
    content: {
        longDescription: "The Department of Examinations, Sri Lanka, is responsible for conducting major national examinations, including the G.C.E. Ordinary Level (O/L) and Advanced Level (A/L). This service allows students to check their results online.",
        sections: [
            {
                title: "How to Check Results",
                content: "When results are released, they can be accessed through the official department website. You will need your examination index number to view your results.",
                list: [
                    "Visit the official website of the Department of Examinations (doenets.lk).",
                    "Navigate to the 'School Exams' or 'Results' section.",
                    "Select the relevant examination (e.g., G.C.E. A/L).",
                    "Enter your index number in the provided field.",
                    "Your results will be displayed on the screen."
                ]
            },
            {
                title: "Re-scrutiny of Results",
                content: "If you are not satisfied with your results, you can apply for re-scrutiny. The application process and deadlines are announced on the website shortly after the results are released."
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
  }
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
