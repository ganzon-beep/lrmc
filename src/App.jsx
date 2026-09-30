import SiteHeader from './components/SiteHeader.jsx'
import { useEffect, useState } from 'react'
import SuggestUpdate from './pages/SuggestUpdate.jsx'
import AboutLrmc from './pages/AboutLrmc.jsx'
import CareersLrmc from './pages/CareersLrmc.jsx'
import TjoLanding from './pages/TjoLanding.jsx'

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const journeyStages = [
  ['01', 'Offer & orders', 'From tentative offer to travel orders'],
  ['02', 'Pre-arrival', 'Make the move feel manageable'],
  ['03', 'Arrival', 'Handle the first essentials'],
  ['04', 'Days 30 · 60 · 90', 'Settling into your new life'],
]

const relocationStageMap = {
  tjo: { phase: 'Offer & orders', label: 'Tentative Job Offer received' },
  fjo: { phase: 'Pre-arrival', label: 'Final offer or orders received' },
  arrival: { phase: 'Arrival', label: 'Arrived in the LRMC community' },
}

const relocationProfileLabels = {
  family: 'Moving with family',
  school: 'School or childcare',
  pets: 'Moving with pets',
  vehicle: 'Shipping a vehicle',
  housing: 'Housing guidance',
  'new-federal': 'New to federal service',
}

const relocationAppointmentLabels = {
  'new-federal': 'New federal appointment',
  'current-federal': 'Current federal employee',
  other: 'Another or uncertain joining path',
}

const relocationProfileTags = {
  family: ['Family', 'Passports', 'Documents'],
  school: ['Family'],
  pets: ['Pets'],
  vehicle: ['Vehicle', 'Driving'],
  housing: ['Housing', 'Home', 'Utilities'],
  'new-federal': ['Offer', 'Finance', 'Benefits', 'Healthcare', 'Documents'],
}

const readRelocationProfile = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('lrmc-relocation-profile') || '{}')
    return {
      appointment: relocationAppointmentLabels[profile.appointment] ? profile.appointment : null,
      stage: relocationStageMap[profile.stage] ? profile.stage : null,
      selected: Array.isArray(profile.selected)
        ? profile.selected.filter((item) => relocationProfileLabels[item])
        : [],
    }
  } catch {
    return { appointment: null, stage: null, selected: [] }
  }
}

const phaseTips = {
  'Offer & orders': {
    label: 'Good to know',
    title: 'Plan for upfront PCS costs',
    detail: 'Many PCS expenses can come due before allowances or reimbursements are paid. As a planning target, some households may want $10,000–$25,000 readily accessible, adjusted for family size, temporary lodging, deposits, pets, and vehicle costs.',
    note: 'This is a planning buffer, not an entitlement estimate. Ask your HR or finance office which expenses and advances are authorized for your specific move before making financial decisions.',
  },
}

const phaseTasks = [
  {
    id: 'temporary-offer',
    phase: 'Offer & orders',
    milestone: 'After your Tentative Job Offer (TJO)',
    window: 'Start here',
    title: 'Review your Tentative Job Offer (TJO)',
    detail: 'Confirm the position, duty location, grade, and the HR contact listed in your offer.',
    tag: 'Offer',
    forms: [
      {
        number: 'OF 306',
        title: 'Declaration for Federal Employment',
        note: 'Complete or recertify only when instructed by HR.',
        url: 'https://www.opm.gov/forms/pdf_fill/of0306.pdf',
      },
    ],
  },
  {
    id: 'start-document-folder',
    phase: 'Offer & orders',
    milestone: 'After your Tentative Job Offer (TJO)',
    window: 'This week',
    title: 'Start your PCS document folder',
    detail: 'Keep your offer, passports, marriage or birth certificates, pet records, medical records, and receipts together.',
    tag: 'Documents',
  },
  {
    id: 'audit-health-insurance',
    phase: 'Offer & orders',
    milestone: 'After your Tentative Job Offer (TJO)',
    window: 'Before enrollment closes',
    title: 'Audit your overseas health coverage',
    detail: 'Review your FEHB plan for care on the German economy, overseas claims, deductibles, and direct-billing support. Civilian employees are not empaneled and generally do not receive a military primary care manager (PCM). Space-available access applies to specialty care, not primary care. Eligible retirees may apply for TRICARE Plus during an announced open-enrollment period—often beginning in November—but enrollment is capacity-based and requires LRMC approval.',
    tag: 'Healthcare',
    forms: [
      {
        number: 'SF 2809',
        title: 'Health Benefits Election Form',
        note: 'Your agency may require an electronic benefits system instead.',
        url: 'https://www.opm.gov/forms/pdf_fill/sf2809.pdf',
      },
    ],
  },
  {
    id: 'final-offer',
    phase: 'Offer & orders',
    milestone: 'After your Final Job Offer (FJO)',
    window: 'When received',
    title: 'Verify your Final Job Offer (FJO) and travel orders',
    detail: 'Check names, dependents, allowances, and the authorized travel details before booking.',
    tag: 'Orders',
    forms: [
      {
        number: 'DD 1614',
        title: 'Request for Permanent Duty or TCS Travel',
        note: 'Normally prepared and issued by the authorizing office.',
        url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Civilian-Permanent-Change-of-Station-PCS-Forms/',
      },
    ],
  },
  {
    id: 'no-fee-passports-sofa',
    phase: 'Offer & orders',
    milestone: 'After your Final Job Offer (FJO)',
    window: 'As soon as authorized',
    title: 'Obtain No-Fee passports and SOFA stamps',
    detail: 'Confirm that you and each dependent have the required No-Fee passport and SOFA stamp. Keep tourist passports available for personal travel.',
    tag: 'Passports',
    forms: [
      {
        number: 'DD 1056',
        title: 'Authorization to Apply for a No-Fee Passport and/or Visa',
        note: 'Obtain through the DoD passport facility or authorized office.',
        url: 'https://www.esd.whs.mil/Directives/forms/dd1000_1499/DD1056/',
      },
      {
        number: 'DS-11',
        title: 'Application for a U.S. Passport',
        note: 'Used for first-time and other in-person applications.',
        url: 'https://travel.state.gov/en/passports/apply/unique-needs/special-issuance-passport.html',
      },
      {
        number: 'DS-82',
        title: 'Passport Renewal Application',
        note: 'Used when eligible to renew a special-issuance passport.',
        url: 'https://travel.state.gov/en/passports/apply/unique-needs/special-issuance-passport.html',
      },
    ],
  },
  {
    id: 'advance-of-pay',
    phase: 'Offer & orders',
    milestone: 'After your Final Job Offer (FJO)',
    window: 'Up to 3 weeks before PCS',
    title: 'Consider an advance of pay',
    detail: 'Ask your HR sponsor whether you are eligible and how to submit the request. Existing Federal employees may request it before PCS; new hires may request it after arrival.',
    tag: 'Finance',
  },
  {
    id: 'sponsor',
    phase: 'Pre-arrival',
    window: '60–30 days out',
    title: 'Connect with your relocation contact',
    detail: 'Share your arrival plan and ask about your first workday, local requirements, and temporary lodging.',
    tag: 'Contact',
  },
  {
    id: 'household-goods-plan',
    phase: 'Pre-arrival',
    window: 'After orders are issued',
    title: 'Plan household-goods and baggage shipments',
    detail: 'Confirm what your orders authorize, then coordinate household goods, unaccompanied baggage, storage, pickup dates, and destination contact details with your transportation office. Photograph high-value items and keep shipment inventories with your hand-carried records.',
    tag: 'Household goods',
    guideLabel: 'Open the household-goods guide',
    guideType: 'household-goods',
  },
  {
    id: 'pet-travel-plan',
    phase: 'Pre-arrival',
    window: 'Start 4–6 months out',
    title: 'Build your pet travel plan',
    detail: 'Confirm that your pet may enter Germany, verify the microchip-before-rabies sequence, reserve airline space, and check crate, route, lodging, and breed restrictions before buying nonrefundable travel.',
    tag: 'Pets',
    guideLabel: 'Open the pet guide',
    guideType: 'pets',
  },
  {
    id: 'pov-shipment',
    phase: 'Pre-arrival',
    window: 'As soon as your orders authorize it',
    title: 'Arrange shipment of your POV',
    detail: 'Confirm the POV entitlement written on your orders, contact your transportation office, and use PCSmyPOV to prepare documents and schedule the authorized Vehicle Processing Center. Your vehicle should be operational, thoroughly clean, free of personal items, and at or below one-quarter tank of fuel for turn-in.',
    tag: 'Vehicle',
    guideLabel: 'Open the vehicle guide',
  },
  {
    id: 'lodging',
    phase: 'Pre-arrival',
    window: '60–30 days out',
    title: 'Reserve temporary lodging',
    detail: 'Book early, confirm pet restrictions, and keep every lodging and meal receipt for TQSA.',
    tag: 'Housing',
  },
  {
    id: 'usareur-training',
    phase: 'Pre-arrival',
    window: 'Within 60 days of appointment',
    title: 'Complete USAREUR driver training',
    detail: 'Complete the course and exam on JKO no earlier than 60 days before your licensing appointment. Print several copies of both completion certificates.',
    tag: 'Driving',
  },
  {
    id: 'install-essential-apps',
    phase: 'Pre-arrival',
    window: 'Before departure',
    title: 'Install a few essential Germany apps',
    detail: 'Download German for offline use in Google Translate, plus DB Navigator for public transit and EasyPark for municipal parking.',
    tag: 'Daily life',
  },
  {
    id: 'plan-school-path',
    phase: 'Pre-arrival',
    window: 'Before choosing housing',
    title: 'Review school and childcare options',
    detail: 'Compare DoDEA zoning, private international schools, and local German schools. Your off-base address can determine the DoDEA school zone.',
    tag: 'Family',
  },
  {
    id: 'save-healthcare-options',
    phase: 'Pre-arrival',
    window: 'Before departure',
    title: 'Save local healthcare options',
    detail: 'Identify nearby English-speaking primary, emergency, specialty, therapy, and dental care. Save 112 as the German emergency number.',
    tag: 'Healthcare',
    guideLabel: 'Review healthcare in Germany',
    guideType: 'life',
  },
  {
    id: 'pet-health-certificate',
    phase: 'Pre-arrival',
    window: 'Inside the official travel window',
    title: 'Complete your pet’s EU health certificate',
    detail: 'Use the current USDA APHIS Germany instructions. Have an accredited veterinarian complete the correct certificate, obtain USDA endorsement when required, and hand-carry every original with the rabies and microchip records.',
    tag: 'Pets',
    guideLabel: 'Review the pet document sequence',
    guideType: 'pets',
  },
  {
    id: 'cac-deers',
    phase: 'Arrival',
    window: 'First 48 hours',
    title: 'Complete CAC and DEERS enrollment',
    detail: 'Make this an early priority for installation access, network access, and payroll processing. Dependents should also obtain ID cards and confirm authorized patronage.',
    critical: true,
    criticalNote: 'Your employing agency or component may determine which personnel and DEERS office should support you. Air Force civilians generally start with their servicing Civilian Personnel office and MPF; Army civilians should follow CPAC in-processing before visiting the ID Cards/DEERS office; DHA and LRMC civilians should use the onboarding instructions from their servicing HR or personnel office. Confirm your record is ready and which office will serve your affiliation before booking—the nearest RAPIDS site may not be your correct first stop.',
    criticalLinks: [
      { label: 'Find a RAPIDS site', url: 'https://idco.dmdc.osd.mil/idco/locator' },
      { label: 'Army ID Cards & DEERS guidance', url: 'https://home.army.mil/rheinland-pfalz/about/directorates-support-offices/directorate-human-resources-dhr/id-cards-deers-enrollment' },
      { label: 'Ramstein passports & ID cards', url: 'https://www.ramstein.af.mil/About/Fact-Sheets/Article/303618/passports-id-cards/' },
    ],
    tag: 'Identification',
    guideLabel: 'Review installation and visitor access',
    guideType: 'life',
  },
  {
    id: 'pet-arrival-registration',
    phase: 'Arrival',
    window: 'Within the first 2 weeks',
    title: 'Register and settle your pet',
    detail: 'Contact the Pulaski Veterinary Clinic promptly for installation registration, then ask your landlord and municipality about local dog registration, Hundesteuer, insurance, and leash requirements for your address.',
    tag: 'Pets',
    guideLabel: 'Open the pet arrival checklist',
    guideType: 'pets',
  },
  {
    id: 'local-phone',
    phase: 'Arrival',
    window: 'First 48 hours',
    title: 'Set up phone, cell, and internet service',
    detail: 'Strongly consider purchasing an eSIM before departure so you have service immediately. After choosing housing, check internet availability for the exact street address before signing a contract—not just the village or postal code. Some established neighborhoods may rely on slower DSL, while newer areas may offer fiber or cable. Compare the expected download and upload speed, installation lead time, equipment fees, and minimum contract term. Telekom, Vodafone, O2, and TKS are common local options.',
    tag: 'Communication',
  },
  {
    id: 'housing-inprocess',
    phase: 'Arrival',
    window: 'Within 48 hours',
    title: 'In-process with the KMC Housing Office',
    detail: 'Register at Bldg 1001, Vogelweh, and begin the off-base housing process. Eligible civilians may have up to 90 days of TQSA.',
    tag: 'Housing',
  },
  {
    id: 'finance-inprocess',
    phase: 'Arrival',
    window: 'Within 15 days',
    title: 'Complete finance and payroll in-processing',
    detail: 'Submit your initial travel voucher and begin any authorized advance-pay or temporary-quarters allowance actions through your servicing finance office.',
    tag: 'Finance',
    forms: [
      {
        number: 'DD 1351-2',
        title: 'Travel Voucher or Subvoucher',
        note: 'Primary form for a civilian PCS travel claim.',
        url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Civilian-Permanent-Change-of-Station-PCS-Forms/',
      },
      {
        number: 'DD 1351-2C',
        title: 'Travel Voucher Continuation Sheet',
        note: 'Use when the main voucher needs additional space.',
        url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Civilian-Permanent-Change-of-Station-PCS-Forms/',
      },
      {
        number: 'SF 1199A',
        title: 'Direct Deposit Sign-Up Form',
        note: 'DFAS requests this when banking information has changed.',
        url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Civilian-Permanent-Change-of-Station-PCS-Forms/',
      },
    ],
  },
  {
    id: 'usareur-license',
    phase: 'Arrival',
    window: 'First week',
    title: 'Obtain your USAREUR driver’s license',
    detail: 'Bring your JKO certificates, hard copies of orders, valid state license, and a non-cash payment method. Licensing is available at Ramstein Bldg 2106 or Kleber Bldg 3212.',
    tag: 'Driving',
  },
  {
    id: 'apo-box',
    phase: 'Arrival',
    window: 'First week',
    title: 'Establish an APO mailing address',
    detail: 'In-process at a post office to receive your box. Options include Landstuhl Bldg 3377, Kapaun Bldg 2767, and Ramstein Bldg 426.',
    tag: 'Mail',
  },
  {
    id: 'iban-account',
    phase: 'Arrival',
    window: 'First week',
    title: 'Open a Euro account with an IBAN',
    detail: 'An IBAN is commonly needed for rent, UTAP, utilities, and local contracts. On-base and online banking options are available.',
    tag: 'Banking',
  },
  {
    id: 'ration-card',
    phase: 'Arrival',
    window: 'First week',
    title: 'Obtain a rations card if needed',
    detail: 'Eligible civilians need a physical rations card for rationed tax-free purchases. Offices are located at Ramstein Bldg 2102 and Kleber Bldg 3245.',
    tag: 'Benefits',
  },
  {
    id: 'vat-program',
    phase: 'Arrival',
    window: 'First week',
    title: 'Register for the VAT program',
    detail: 'VAT forms can remove eligible German tax from off-base purchases. The Ramstein VAT Office is inside the Ramstein Enlisted Club, Bldg 2140 on Lawn Avenue—not at the BX. Eligible users can also download the Remonon micro-purchase app and obtain an Individual VAT Number from a VAT office.',
    tag: 'Benefits',
  },
  {
    id: 'tqsa',
    phase: 'Days 30 · 60 · 90',
    window: 'Every 30 days',
    title: 'Submit your temporary-lodging claim',
    detail: 'Keep every lodging, meal, and laundry receipt. Submit TQSA claims in strict 30-day increments; reimbursement percentages may decrease over time.',
    tag: 'Deadline',
    forms: [
      {
        number: 'SF 1190',
        title: 'Foreign Allowances Application, Grant and Report',
        note: 'Used to claim TQSA and other authorized foreign allowances.',
        url: 'https://www.gsa.gov/cdnstatic/SF1190-12.pdf',
      },
      {
        number: 'DSSR 120',
        title: 'TQSA Actual Expense Worksheet',
        note: 'Submit separate supporting calculations for each 30-day period.',
        url: 'https://allowances.state.gov/content/documents/1851_TQSA.pdf',
      },
    ],
  },
  {
    id: 'review-rental-details',
    phase: 'Days 30 · 60 · 90',
    window: 'Before signing a lease',
    title: 'Review the home beyond the rent',
    detail: 'Confirm your LQA cap, whether an Einbauküche (EBK) is included, the heating type, shutters or cooling options, and how annual Nebenkosten reconciliation works.',
    tag: 'Housing',
  },
  {
    id: 'utap',
    phase: 'Days 30 · 60 · 90',
    window: 'After lease approval',
    title: 'Set up UTAP for eligible utilities',
    detail: 'Bring the approved lease, IBAN details, and setup fee to Kleber Bldg 3245 or Ramstein Bldg 2118. Garbage, telephone, internet, and heating oil are not covered.',
    tag: 'Utilities',
  },
  {
    id: 'fmo',
    phase: 'Days 30 · 60 · 90',
    window: 'After signing a lease',
    title: 'Schedule FMO furnishings and appliances',
    detail: 'Visit FMO at Vogelweh Bldg 1001 for temporary loaner furniture and available tour-length appliances while you wait for household goods.',
    tag: 'Home',
  },
  {
    id: 'household-goods-delivery',
    phase: 'Days 30 · 60 · 90',
    window: 'When delivery can be scheduled',
    title: 'Receive and inspect your household goods',
    detail: 'Confirm the delivery address and access, keep your inventory ready, and inspect as items arrive. Record visible loss or damage before the crew leaves, photograph concerns, and follow the current transportation-office instructions for concealed damage and claims.',
    tag: 'Household goods',
    guideLabel: 'Review delivery day and claims',
    guideType: 'household-goods',
  },
  {
    id: 'vehicle-registration',
    phase: 'Days 30 · 60 · 90',
    window: 'When your vehicle arrives',
    title: 'Inspect and register your vehicle',
    detail: 'Enter the registration queue early. Obtain the registration or temporary plates required for release, collect the vehicle from the VPC, complete the safety inspection, then return for permanent registration. Carry a DIN 13164 first-aid kit, two masks, a warning triangle, and reflective vest.',
    tag: 'Vehicle',
    guideLabel: 'Open the vehicle guide',
  },
  {
    id: 'pov-pickup',
    phase: 'Days 30 · 60 · 90',
    window: 'When PCSmyPOV confirms arrival',
    title: 'Pick up and inspect your POV',
    detail: 'Complete the registration requirement before pickup, then bring your release documents to the Kaiserslautern VPC. Inspect the exterior, interior, mileage, tires, and accessories before signing. Record every issue on the Vehicle Inspection and Shipping Form and keep a copy.',
    tag: 'Vehicle',
    guideLabel: 'Open the vehicle guide',
  },
  {
    id: 'esso-card',
    phase: 'Days 30 · 60 · 90',
    window: 'After registration',
    title: 'Set up an ESSO fuel card',
    detail: 'Take your vehicle registration, orders, and CAC to an AAFES gas station to request the prepaid tax-free fuel card.',
    tag: 'Vehicle',
  },
  {
    id: 'school-registration',
    phase: 'Days 30 · 60 · 90',
    window: 'After choosing housing',
    title: 'Complete school registration',
    detail: 'Register through DoDEA, your selected private school, or the local Rathaus for German public school. Confirm your final school zone from your home address.',
    tag: 'Family',
  },
  {
    id: 'german-life-rules',
    phase: 'Days 30 · 60 · 90',
    window: 'As you settle in',
    title: 'Learn the everyday German rules',
    detail: 'Plan for Sunday closures and quiet hours, carry some Euros, use winter-rated tires in winter conditions, and remember Germany’s 0.05 BAC limit also applies to bicycles and e-scooters.',
    tag: 'Daily life',
  },
]

const journeyTaskOrder = [
  // Offer & orders: establish the offer, records, and coverage before acting on final orders.
  'temporary-offer',
  'start-document-folder',
  'audit-health-insurance',
  'final-offer',
  'no-fee-passports-sofa',
  'advance-of-pay',
  // Pre-arrival: start long-lead work first, then orders-dependent logistics and departure prep.
  'pet-travel-plan',
  'household-goods-plan',
  'pov-shipment',
  'sponsor',
  'plan-school-path',
  'lodging',
  'usareur-training',
  'save-healthcare-options',
  'install-essential-apps',
  'pet-health-certificate',
  // Arrival: complete 48-hour essentials before first-week and two-week actions.
  'cac-deers',
  'housing-inprocess',
  'local-phone',
  'finance-inprocess',
  'usareur-license',
  'apo-box',
  'iban-account',
  'ration-card',
  'vat-program',
  'pet-arrival-registration',
  // Days 30/60/90: protect deadlines, then follow lease, household, school, and vehicle dependencies.
  'tqsa',
  'review-rental-details',
  'utap',
  'fmo',
  'household-goods-delivery',
  'school-registration',
  'vehicle-registration',
  'pov-pickup',
  'esso-card',
  'german-life-rules',
]

const journeyTaskRank = new Map(journeyTaskOrder.map((id, index) => [id, index]))
const orderedPhaseTasks = [...phaseTasks].sort(
  (first, second) => (journeyTaskRank.get(first.id) ?? Number.MAX_SAFE_INTEGER) - (journeyTaskRank.get(second.id) ?? Number.MAX_SAFE_INTEGER),
)

const directoryEntries = [
  {
    id: 'ramstein-id-cards',
    name: 'Ramstein ID Cards & DEERS',
    category: 'Identification',
    location: 'Ramstein Passenger Terminal, Bldg 2102',
    area: 'Ramstein Air Base',
    phone: '06371-47-2273',
    services: 'CAC issuance, SOFA stamps, and DEERS support.',
    steps: ['Complete CAC and DEERS enrollment', 'Obtain No-Fee passports and SOFA stamps'],
  },
  {
    id: 'kleber-id-cards',
    name: 'Kleber DEERS Office',
    category: 'Identification',
    location: 'Kleber Kaserne, Bldg 3245',
    area: 'Kaiserslautern',
    phone: '0631-411-7662',
    alternatePhone: '0631-411-7072',
    dsn: '483-7072',
    hours: 'Mon–Thu 0800–1530; Fri 0800–1200',
    services: 'DEERS enrollment, CAC issuance, SOFA stamps, and ID cards.',
    steps: ['Complete CAC and DEERS enrollment'],
  },
  {
    id: 'lrmc-deers',
    name: 'LRMC DEERS Office',
    category: 'Identification',
    location: 'Bldg 3766, Room 15B 120',
    area: 'Landstuhl',
    phone: '06371-9464-5917',
    dsn: '590-5917',
    services: 'Local DEERS enrollment and identification support.',
    steps: ['Complete CAC and DEERS enrollment'],
  },
  {
    id: 'ramstein-vcc',
    name: 'Ramstein Visitor Control Center',
    category: 'Installation Access',
    location: 'Verify the current VCC location and operating status before traveling',
    area: 'Ramstein Air Base',
    phone: '+49 6371-47-5775',
    phoneHref: '+496371475775',
    dsn: '480-5775',
    services: 'Visitor passes, guest access questions, event access requests, and current Ramstein Air Base sponsorship requirements. A visitor pass does not itself grant shopping or service privileges.',
    steps: ['Complete CAC and DEERS enrollment'],
    website: 'https://www.ramstein.af.mil/About/Fact-Sheets/Article/726166/ramstein-visitor-control-center/',
    websiteLabel: 'Current VCC guidance',
    hideMap: true,
  },
  {
    id: 'pulaski-iacs',
    name: 'Pulaski Barracks IACS',
    category: 'Installation Access',
    location: 'Pulaski Barracks, Bldg 2974, Pariser Straße',
    area: 'Kaiserslautern',
    phone: '+49 611-143-541-7153',
    phoneHref: '+496111435417153',
    alternatePhone: '+49 611-143-541-7152',
    dsn: '541-7153 / 541-7152',
    hours: 'Mon–Fri 0830–1145 and 1300–1545; closed weekends and federal holidays. Verify before visiting.',
    services: 'IACS registration for eligible DoD ID cardholders plus Army installation passes, visitor access, vendors, and access rosters.',
    steps: ['Complete CAC and DEERS enrollment'],
    website: 'https://home.army.mil/rheinland-pfalz/index.php/about/directorates-support-offices/directorate-emergency-services-des/installation-access-control',
    websiteLabel: 'Army access guidance',
  },
  {
    id: 'kleber-utap',
    name: 'Kleber UTAP Office',
    category: 'Housing',
    location: 'Kleber Kaserne, Bldg 3245',
    area: 'Kaiserslautern',
    services: 'Utility Tax Avoidance Program support for eligible electricity, gas, and water accounts.',
    steps: ['Set up UTAP for eligible utilities'],
  },
  {
    id: 'kleber-passports',
    name: 'Kleber Passport Office',
    category: 'Passports',
    location: '90th Personnel Service Battalion, Bldg 3245, Room 117',
    area: 'Kleber Kaserne',
    phone: '0631-411-8892',
    alternatePhone: '0631-411-7659',
    dsn: '483-8892 / 483-7659',
    hours: 'Birth registration by appointment only, Mon–Thu 0800–1100',
    website: 'http://www.rp.army.mil/Directorates/DHR/passports.html',
    services: 'U.S. Army passport services and appointment-only birth registration.',
    steps: ['Obtain No-Fee passports and SOFA stamps'],
  },
  {
    id: 'baumholder-passports',
    name: 'Baumholder Passport Office',
    category: 'Passports',
    location: 'Bldg 8660',
    area: 'Baumholder',
    phone: '06783-6-7215',
    dsn: '485-7215',
    services: 'U.S. Army passport services.',
    steps: ['Obtain No-Fee passports and SOFA stamps'],
  },
  {
    id: 'ramstein-passports',
    name: 'Ramstein Passport Office',
    category: 'Passports',
    location: 'Bldg 2106, Room 110',
    area: 'Ramstein Air Base',
    hours: 'Mon–Fri 0900–1500; birth registration by appointment only',
    services: 'Passport services and appointment-only birth registration.',
    steps: ['Obtain No-Fee passports and SOFA stamps'],
  },
  {
    id: 'landstuhl-outprocessing',
    name: 'LRMC In/Out-Processing',
    category: 'Finance',
    location: 'Bldg 3700',
    area: 'Landstuhl',
    services: 'First stop for hospital n-processing, travel vouchers, and TQSA forms.',
    steps: ['Complete finance and payroll in-processing', 'Submit your temporary-lodging claim'],
  },
  {
    id: 'rob-vat-office',
    name: 'Rhine Ordnance Barracks (ROB) VAT Office',
    category: 'Finance',
    location: 'Java Café, Bldg 273, 67661 Kaiserslautern',
    area: 'Rhine Ordnance Barracks',
    phone: '+49 (0)611-143-541-9089',
    phoneHref: '+496111435419089',
    dsn: '(314) 541-9089',
    website: 'https://www.armymwr.com/location-contact?location_form_location=66955',
    websiteLabel: 'Email office',
    mapsUrl: 'https://www.google.com/maps/search/Rhine+Ordnance+Barracks+(ROB)+Java+Caf%C3%A9,+Kaiserslautern,+Rhineland-Palatinate,+67661,+Germany',
    services: 'VAT form sales and support for eligible tax-free purchases. Now open during lunch.',
    steps: ['Register for the VAT program'],
  },
  {
    id: 'kleber-vat-office',
    name: 'Kleber VAT Office',
    category: 'Finance',
    location: 'Kleber Kaserne, Bldg 3245, Room 116, 67657 Kaiserslautern',
    area: 'Kleber Kaserne',
    phone: '+49 (0)611-143-541-9120',
    phoneHref: '+496111435419120',
    dsn: '(314) 541-9120',
    website: 'https://www.armymwr.com/location-contact?location_form_location=66956',
    websiteLabel: 'Email office',
    mapsUrl: 'https://www.google.com/maps/search/Kleber+Kaserne,+Room+116,+Kaiserslautern,+Rhineland-Palatinate,+67657,+Germany',
    services: 'VAT form sales and support for eligible tax-free purchases.',
    steps: ['Register for the VAT program'],
  },
  {
    id: 'landstuhl-vat-office',
    name: 'Landstuhl VAT Office',
    category: 'Finance',
    location: 'Landstuhl Post (Wilson Barracks), inside the Library, Bldg 3810, 66849 Landstuhl',
    area: 'Landstuhl',
    phone: '+49 (0)611-143-541-9126',
    phoneHref: '+496111435419126',
    dsn: '(314) 541-9126',
    website: 'https://www.armymwr.com/location-contact?location_form_location=66957',
    websiteLabel: 'Email office',
    mapsUrl: 'https://www.google.com/maps/search/Landstuhl+Post+(Wilson+Barracks),+(Located+inside+Library),+Landstuhl,+Rhineland-Palatinate,+66849,+Germany',
    services: 'VAT form sales and support for eligible tax-free purchases.',
    steps: ['Register for the VAT program'],
  },
  {
    id: 'kmc-housing',
    name: 'KMC Housing Office',
    category: 'Housing',
    location: 'Vogelweh, Bldg 1001',
    area: 'Kaiserslautern',
    services: 'Housing registration and lease review. Register within 48 hours and obtain approval before signing a German lease.',
    steps: ['In-process with the KMC Housing Office', 'Review the home beyond the rent'],
  },
  {
    id: 'fmo',
    name: 'Furnishings Management Office',
    category: 'Housing',
    location: 'Vogelweh, Bldg 1001',
    area: 'Kaiserslautern',
    services: 'Schedules temporary furniture and major appliance delivery, including washers, dryers, and transformers.',
    steps: ['Schedule FMO furnishings and appliances'],
  },
  {
    id: 'ramstein-licensing',
    name: 'Ramstein USAREUR Licensing',
    category: 'Driving',
    location: 'Bldg 2106',
    area: 'Ramstein Air Base',
    services: 'USAREUR driver’s license processing. Bring JKO certificates, hard-copy orders, and the required non-cash fee.',
    steps: ['Complete USAREUR driver training', 'Obtain your USAREUR driver’s license'],
  },
  {
    id: 'kleber-licensing',
    name: 'Kleber USAREUR Licensing',
    category: 'Driving',
    location: 'Bldg 3212',
    area: 'Kleber Kaserne',
    services: 'USAREUR driver’s license processing. Bring JKO certificates, hard-copy orders, and the required non-cash fee.',
    steps: ['Complete USAREUR driver training', 'Obtain your USAREUR driver’s license'],
  },
  {
    id: 'rmv-online-renewal',
    name: 'USAREUR-AF RMV Online Renewal',
    category: 'Vehicle',
    location: 'Online renewal with certified delivery to your APO address',
    area: 'Germany',
    services: 'For same-community renewals, scan the QR code on your mailed renewal notice and upload the notice, AE Form 190-1O, and qualifying inspection documentation at least 30 days before expiration. After verification, use the payment link and code, then sign for the updated registration and decal at APO pickup. Renewals within 30 days of expiration must be completed at a local Field Registration Station.',
    steps: ['Inspect and register your vehicle'],
    website: 'https://www.europeafrica.army.mil/RMV/',
    websiteLabel: 'RMV online guidance',
    hideMap: true,
  },
  {
    id: 'kapaun-vehicle-registration-main',
    name: 'Kapaun Vehicle Registration — Main Station',
    category: 'Vehicle',
    location: 'Kapaun Air Station, Bldg 2806',
    area: 'Kaiserslautern',
    hours: 'Mon–Fri 0700–1500; last customer 1430. De-registration walk-ins 0700–1500.',
    email: '569USFPS.S5BV.VehicleRegistration@us.af.mil',
    services: 'Appointments or the 2-Meters queue are used for initial registrations after purchasing or shipping a vehicle, temporary plates, transfers between DoD ID cardholders, and vehicles driven to the KMC from another country. Closed federal holidays, USAFE and 86 AW down days, and the last duty day of each month.',
    steps: ['Inspect and register your vehicle'],
    website: 'https://www.europeafrica.army.mil/RMV/',
    websiteLabel: 'Official RMV site',
  },
  {
    id: 'kapaun-vehicle-registration-substation',
    name: 'Kapaun Vehicle Registration — Substation',
    category: 'Vehicle',
    location: 'Kapaun Air Station, Bldg 2807',
    area: 'Kaiserslautern',
    hours: 'Mon–Fri 0700–1130 and 1230–1500; last customer 1430. Walk-in sign-in sheet.',
    email: '569USFPS.S5BV.VehicleRegistration@us.af.mil',
    services: 'Handles renewals, registration updates, temporary-to-permanent plates, replacements, emissions or inspection decals, and in-Germany PCS transfers. Renewals require a new vehicle safety inspection completed within the previous 75 days. Closed federal holidays, USAFE and 86 AW down days, and the last duty day of each month.',
    steps: ['Inspect and register your vehicle'],
    website: 'https://www.europeafrica.army.mil/RMV/',
    websiteLabel: 'Official RMV site',
  },
  {
    id: 'ramstein-vehicle-registration-substation',
    name: 'Ramstein Vehicle Registration — Substation',
    category: 'Vehicle',
    location: 'KMCC, 2nd floor near the theater',
    area: 'Ramstein Air Base',
    hours: 'Mon–Thu 0700–1500; Fri 0700–1330. Last customer 1430 on full days; closes 1330 before down days or holidays.',
    email: '569USFPS.S5BV.VehicleRegistration@us.af.mil',
    services: 'Use an appointment or the 2-Meters queue for renewals, DoD ID-cardholder transfers, qualifying initial registrations, information changes, in-Germany PCS transfers, lost or stolen plates, replacements, and emissions or inspection decals. Closed federal holidays, USAFE and 86 AW down days, and the last duty day of each month.',
    steps: ['Inspect and register your vehicle'],
    website: 'https://www.europeafrica.army.mil/RMV/',
    websiteLabel: 'Official RMV site',
  },
  {
    id: 'aafes-esso',
    name: 'AAFES ESSO Card Service',
    category: 'Vehicle',
    location: 'Any local on-base AAFES gas station',
    area: 'KMC',
    services: 'Issues prepaid ESSO fuel cards. Bring vehicle registration, orders, and CAC.',
    steps: ['Set up an ESSO fuel card'],
  },
  {
    id: 'school-liaison',
    name: 'School Liaison Officer',
    category: 'Schools',
    location: 'Rhine Ordnance Barracks, Bldg 162',
    area: 'Kaiserslautern',
    phone: '0631-143-541-9061',
    services: 'Assists families with DoDEA registration and school-transition questions.',
    steps: ['Review school and childcare options', 'Complete school registration'],
  },
  {
    id: 'landstuhl-elementary',
    name: 'Landstuhl Elementary School',
    category: 'Schools',
    location: 'Landstuhl Post, Bldg 3720',
    area: 'Landstuhl',
    services: 'DoDEA school serving grades PK–5.',
    steps: ['Review school and childcare options', 'Complete school registration'],
  },
  {
    id: 'kaiserslautern-schools',
    name: 'Kaiserslautern DoDEA Schools',
    category: 'Schools',
    location: 'Vogelweh & Kleber area',
    area: 'Kaiserslautern',
    services: 'DoDEA elementary, middle, and high school options.',
    steps: ['Review school and childcare options', 'Complete school registration'],
  },
  {
    id: 'ramstein-schools',
    name: 'Ramstein DoDEA Schools',
    category: 'Schools',
    location: 'Ramstein Air Base',
    area: 'Ramstein',
    services: 'DoDEA elementary, intermediate, middle, and high school options.',
    steps: ['Review school and childcare options', 'Complete school registration'],
  },
  {
    id: 'sbw-westpfalz',
    name: 'SBW International School Westpfalz',
    category: 'Schools',
    location: 'Landstuhl area',
    area: 'Landstuhl',
    services: 'Private English-language curriculum and an alternative to DoDEA or local German schools.',
    steps: ['Review school and childcare options', 'Complete school registration'],
  },
  {
    id: 'flynn-family-medicine',
    name: 'Flynn Family Medicine',
    category: 'Healthcare',
    location: 'Schulstraße 2, 66877 Ramstein-Miesenbach',
    area: 'Ramstein-Miesenbach',
    phone: '06371-952-7070',
    services: 'English-speaking general practice and family care on the German economy.',
    steps: ['Audit your overseas health coverage', 'Save local healthcare options'],
  },
  {
    id: 'medical-on-call-116117',
    name: 'German Medical On-Call Service',
    category: 'Healthcare',
    location: 'Germany-wide telephone service',
    area: 'Germany',
    phone: '116117',
    phoneHref: '116117',
    hours: 'Available 24/7. Call 112 instead for potentially life-threatening emergencies.',
    services: 'Routes urgent, non-life-threatening medical needs to an appropriate open practice, on-call clinic, hospital service, or telephone consultation, particularly when regular practices are closed.',
    steps: ['Save local healthcare options'],
    website: 'https://gesund.bund.de/en',
    websiteLabel: 'Federal health portal',
    hideMap: true,
  },
  {
    id: 'kleber-tricare',
    name: 'Kleber TRICARE Service Center',
    category: 'Healthcare',
    location: 'Kleber Kaserne',
    area: 'Kaiserslautern',
    phone: '0631-411-6358',
    dsn: '483-6358',
    services: 'TRICARE enrollment and beneficiary support.',
    steps: ['Audit your overseas health coverage', 'Save local healthcare options'],
  },
  {
    id: 'baumholder-tricare',
    name: 'Baumholder TRICARE Service Center',
    category: 'Healthcare',
    location: 'Baumholder',
    area: 'Baumholder',
    phone: '06783-6-8089',
    dsn: '485-8089',
    services: 'TRICARE enrollment and beneficiary support.',
    steps: ['Audit your overseas health coverage', 'Save local healthcare options'],
  },
  {
    id: 'ramstein-tricare',
    name: 'Ramstein TRICARE Service Center',
    category: 'Healthcare',
    location: 'Ramstein Air Base',
    area: 'Ramstein',
    phone: '06371-46-2616',
    dsn: '479-2616',
    services: 'TRICARE enrollment and beneficiary support.',
    steps: ['Audit your overseas health coverage', 'Save local healthcare options'],
  },
  {
    id: 'lrmc-tricare',
    name: 'LRMC TRICARE Service Center',
    category: 'Healthcare',
    location: 'Bldg 3744',
    area: 'Landstuhl',
    phone: '06371-9464-4830',
    dsn: '590-4830',
    services: 'TRICARE enrollment and beneficiary support.',
    steps: ['Audit your overseas health coverage', 'Save local healthcare options'],
  },
  {
    id: 'dentistry-4-kidz',
    name: 'Dentistry 4 Kidz',
    category: 'Healthcare',
    location: 'Kaiserstraße 171, 66849 Landstuhl',
    area: 'Landstuhl',
    phone: '06371-130-0921',
    services: 'English-speaking pediatric dental care.',
    steps: ['Save local healthcare options'],
  },
  {
    id: 'nardini-klinikum',
    name: 'Nardini Klinikum',
    category: 'Healthcare',
    location: 'Nardinistraße 30, 66849 Landstuhl',
    area: 'Landstuhl',
    phone: '06371-840',
    services: 'General emergency hospital and maternity care with on-call patient liaisons.',
    steps: ['Save local healthcare options'],
  },
  {
    id: 'westpfalz-klinikum',
    name: 'Westpfalz-Klinikum',
    category: 'Healthcare',
    location: 'Hellmut-Hartert-Straße 1, Kaiserslautern',
    area: 'Kaiserslautern',
    phone: '0631-2030',
    services: 'Regional hospital and major trauma center.',
    steps: ['Save local healthcare options'],
  },
  {
    id: 'pulaski-vet',
    name: 'Pulaski Veterinary Clinic',
    category: 'Pets',
    location: 'Pulaski Barracks, Bldg 2928',
    area: 'Kaiserslautern',
    phone: '06371-9464-1900',
    dsn: '590-1900',
    hours: 'Mon–Fri 0700–1600; closed federal holidays. Verify before visiting.',
    services: 'Installation pet registration and space-available routine veterinary care for eligible DoD beneficiaries. The current Army civilian sponsorship checklist directs employees to register pets within two weeks of arrival. This is not an emergency clinic.',
    steps: ['Build your pet travel plan', 'Register and settle your pet'],
    website: 'https://home.army.mil/rheinland-pfalz/usag-rheinland-pfalz/all-services/public-health-command-europe-veterinary-services',
    websiteLabel: 'Veterinary services',
  },
]

const directoryCategories = ['All', ...new Set(directoryEntries.map((entry) => entry.category))]

const officialLinks = [
  {
    title: 'Preparing for a Civilian PCS',
    agency: 'Defense Finance and Accounting Service',
    category: 'PCS & finance',
    description: 'Official starting point for understanding civilian PCS orders, travel types, allowances, and required documentation.',
    url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Preparing-Civilian-PCS/',
  },
  {
    title: 'Civilian PCS forms',
    agency: 'Defense Finance and Accounting Service',
    category: 'PCS & finance',
    description: 'Current travel-voucher, continuation-sheet, direct-deposit, travel-order, advance, and supporting PCS forms.',
    url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Civilian-Permanent-Change-of-Station-PCS-Forms/',
  },
  {
    title: 'Civilian PCS tax information',
    agency: 'Defense Finance and Accounting Service',
    category: 'PCS & finance',
    description: 'Guidance on taxable PCS entitlements, withholding, and Relocation Income Tax Allowance claims.',
    url: 'https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Tax-Information/nbsp/',
  },
  {
    title: 'OF 306 — Declaration for Federal Employment',
    agency: 'U.S. Office of Personnel Management',
    category: 'Employment forms',
    description: 'Official fillable form used during federal hiring and suitability processing.',
    url: 'https://www.opm.gov/forms/pdf_fill/of0306.pdf',
  },
  {
    title: 'SF 2809 — Health Benefits Election Form',
    agency: 'U.S. Office of Personnel Management',
    category: 'Employment forms',
    description: 'Official Federal Employees Health Benefits enrollment and change form.',
    url: 'https://www.opm.gov/forms/pdf_fill/sf2809.pdf',
  },
  {
    title: 'Important facts about FEHB overseas coverage',
    agency: 'U.S. Office of Personnel Management',
    category: 'Healthcare',
    description: 'Official overview of overseas claims, upfront payment, translations, currency information, prescriptions, provider assistance, and plan-specific coverage.',
    url: 'https://www.opm.gov/healthcare-insurance/healthcare/plan-information/important-facts-about-overseas-coverage/',
  },
  {
    title: 'Ramstein Visitor Control Center',
    agency: '86th Airlift Wing, Ramstein Air Base',
    category: 'Installation access',
    description: 'Current Air Force installation visitor-pass, sponsorship, identification, event-access, screening, and contact guidance.',
    url: 'https://www.ramstein.af.mil/About/Fact-Sheets/Article/726166/ramstein-visitor-control-center/',
  },
  {
    title: 'Army installation access control',
    agency: 'U.S. Army Garrison Rheinland-Pfalz',
    category: 'Installation access',
    description: 'Official IACS registration, visitor escort, family-visitor pass, access-roster, and installation-pass requirements for local Army installations.',
    url: 'https://home.army.mil/rheinland-pfalz/index.php/about/directorates-support-offices/directorate-emergency-services-des/installation-access-control',
  },
  {
    title: 'Germany’s federal health portal',
    agency: 'German Federal Ministry of Health',
    category: 'Healthcare',
    description: 'Official doctor and hospital search plus guidance for 112 emergencies and the 116117 non-emergency medical on-call service.',
    url: 'https://gesund.bund.de/en',
  },
  {
    title: 'DD 1056 — No-Fee Passport Authorization',
    agency: 'U.S. Department of Defense',
    category: 'Passports & travel',
    description: 'Official form page for authorization to apply for a no-fee passport and/or visa.',
    url: 'https://www.esd.whs.mil/Directives/forms/dd1000_1499/DD1056/',
  },
  {
    title: 'Special-issuance passports',
    agency: 'U.S. Department of State',
    category: 'Passports & travel',
    description: 'Eligibility and application guidance for official, service, diplomatic, and no-fee passports.',
    url: 'https://travel.state.gov/en/passports/apply/unique-needs/special-issuance-passport.html',
  },
  {
    title: 'SF 1190 — Foreign Allowances',
    agency: 'U.S. General Services Administration',
    category: 'Allowances & housing',
    description: 'Official Foreign Allowances Application, Grant and Report form used for authorized overseas allowances.',
    url: 'https://www.gsa.gov/cdnstatic/SF1190-12.pdf',
  },
  {
    title: 'TQSA actual-expense worksheet',
    agency: 'U.S. Department of State, Office of Allowances',
    category: 'Allowances & housing',
    description: 'Official worksheet supporting Temporary Quarters Subsistence Allowance expense calculations.',
    url: 'https://allowances.state.gov/content/documents/1851_TQSA.pdf',
  },
  {
    title: 'Department of State Standardized Regulations',
    agency: 'U.S. Department of State, Office of Allowances',
    category: 'Allowances & housing',
    description: 'Current controlling framework for TQSA, LQA, Post Allowance, and other authorized foreign-area allowances.',
    url: 'https://allowances.state.gov/content.asp?content_id=282&menu_id=101',
  },
  {
    title: 'Home leave rules and agency discretion',
    agency: 'U.S. Office of Personnel Management',
    category: 'Allowances & housing',
    description: 'Official explanation of qualifying overseas service, permissible use, and the agency’s authority to grant home leave.',
    url: 'https://www.opm.gov/policy-data-oversight/pay-leave/claim-decisions/compensation-leave/claims/2020/20-0003/',
  },
  {
    title: 'Household-goods claims fact sheet',
    agency: 'Defense Personal Property Management Office',
    category: 'PCS & finance',
    description: 'Official loss-and-damage notice, documentation, and claim-filing overview. Confirm the current process for your shipment with the transportation office.',
    url: 'https://www.navsup.navy.mil/Portals/65/HHG/Documents/ClaimsFactSheet-PersonalPropertyClaims-2023.pdf',
  },
  {
    title: 'Welcome to Rheinland-Pfalz',
    agency: 'State of Rheinland-Pfalz',
    category: 'Living in Germany',
    description: 'English-language guide to settling in, public services, work, education, transportation, and daily life in the state.',
    url: 'https://www.welcome-to-rlp.org/guide/overview',
  },
  {
    title: 'Kaiserslautern County waste services',
    agency: 'Landkreis Kaiserslautern',
    category: 'Living in Germany',
    description: 'County recycling rules, waste categories, forms, collection information, and service contacts.',
    url: 'https://www.kaiserslautern-kreis.de/verwaltung/abfallwirtschaft/',
  },
  {
    title: 'Kaiserslautern County collection calendars',
    agency: 'Landkreis Kaiserslautern',
    category: 'Living in Germany',
    description: 'Address-specific collection schedules for Landstuhl, Ramstein-Miesenbach, Weilerbach, and neighboring communities.',
    url: 'https://www.kaiserslautern-kreis.de/verwaltung/abfallwirtschaft/abfuhrplaene/',
  },
  {
    title: 'City of Kaiserslautern waste services',
    agency: 'Stadtbildpflege Kaiserslautern',
    category: 'Living in Germany',
    description: 'Municipal waste, recycling, street-cleaning, and collection information for addresses inside Kaiserslautern city.',
    url: 'https://stadtbildpflege-kaiserslautern.de/',
  },
  {
    title: 'German-American Community Office',
    agency: 'City of Kaiserslautern',
    category: 'Community support',
    description: 'Bilingual support for newcomers, German administrative questions, community referrals, and local integration.',
    url: 'https://gaco.kaiserslautern.de/',
  },
  {
    title: 'Pet travel from the United States to Germany',
    agency: 'USDA Animal and Plant Health Inspection Service',
    category: 'Pets & travel',
    description: 'Current Germany-specific microchip, rabies, health-certificate, endorsement, and travel-timing requirements by pet type.',
    url: 'https://www.aphis.usda.gov/pet-travel/us-to-another-country-export/pet-travel-us-germany',
  },
  {
    title: 'EU rules for travelling with pets',
    agency: 'European Union',
    category: 'Pets & travel',
    description: 'Entry rules for dogs, cats, and ferrets, including identification, rabies vaccination, certificates, owner travel, and points of entry.',
    url: 'https://europa.eu/youreurope/citizens/travel/carry/pets-and-other-animals/index_en.htm',
  },
  {
    title: 'Dangerous-dog import restrictions',
    agency: 'German Customs',
    category: 'Pets & travel',
    description: 'German federal restrictions and exceptions for certain dog breeds and their crosses. Check this before booking travel.',
    url: 'https://www.zoll.de/DE/Privatpersonen/Reisen/Rueckkehr-aus-einem-Nicht-EU-Staat/Einschraenkungen/Gefaehrliche-Hunde/gefaehrliche_hunde.html',
  },
]

const officialLinkCategories = ['All', ...new Set(officialLinks.map((link) => link.category))]

const localLifePreviews = [
  {
    eyebrow: 'Know your surroundings',
    title: 'Meet your local area',
    copy: 'Get oriented to Ramstein, Kaiserslautern, Landstuhl, and the villages that connect everyday life across the region.',
    link: 'Explore the region',
    className: 'path-card--sky',
  },
  {
    eyebrow: 'Learn the local rhythm',
    title: 'Make daily life easier',
    copy: 'Understand recycling, shopping hours, transportation, village routines, and the practical systems you will use each week.',
    link: 'See everyday essentials',
    className: 'path-card--sand',
  },
  {
    eyebrow: 'Connect with confidence',
    title: 'Read the culture',
    copy: 'Learn the small courtesies, quiet-hour expectations, useful phrases, and neighborhood habits that help a new place feel like home.',
    link: 'Explore culture & etiquette',
    className: 'path-card--sage',
  },
]

const localAreas = [
  {
    name: 'Landstuhl',
    label: 'Mission home',
    copy: 'LRMC anchors this part of the region. The town adds everyday services, rail connections and wooded surroundings close to the medical center.',
  },
  {
    name: 'Ramstein & Ramstein-Miesenbach',
    label: 'Connected hub',
    copy: 'A practical center for base-adjacent errands, family routines, local shops, restaurants, and regional rail access.',
  },
  {
    name: 'Kaiserslautern',
    label: 'Regional center',
    copy: 'The region’s urban center: a walkable pedestrian district, main rail connections, restaurants, services, and a weekly market rhythm.',
  },
  {
    name: 'The surrounding villages',
    label: 'Village rhythm',
    copy: 'Places such as Kindsbach, Mackenbach, Weilerbach, Bann, Queidersbach, and Bruchmühlbach-Miesau each have their own services, events, and waste calendar.',
  },
]

const lifeTopics = [
  {
    category: 'Culture',
    title: 'Small courtesies go a long way',
    summary: 'German interactions can feel more formal at first, but the pattern is easy to learn.',
    tips: [
      'Say “Guten Morgen,” “Guten Tag,” or a simple “Hallo” when entering a small shop or meeting a neighbor.',
      'Use “Sie” until invited to use “du,” especially with officials, landlords, and older adults.',
      'Be on time for appointments and tell someone early if you will be delayed.',
      'A direct answer is usually meant to be clear, not unfriendly.',
    ],
  },
  {
    category: 'Culture',
    title: 'Know the neighborhood rhythm',
    summary: 'Shared buildings and villages place a high value on consideration and predictable routines.',
    tips: [
      'Follow the quiet hours written in your lease or local rules; Sundays and public holidays are generally treated as rest days.',
      'Ask before hosting a loud gathering and introduce yourself to immediate neighbors.',
      'Local clubs—Vereine—are one of the easiest ways to meet people beyond work.',
      'Keep sidewalks, shared stairwells, parking areas, and assigned bins tidy.',
    ],
  },
  {
    category: 'Recycling',
    title: 'Learn the household bins first',
    summary: 'Waste rules differ between the City and County of Kaiserslautern, so your address determines the exact system and pickup calendar.',
    tips: [
      'Yellow bag or yellow bin: empty sales packaging made of plastic, metal, or mixed materials—not every plastic household item.',
      'Paper bin: clean paper and cardboard; flatten boxes and keep food-soiled paper out.',
      'Bio bin: food and garden waste accepted by your municipality.',
      'Residual bin: non-recyclable household waste that does not belong in another stream.',
    ],
  },
  {
    category: 'Recycling',
    title: 'Handle glass, deposits, and special waste separately',
    summary: 'A few common items never belong in the regular household recycling bins.',
    tips: [
      'Sort non-deposit glass at public containers by clear, green, and brown glass; follow posted drop-off hours.',
      'Return bottles and cans marked “Pfand” to a supermarket deposit machine and use the receipt at checkout.',
      'Use the local recycling center or scheduled collection for electronics, chemicals, and bulky waste.',
      'Check the waste guide for your municipality before setting anything beside the bins.',
    ],
  },
  {
    category: 'Shopping',
    title: 'Plan around Sundays and holidays',
    summary: 'Most regular shops and supermarkets close on Sundays and public holidays, with limited exceptions and occasional designated shopping Sundays.',
    tips: [
      'Finish the main grocery run by Saturday and check holiday closures before a long weekend.',
      'Bakeries, fuel stations, restaurants, and a few travel-location shops may have limited Sunday hours.',
      'Kaiserslautern announces occasional “verkaufsoffene Sonntage” when participating stores open for a Sunday afternoon.',
      'Hours can change by location—check the specific shop before traveling.',
    ],
  },
  {
    category: 'Shopping',
    title: 'Expect a different checkout routine',
    summary: 'German supermarkets move quickly and assume shoppers will bring or purchase what they need to carry groceries home.',
    tips: [
      'Bring reusable bags and pack your own groceries after they are scanned.',
      'Keep a €1 or €2 coin—or a reusable token—for many shopping carts.',
      'Cards are widely accepted, but keeping some euros helps at markets, bakeries, and smaller businesses.',
      'Use weekly markets and bakeries to learn local seasonal foods and everyday phrases.',
    ],
  },
  {
    category: 'Getting around',
    title: 'Build a local transportation toolkit',
    summary: 'The area is car-oriented in places, but regional trains and buses can cover many routine trips.',
    tips: [
      'Save your nearest station and bus stop, not just the nearest city.',
      'Use DB Navigator for rail planning and check the regional operator for local bus changes.',
      'Look for parking signs, time limits, and the blue parking-disc symbol before walking away from the car.',
      'Expect narrow village streets and leave driveways, sidewalks, and emergency access clear.',
    ],
  },
  {
    category: 'Installations',
    title: 'Separate installation access from patronage',
    summary: 'Getting through a gate and being eligible to use a service are two different questions—and Air Force and Army visitor processes are not interchangeable.',
    tips: [
      'Make sure newly issued CAC and dependent ID cards are registered in the access system required by the installation you use.',
      'Guests without an authorized DoD credential may need an escort, approved roster, or visitor pass. Check the responsible Air Force VCC or Army IACS office before the visit.',
      'Visitors should carry the identification specified by the current access office; nationality, purpose, length of visit, and requested level of access can change the process and lead time.',
      'A gate pass does not create Exchange, commissary, MWR, gym, fuel, ration, or other patronage privileges. Eligibility follows the sponsor or visitor’s authorized status, ID, orders, and applicable overseas rules.',
      'Do not promise access for an event or visiting family until the responsible office confirms the current sponsorship and screening requirements.',
    ],
  },
  {
    category: 'Healthcare',
    title: 'Build a civilian healthcare routine before you need it',
    summary: 'Most civilian employees rely on their FEHB plan and German-economy providers for routine primary care, so the practical work is understanding the plan and preserving claim documentation.',
    tips: [
      'Read the overseas-care and claims section of your current FEHB brochure; plan rules, assistance networks, precertification, prescriptions, dental benefits, and reimbursement procedures differ.',
      'Expect that many overseas providers may require payment up front. Request an itemized Rechnung showing the patient, provider, dates, diagnosis or reason for care, each service, and each charge, then keep proof of payment.',
      'Ask your plan whether it needs an English translation, claim form, currency-conversion documentation, referral, or prior approval before arranging non-emergency treatment.',
      'Civilian employees generally are not assigned a military primary care manager. Military specialty access may be space available, while TRICARE and TRICARE Plus rules apply only to eligible beneficiaries.',
      'Use 112 for potentially life-threatening emergencies. For urgent, non-life-threatening care when regular practices are closed, Germany’s medical on-call service is 116117.',
      'Save a nearby primary-care practice, dentist, pharmacy, hospital, and after-hours option; dental and vision reimbursement may follow different plan rules from medical care.',
    ],
  },
  {
    category: 'Home',
    title: 'Let the house work the German way',
    summary: 'A few habits help with comfort, moisture, utility use, and good relations with a landlord.',
    tips: [
      'Practice brief, wide-open window ventilation—Stoßlüften—instead of leaving windows tilted for long periods.',
      'Learn how your heat, shutters, cellar, meters, and shared spaces work during the handover.',
      'Photograph the move-in condition and keep the signed handover record with your lease.',
      'Ask which bins, sweeping, snow, garden, or hallway duties belong to the tenant.',
    ],
  },
]

const lifeCategories = ['All', ...new Set(lifeTopics.map((topic) => topic.category))]

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>
}

function InstallPwa() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [isInstalled, setIsInstalled] = useState(() =>
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
  )

  useEffect(() => {
    const captureInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const markInstalled = () => {
      setIsInstalled(true)
      setShowGuide(false)
      setInstallPrompt(null)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowGuide(false)
    }
    const openInstallGuide = () => setShowGuide(true)

    window.addEventListener('beforeinstallprompt', captureInstallPrompt)
    window.addEventListener('appinstalled', markInstalled)
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('open-pwa-install', openInstallGuide)
    return () => {
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
      window.removeEventListener('appinstalled', markInstalled)
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('open-pwa-install', openInstallGuide)
    }
  }, [])

  const beginInstall = async () => {
    if (!installPrompt) {
      setShowGuide(true)
      return
    }

    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    setInstallPrompt(null)
    if (choice.outcome === 'accepted') setIsInstalled(true)
  }

  if (isInstalled) return null

  return (
    <>
      <button className="install-pwa-button" onClick={beginInstall} aria-haspopup="dialog">
        <span className="install-pwa-icon" aria-hidden="true">↓</span>
        Install this app
      </button>

      {showGuide && (
        <div className="install-modal-backdrop" onMouseDown={() => setShowGuide(false)}>
          <section
            className="install-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="install-modal-close" onClick={() => setShowGuide(false)} aria-label="Close installation guide">×</button>
            <p className="eyebrow">Keep your companion close</p>
            <h2 id="install-modal-title">Install the app</h2>
            <p className="install-modal-intro">Add the LRMC Companion to your home screen for quick, app-like access.</p>

            <div className="install-guide-grid">
              <article>
                <span className="install-guide-number">iOS</span>
                <h3>iPhone or iPad</h3>
                <ol>
                  <li>Open this website in <strong>Safari</strong>.</li>
                  <li>Tap the <strong>Share</strong> button—the square with an upward arrow.</li>
                  <li>Select <strong>Add to Home Screen</strong>.</li>
                  <li>Choose a name if desired, then tap <strong>Add</strong>.</li>
                </ol>
              </article>
              <article>
                <span className="install-guide-number">Android</span>
                <h3>Android phone or tablet</h3>
                <ol>
                  <li>Open this website in Chrome, Edge, Brave, or Samsung Internet.</li>
                  <li>Open the browser menu and select <strong>Install app</strong> or <strong>Add to Home screen</strong>. In Samsung Internet, use the install icon in the address bar.</li>
                  <li>Confirm the name, then tap <strong>Install</strong> or <strong>Add</strong>.</li>
                </ol>
              </article>
            </div>

            <button className="button button--primary install-modal-done" onClick={() => setShowGuide(false)}>Got it</button>
          </section>
        </div>
      )}
    </>
  )
}

function Directory({ onHome, onPlan, onLinks }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleEntries = directoryEntries.filter((entry) => {
    const matchesCategory = category === 'All' || entry.category === category
    const searchable = [
      entry.name,
      entry.category,
      entry.location,
      entry.area,
      entry.phone,
      entry.alternatePhone,
      entry.email,
      entry.dsn,
      entry.hours,
      entry.services,
      ...entry.steps,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
  })

  const mapUrl = (entry) =>
    entry.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${entry.name}, ${entry.location}`)}`

  return (
    <div className="companion-shell directory-shell">
      <SiteHeader />

      <main className="directory-main">
        <section className="directory-hero">
          <div>
            <p className="eyebrow">Cross-base service directory</p>
            <h1>Find the right place,<br /><span>when you need it.</span></h1>
          </div>
          <p>Search offices, schools, clinics, and support services. Every listing shows which part of your PCS plan it supports.</p>
        </section>

        <a className="emergency-banner" href="tel:112">
          <span className="emergency-icon" aria-hidden="true">!</span>
          <span>
            <small>Emergency in Germany</small>
            <strong>Call 112</strong>
          </span>
          <span className="emergency-call">Tap to call →</span>
        </a>

        <section className="directory-tools" aria-label="Directory filters">
          <label className="directory-search">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Office, service, city, phone, or step"
            />
          </label>
          <div className="directory-filters" aria-label="Filter by category">
            {directoryCategories.map((item) => (
              <button
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="directory-results-heading">
          <h2>{category === 'All' ? 'All services' : category}</h2>
          <span>{visibleEntries.length} {visibleEntries.length === 1 ? 'listing' : 'listings'}</span>
        </div>

        <section className="directory-grid" aria-live="polite">
          {visibleEntries.map((entry) => (
            <article className="directory-card" key={entry.id}>
              <div className="directory-card-top">
                <span className="directory-category">{entry.category}</span>
                <span className="directory-area">{entry.area}</span>
              </div>
              <h3>{entry.name}</h3>
              <p className="directory-location">{entry.location}</p>
              {(entry.dsn || entry.hours) && (
                <dl className="directory-details">
                  {entry.dsn && <><dt>DSN</dt><dd>{entry.dsn}</dd></>}
                  {entry.hours && <><dt>Hours</dt><dd>{entry.hours}</dd></>}
                </dl>
              )}
              <p className="directory-services">{entry.services}</p>
              <div className="directory-step-links">
                <small>Supports these steps</small>
                {entry.steps.map((step) => <span key={step}>{step}</span>)}
              </div>
              <div className="directory-actions">
                {entry.phone ? (
                  <>
                    <a className="directory-action directory-action--primary" href={`tel:${entry.phoneHref || entry.phone.replace(/[^\d+]/g, '')}`}>
                      Call {entry.phone}
                    </a>
                    {entry.alternatePhone && (
                      <a className="directory-action directory-action--primary" href={`tel:${entry.alternatePhone.replace(/[^\d+]/g, '')}`}>
                        Call {entry.alternatePhone}
                      </a>
                    )}
                  </>
                ) : !entry.email ? (
                  <span className="directory-no-phone">Phone not listed in source</span>
                ) : null}
                {entry.email && (
                  <a className="directory-action directory-action--primary" href={`mailto:${entry.email}`}>
                    Email office
                  </a>
                )}
                {entry.website && (
                  <a className="directory-action" href={entry.website} target="_blank" rel="noreferrer">
                    {entry.websiteLabel || 'Official website'} ↗
                  </a>
                )}
                {!entry.hideMap && (
                  <a className="directory-action" href={mapUrl(entry)} target="_blank" rel="noreferrer">
                    Open in Maps ↗
                  </a>
                )}
              </div>
            </article>
          ))}
          {visibleEntries.length === 0 && (
            <div className="directory-empty">
              <h3>No matching services</h3>
              <p>Try a city, building number, phone number, or a broader category.</p>
            </div>
          )}
        </section>

        <div className="planner-reassurance directory-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Unofficial LRMC community directory.</strong> Confirm current hours, eligibility, fees, location and appointment requirements with the responsible office before traveling.</p>
        </div>
      </main>
    </div>
  )
}

function OfficialLinks({ onHome, onPlan, onDirectory }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleLinks = officialLinks.filter((link) => {
    const matchesCategory = category === 'All' || link.category === category
    const searchable = `${link.title} ${link.agency} ${link.category} ${link.description}`.toLowerCase()
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery))
  })

  return (
    <div className="companion-shell links-shell">
      <SiteHeader />

      <main className="links-main">
        <section className="links-hero">
          <div>
            <p className="eyebrow">Official link library</p>
            <h1>Go straight to<br /><span>the source.</span></h1>
          </div>
          <p>A focused list of government and municipal resources referenced throughout this guide. Use these links to verify forms, requirements, allowances, and local rules.</p>
        </section>

        <section className="directory-tools links-tools" aria-label="Official link filters">
          <label className="directory-search">
            <span>Search official links</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Form, topic, agency, or service"
            />
          </label>
          <div className="directory-filters" aria-label="Filter by category">
            {officialLinkCategories.map((item) => (
              <button
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <div className="directory-results-heading links-results-heading">
          <h2>{category === 'All' ? 'All official links' : category}</h2>
          <span>{visibleLinks.length} {visibleLinks.length === 1 ? 'resource' : 'resources'}</span>
        </div>

        <section className="official-link-list" aria-live="polite">
          {visibleLinks.map((link) => (
            <a className="official-link-row" href={link.url} target="_blank" rel="noreferrer" key={link.url}>
              <span className="official-link-category">{link.category}</span>
              <span className="official-link-copy">
                <strong>{link.title}</strong>
                <small>{link.agency}</small>
                <span>{link.description}</span>
              </span>
              <span className="official-link-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
          {visibleLinks.length === 0 && (
            <div className="directory-empty">
              <h3>No matching links</h3>
              <p>Try a form number, agency, topic, or broader category.</p>
            </div>
          )}
        </section>

        <div className="planner-reassurance links-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Official sources can still change.</strong> Treat this library as a verified starting point, follow the current instructions on each destination site and confirm case-specific requirements with your authorized office.</p>
        </div>
      </main>
    </div>
  )
}

function VehicleGuide({ onHome, onPlan, onDirectory }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const statusLinks = [
    ['01', 'I have not shipped yet', 'vehicle-before-shipping'],
    ['02', 'My vehicle is in transit', 'vehicle-in-transit'],
    ['03', 'My vehicle has arrived', 'vehicle-pickup'],
    ['04', 'I need plates or registration', 'vehicle-registration-guide'],
  ]

  return (
    <div className="companion-shell vehicle-shell">
      <SiteHeader />

      <main className="vehicle-main">
        <section className="vehicle-hero">
          <div className="vehicle-hero-copy">
            <p className="eyebrow">POV shipment, pickup & registration</p>
            <h1>Your vehicle,<br /><span>one clear path.</span></h1>
            <p>Shipping a privately owned vehicle is not one appointment. It moves through transportation, a Vehicle Processing Center, registration, inspection, and permanent plates. This page keeps those handoffs in order.</p>
          </div>
          <aside className="vehicle-status-card" aria-labelledby="vehicle-status-title">
            <span>Start with your situation</span>
            <h2 id="vehicle-status-title">Where is your vehicle now?</h2>
            <div>
              {statusLinks.map(([number, label, id]) => (
                <button key={id} onClick={() => scrollToSection(id)}>
                  <small>{number}</small>
                  <strong>{label}</strong>
                  <span aria-hidden="true">↓</span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <aside className="vehicle-alert">
          <span aria-hidden="true">!</span>
          <div>
            <strong>Do not wait for the arrival notice to think about registration.</strong>
            <p>The Kaiserslautern VPC warns that registration backlogs can delay release of an arrived vehicle. Enter the appropriate registration queue early and verify what temporary registration or plates you need before pickup.</p>
          </div>
        </aside>

        <section className="vehicle-players" aria-labelledby="vehicle-players-title">
          <div className="vehicle-section-heading">
            <div>
              <p className="eyebrow">Know who does what</p>
              <h2 id="vehicle-players-title">Three services.<br />Three different jobs.</h2>
            </div>
            <p>These names are easy to blend together. Treat them as separate stops with separate paperwork.</p>
          </div>
          <div className="vehicle-player-grid">
            <article>
              <span>01</span>
              <small>Ships & releases</small>
              <h3>Vehicle Processing Center</h3>
              <p>International Auto Logistics receives, transports, tracks, and releases the vehicle through PCSmyPOV.</p>
            </article>
            <article>
              <span>02</span>
              <small>Checks roadworthiness</small>
              <h3>Vehicle Inspection</h3>
              <p>The safety inspection checks the vehicle before permanent registration. Arrive with required safety equipment installed or inside the vehicle.</p>
            </article>
            <article>
              <span>03</span>
              <small>Issues plates & documents</small>
              <h3>Vehicle Registration</h3>
              <p>The registration office handles temporary and permanent plates, renewals, transfers, replacements, and registration updates.</p>
            </article>
          </div>
        </section>

        <section className="vehicle-guide-section" id="vehicle-before-shipping">
          <div className="vehicle-guide-number">01</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Before shipment</p>
            <h2>Authorize it.<br />Prepare it.</h2>
            <p>Start with your orders and transportation counselor. Your authorization, approved VPC, timing, and any excess cost must be settled before you make independent shipping arrangements.</p>
            <div className="vehicle-checklist-grid">
              <article>
                <h3>Confirm before scheduling</h3>
                <ul>
                  <li>POV shipment is written into your PCS orders.</li>
                  <li>Your transportation office confirms the authorized VPC and number of vehicles.</li>
                  <li>You have orders and amendments, DD Form 1797, current registration, and proof of ownership.</li>
                  <li>You have written export authorization from a lienholder or leasing company when required.</li>
                </ul>
              </article>
              <article>
                <h3>Prepare for VPC turn-in</h3>
                <ul>
                  <li>Schedule the turn-in and review location-specific requirements in PCSmyPOV.</li>
                  <li>Resolve open recalls or carry the documentation required by the VPC.</li>
                  <li>Remove personal belongings and thoroughly clean the interior, exterior, trunk, and engine area.</li>
                  <li>Keep fuel at or below one-quarter tank and make sure the vehicle is operational.</li>
                  <li>Complete the joint condition report carefully and keep your copy.</li>
                </ul>
              </article>
            </div>
            <div className="vehicle-inline-actions">
              <a href="https://www.pcsmypov.com/" target="_blank" rel="noreferrer">Open PCSmyPOV <span>↗</span></a>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--soft" id="vehicle-in-transit">
          <div className="vehicle-guide-number">02</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">While it is in transit</p>
            <h2>Track it.<br />Prepare the handoff.</h2>
            <div className="vehicle-transit-grid">
              <article>
                <span>Track</span>
                <h3>Watch PCSmyPOV</h3>
                <p>Follow shipment status and the required delivery date. Keep your contact information current so the VPC can reach you.</p>
              </article>
              <article>
                <span>Queue</span>
                <h3>Start registration early</h3>
                <p>Review the KMC registration options before arrival and enter the correct appointment or walk-in queue as early as allowed.</p>
              </article>
              <article>
                <span>Plan</span>
                <h3>Expect a transportation gap</h3>
                <p>Plan temporary transportation without assuming routine rental-car reimbursement. If the required delivery date is missed, check PCSmyPOV for the current inconvenience-claim process.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section" id="vehicle-pickup">
          <div className="vehicle-guide-number">03</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Pickup in the KMC</p>
            <h2>Inspect before<br />you sign.</h2>
            <div className="vehicle-pickup-layout">
              <article className="vehicle-location-card">
                <small>Kaiserslautern Vehicle Processing Center</small>
                <h3>Kapaun Air Station<br />Building 2806</h3>
                <dl>
                  <div><dt>Hours</dt><dd>Mon–Fri, 0800–1600</dd></div>
                  <div><dt>Local</dt><dd><a href="tel:+4963156000905">+49 631 56000905</a></dd></div>
                  <div><dt>Email</dt><dd><a href="mailto:Kaiserslautern.VPC@ialpov.us">Kaiserslautern.VPC@ialpov.us</a></dd></div>
                </dl>
                <p>PCSmyPOV currently states that pickup appointments are not required at this VPC. Recheck the location page before traveling.</p>
                <a href="https://pcsmypov.com/locations/name/Kaiserslautern%20VPC" target="_blank" rel="noreferrer">Current VPC information ↗</a>
              </article>
              <article className="vehicle-pickup-checklist">
                <h3>At the pickup window</h3>
                <ol>
                  <li><span>01</span><p>Bring the identification, shipment documents, registration or plate documentation, and any authorization PCSmyPOV lists for your case.</p></li>
                  <li><span>02</span><p>Inspect the exterior, interior, mileage, tires, glass, accessories, and every item documented at turn-in.</p></li>
                  <li><span>03</span><p>Record all damage or missing items on the Vehicle Inspection and Shipping Form before signing. Photograph the condition.</p></li>
                  <li><span>04</span><p>Keep copies, wash the vehicle soon after pickup, and report concealed damage immediately using the current claim instructions.</p></li>
                </ol>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--navy" id="vehicle-registration-guide">
          <div className="vehicle-guide-number">04</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Registration after arrival</p>
            <h2>The practical<br />arrival order.</h2>
            <ol className="vehicle-arrival-order">
              <li><span>01</span><div><strong>Enter the registration queue</strong><p>Choose the location that handles your transaction and confirm whether it uses an appointment, 2-Meters queue, or walk-in sign-in sheet.</p></div></li>
              <li><span>02</span><div><strong>Obtain release-ready registration or temporary plates</strong><p>Confirm what the VPC requires before it can release the vehicle to you.</p></div></li>
              <li><span>03</span><div><strong>Collect and inspect the vehicle</strong><p>Complete the joint pickup inspection at the Kaiserslautern VPC before accepting it.</p></div></li>
              <li><span>04</span><div><strong>Pass the safety inspection</strong><p>Carry the required first-aid kit, warning triangle, reflective vest, and other current safety equipment.</p></div></li>
              <li><span>05</span><div><strong>Finish permanent registration</strong><p>Return with the inspection and required documents, then set up the ESSO fuel card after registration.</p></div></li>
            </ol>
            <button className="vehicle-directory-button" onClick={onDirectory}>Compare vehicle offices in the directory <span>→</span></button>
          </div>
        </section>

        <section className="vehicle-resources" aria-labelledby="vehicle-resources-title">
          <div>
            <p className="eyebrow">Verify before you go</p>
            <h2 id="vehicle-resources-title">Official starting points.</h2>
          </div>
          <div>
            <a href="https://www.pcsmypov.com/" target="_blank" rel="noreferrer"><span>Shipment, tracking & VPCs</span><strong>PCSmyPOV</strong><i>↗</i></a>
            <a href="https://www.dfas.mil/civilianemployees/civrelo/povoconus/" target="_blank" rel="noreferrer"><span>Civilian allowance guidance</span><strong>DFAS POV shipment</strong><i>↗</i></a>
            <a href="https://www.europeafrica.army.mil/RMV/" target="_blank" rel="noreferrer"><span>Registration & RMV guidance</span><strong>USAREUR-AF RMV</strong><i>↗</i></a>
          </div>
        </section>

        <div className="planner-reassurance vehicle-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Orders and current office instructions control.</strong> Entitlements, required documents, appointment systems, operating hours, inspection standards, and claim procedures can change. Verify your case with your transportation counselor, PCSmyPOV, and the servicing registration office.</p>
        </div>
      </main>
    </div>
  )
}

function HouseholdGoodsGuide({ onHome, onPlan, onLinks }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const statusLinks = [
    ['01', 'I am preparing the shipment', 'hhg-before-pickup'],
    ['02', 'My shipment is in transit', 'hhg-in-transit'],
    ['03', 'I am scheduling delivery', 'hhg-delivery'],
    ['04', 'Something is missing or damaged', 'hhg-claims'],
  ]

  return (
    <div className="companion-shell vehicle-shell household-shell">
      <SiteHeader />

      <main className="vehicle-main">
        <section className="vehicle-hero">
          <div className="vehicle-hero-copy">
            <p className="eyebrow">Household goods, baggage & delivery</p>
            <h1>Pack the move,<br /><span>protect the handoff.</span></h1>
            <p>Your orders, transportation counselor, carrier, and destination office each control a different part of the shipment. Keep the paperwork together and document condition at every handoff.</p>
          </div>
          <aside className="vehicle-status-card" aria-labelledby="hhg-status-title">
            <span>Start with your situation</span>
            <h2 id="hhg-status-title">Where are your belongings now?</h2>
            <div>
              {statusLinks.map(([number, label, id]) => (
                <button key={id} onClick={() => scrollToSection(id)}>
                  <small>{number}</small><strong>{label}</strong><span aria-hidden="true">↓</span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <aside className="vehicle-alert">
          <span aria-hidden="true">!</span>
          <div>
            <strong>Your orders and transportation office define the entitlement.</strong>
            <p>Do not assume weight limits, storage, unaccompanied baggage, personally procured moves, or reimbursement rules. Confirm authorization before arranging or paying for a shipment yourself.</p>
          </div>
        </aside>

        <section className="vehicle-guide-section" id="hhg-before-pickup">
          <div className="vehicle-guide-number">01</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Before pickup</p>
            <h2>Authorize it.<br />Inventory it.</h2>
            <div className="vehicle-checklist-grid">
              <article>
                <h3>Confirm the shipment plan</h3>
                <ul>
                  <li>Review the authorized weight, storage, shipment types, pickup location, and destination with the transportation office.</li>
                  <li>Separate what must travel with you from household goods and unaccompanied baggage.</li>
                  <li>Keep orders, amendments, inventories, carrier contacts, and shipment numbers outside the packed shipment.</li>
                  <li>Tell the counselor about items requiring special handling before pickup day.</li>
                </ul>
              </article>
              <article>
                <h3>Build your own record</h3>
                <ul>
                  <li>Photograph rooms and valuable items before packing begins.</li>
                  <li>Record serial numbers and keep receipts or appraisals when available.</li>
                  <li>Read the carrier inventory before signing and question vague descriptions or pre-existing-damage codes.</li>
                  <li>Keep medications, passports, valuables, irreplaceable records, and immediate-arrival essentials with you.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--soft" id="hhg-in-transit">
          <div className="vehicle-guide-number">02</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">While it is moving</p>
            <h2>Track it.<br />Prepare the address.</h2>
            <div className="vehicle-transit-grid">
              <article><span>Track</span><h3>Keep contact details current</h3><p>Monitor the shipment through the system or contacts provided by your transportation office. Update your phone, email, and delivery address promptly.</p></article>
              <article><span>Access</span><h3>Walk the delivery route</h3><p>Check parking, stairs, elevators, narrow doors, low ceilings, and building rules. Tell the carrier about access restrictions before delivery day.</p></article>
              <article><span>Plan</span><h3>Bridge the gap</h3><p>Coordinate FMO loaner furnishings and tour-length appliances where eligible, and keep essential household items accessible until every shipment arrives.</p></article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section" id="hhg-delivery">
          <div className="vehicle-guide-number">03</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Delivery day</p>
            <h2>Count it.<br />Inspect it.</h2>
            <div className="vehicle-checklist-grid">
              <article>
                <h3>As items enter</h3>
                <ul>
                  <li>Have an adult check inventory numbers while another directs placement when possible.</li>
                  <li>Open visibly damaged cartons and inspect high-value items before the crew leaves.</li>
                  <li>Photograph damage, missing inventory numbers, wet cartons, mold, or damage to the residence.</li>
                  <li>Record visible loss or damage on the delivery paperwork before signing.</li>
                </ul>
              </article>
              <article>
                <h3>Before the crew leaves</h3>
                <ul>
                  <li>Ask for authorized furniture reassembly and unpacking services rather than assuming what is included.</li>
                  <li>Confirm how cartons and packing debris will be handled under the shipment instructions.</li>
                  <li>Keep copies of every signed document and note unresolved concerns.</li>
                  <li>Contact the destination transportation office immediately for serious safety, water, mold, or property-damage concerns.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--navy" id="hhg-claims">
          <div className="vehicle-guide-number">04</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">After delivery</p>
            <h2>Document first.<br />Then file.</h2>
            <ol className="vehicle-arrival-order">
              <li><span>01</span><div><strong>Inspect every room promptly</strong><p>Look for concealed damage and compare delivered items against the signed inventory.</p></div></li>
              <li><span>02</span><div><strong>Preserve evidence</strong><p>Take clear photographs, retain damaged items and packaging when practical, and gather receipts, serial numbers, and repair estimates.</p></div></li>
              <li><span>03</span><div><strong>Submit notice using the current process</strong><p>Notice of loss or damage and the itemized claim are separate actions. Use the system and deadlines given for your shipment.</p></div></li>
              <li><span>04</span><div><strong>Ask before discarding or repairing</strong><p>The carrier or claims office may need inspection or salvage. Get instructions before changing the evidence.</p></div></li>
            </ol>
            <button className="vehicle-directory-button" onClick={onLinks}>Open the official link library <span>→</span></button>
          </div>
        </section>

        <section className="vehicle-resources" aria-labelledby="hhg-resources-title">
          <div><p className="eyebrow">Verify the current process</p><h2 id="hhg-resources-title">Official starting points.</h2></div>
          <div>
            <a href="https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Preparing-Civilian-PCS/" target="_blank" rel="noreferrer"><span>Civilian PCS entitlements</span><strong>DFAS — Preparing for a Civilian PCS</strong><i>↗</i></a>
            <a href="https://www.navsup.navy.mil/Portals/65/HHG/Documents/ClaimsFactSheet-PersonalPropertyClaims-2023.pdf" target="_blank" rel="noreferrer"><span>Loss, damage & claims</span><strong>Defense Personal Property claims fact sheet</strong><i>↗</i></a>
          </div>
        </section>

        <div className="planner-reassurance vehicle-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Shipment-specific instructions control.</strong> Authorization, services, systems, deadlines, and claim procedures can vary. Follow your orders and the current direction from your transportation office, carrier, and servicing claims office.</p>
        </div>
      </main>
    </div>
  )
}

function AllowancesGuide({ onHome, onPlan, onLinks }) {
  const allowances = [
    ['TQSA', 'Temporary quarters', 'May reimburse authorized temporary lodging, meals, laundry, and related subsistence costs while entering or leaving a foreign post. Receipts and claim periods matter.'],
    ['LQA', 'Permanent quarters', 'May reimburse eligible housing costs up to an authorized maximum. Lease review, allowable costs, utilities, and reconciliation requirements matter.'],
    ['Post Allowance', 'Local cost difference', 'A cost-of-living allowance that may apply at a foreign post. Eligibility and the payment index can change; it is not a fixed percentage for every employee.'],
    ['Advance Pay', 'Upfront cash flow', 'An advance of basic pay may be available when authorized, but it is repaid through payroll. Ask how repayment will affect take-home pay.'],
    ['Home Leave', 'Qualifying overseas service', 'A separate leave category earned under qualifying conditions. Accrual does not guarantee approval to use it; agency rules and future overseas service requirements apply.'],
  ]

  return (
    <div className="companion-shell vehicle-shell allowances-shell">
      <SiteHeader />

      <main className="vehicle-main">
        <section className="allowances-hero">
          <div>
            <p className="eyebrow">Civilian pay, housing & overseas allowances</p>
            <h1>Know the name.<br /><span>Know what it does.</span></h1>
          </div>
          <p>Overseas allowances solve different problems and follow different rules. This guide helps you ask the right questions without treating an estimate as an entitlement.</p>
        </section>

        <aside className="vehicle-alert allowances-alert">
          <span aria-hidden="true">!</span>
          <div>
            <strong>Your offer, orders, agency determination, and servicing office control.</strong>
            <p>Do not sign a lease, incur a major expense, or count on a payment based only on a general guide or another employee’s experience. Ask what is authorized for you and what documentation is required.</p>
          </div>
        </aside>

        <section className="allowance-overview" aria-labelledby="allowance-overview-title">
          <div className="vehicle-section-heading">
            <div><p className="eyebrow">At a glance</p><h2 id="allowance-overview-title">Five terms that<br />should not blur together.</h2></div>
            <p>Think of each as a separate lane: temporary lodging, permanent housing, local purchasing power, repayable cash flow, and leave.</p>
          </div>
          <div className="allowance-grid">
            {allowances.map(([name, label, copy], index) => (
              <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><small>{label}</small><h3>{name}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="allowance-timeline" aria-labelledby="allowance-timeline-title">
          <div className="vehicle-guide-number">→</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Use the move as your timeline</p>
            <h2 id="allowance-timeline-title">Ask before.<br />Document during.</h2>
            <div className="allowance-step-grid">
              <article><span>Before accepting costs</span><h3>Confirm eligibility in writing</h3><p>Ask HR or relocation which PCS expenses, foreign allowances, advances, and tax treatments apply to your appointment and orders.</p></article>
              <article><span>During temporary lodging</span><h3>Protect the TQSA record</h3><p>Keep itemized lodging, meal, and laundry records and follow the claim intervals and local submission process you are given.</p></article>
              <article><span>Before signing housing</span><h3>Protect the LQA decision</h3><p>Confirm the maximum, lease-review requirement, included utilities, allowable costs, and how annual reconciliation will be handled.</p></article>
              <article><span>After settling in</span><h3>Review the first payments</h3><p>Compare LES entries and reimbursements with approvals. Ask promptly about missing, unexpected, or taxable amounts.</p></article>
            </div>
          </div>
        </section>

        <section className="allowance-questions" aria-labelledby="allowance-questions-title">
          <div><p className="eyebrow">Take these questions with you</p><h2 id="allowance-questions-title">A better finance conversation.</h2></div>
          <ul>
            <li>Which allowances are specifically authorized for my appointment and dependents?</li>
            <li>Which costs require approval before I incur them?</li>
            <li>What receipts, worksheets, exchange rates, and claim intervals are required?</li>
            <li>Which PCS payments are taxable, and is RITA potentially applicable?</li>
            <li>Who reviews my lease and confirms the LQA ceiling before I sign?</li>
            <li>How will an advance of pay be repaid, and what will that do to my net pay?</li>
          </ul>
        </section>

        <section className="vehicle-resources" aria-labelledby="allowance-resources-title">
          <div><p className="eyebrow">Use current official rules</p><h2 id="allowance-resources-title">Official starting points.</h2></div>
          <div>
            <a href="https://allowances.state.gov/content.asp?content_id=282&menu_id=101" target="_blank" rel="noreferrer"><span>TQSA, LQA & Post Allowance</span><strong>Department of State Standardized Regulations</strong><i>↗</i></a>
            <a href="https://www.dfas.mil/CivilianEmployees/Civilian-Permanent-Change-of-Station-PCS/Preparing-Civilian-PCS/" target="_blank" rel="noreferrer"><span>Orders, claims & PCS finance</span><strong>DFAS — Preparing for a Civilian PCS</strong><i>↗</i></a>
            <a href="https://www.opm.gov/policy-data-oversight/pay-leave/claim-decisions/compensation-leave/claims/2020/20-0003/" target="_blank" rel="noreferrer"><span>Eligibility and agency discretion</span><strong>OPM — Home leave</strong><i>↗</i></a>
          </div>
        </section>

        <div className="planner-reassurance vehicle-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>This is an orientation, not an entitlement determination.</strong> Rates, eligibility, tax treatment, documentation, and agency implementation can change. Confirm your case with your servicing HR, CPAC, relocation, payroll, or finance office.</p>
        </div>
      </main>
    </div>
  )
}

function PetGuide({ onHome, onPlan, onDirectory }) {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const statusLinks = [
    ['01', 'I am planning the move', 'pets-plan'],
    ['02', 'I need the travel documents', 'pets-documents'],
    ['03', 'We are close to departure', 'pets-travel-day'],
    ['04', 'My pet is in Germany', 'pets-arrival'],
  ]

  return (
    <div className="companion-shell pet-shell">
      <SiteHeader />

      <main className="vehicle-main pet-main">
        <section className="vehicle-hero pet-hero">
          <div className="vehicle-hero-copy">
            <p className="eyebrow">Pet entry, travel & arrival</p>
            <h1>Bring them home,<br /><span>without surprises.</span></h1>
            <p>Germany’s pet-entry rules are manageable, but the order and timing matter. Start early, keep the official documents together, and treat the airline’s rules as a separate checklist from the country-entry requirements.</p>
          </div>
          <aside className="vehicle-status-card pet-status-card" aria-labelledby="pet-status-title">
            <span>Start with your situation</span>
            <h2 id="pet-status-title">Where are you in the process?</h2>
            <div>
              {statusLinks.map(([number, label, id]) => (
                <button key={id} onClick={() => scrollToSection(id)}>
                  <small>{number}</small>
                  <strong>{label}</strong>
                  <span aria-hidden="true">↓</span>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <aside className="vehicle-alert pet-alert">
          <span aria-hidden="true">!</span>
          <div>
            <strong>Check breed eligibility before spending money.</strong>
            <p>Germany restricts the import of Pit Bull Terriers, American Staffordshire Terriers, Staffordshire Bull Terriers, Bull Terriers, and their crosses, with limited exceptions. State rules can cover additional breeds. Ask German Customs or the responsible local authority about your exact dog before booking.</p>
          </div>
        </aside>

        <section className="vehicle-players pet-sequence" aria-labelledby="pet-sequence-title">
          <div className="vehicle-section-heading">
            <div>
              <p className="eyebrow">The sequence that protects the move</p>
              <h2 id="pet-sequence-title">Chip first.<br />Then vaccinate.</h2>
            </div>
            <p>A valid rabies vaccination for EU travel must follow a readable microchip. Reversing that order can force you to vaccinate again and restart the waiting period.</p>
          </div>
          <div className="vehicle-player-grid pet-sequence-grid">
            <article>
              <span>01</span>
              <small>Identify</small>
              <h3>ISO-compatible microchip</h3>
              <p>Have the veterinarian scan the chip at each key visit. If it is not ISO-compatible, APHIS explains the scanner or second-chip options.</p>
            </article>
            <article>
              <span>02</span>
              <small>Protect</small>
              <h3>Rabies vaccination</h3>
              <p>The vaccination must be given after the chip is implanted or scanned. A primary vaccination requires the official immunity waiting period before entry.</p>
            </article>
            <article>
              <span>03</span>
              <small>Document</small>
              <h3>EU health certificate</h3>
              <p>Use the current Germany certificate and endorsement instructions from USDA APHIS. Do not rely on an old saved form.</p>
            </article>
          </div>
        </section>

        <section className="vehicle-guide-section" id="pets-plan">
          <div className="vehicle-guide-number">01</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Four to six months out</p>
            <h2>Confirm the path<br />before booking.</h2>
            <div className="vehicle-checklist-grid">
              <article>
                <h3>Country and route</h3>
                <ul>
                  <li>Use the USDA APHIS Germany page for your specific species and travel arrangement.</li>
                  <li>Check federal and Rheinland-Pfalz breed rules for dogs and crosses.</li>
                  <li>Confirm the EU point of entry and any connection-country requirements.</li>
                  <li>If the owner will not travel within five days of the pet, review commercial-movement rules immediately.</li>
                </ul>
              </article>
              <article>
                <h3>Airline and housing</h3>
                <ul>
                  <li>Reserve pet space early; a passenger ticket does not automatically reserve a pet.</li>
                  <li>Confirm carrier dimensions, hard-sided crate requirements, weight limits, check-in time, and seasonal restrictions directly with the operating carrier.</li>
                  <li>Verify every operating airline on a codeshare itinerary.</li>
                  <li>Confirm that temporary lodging and prospective housing accept your pet, size, breed, and number of animals.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--soft pet-documents" id="pets-documents">
          <div className="vehicle-guide-number">02</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Documents and timing</p>
            <h2>Build the file<br />in the right order.</h2>
            <ol className="pet-timeline">
              <li><span>Early</span><div><strong>Scan the microchip and review rabies history</strong><p>Ask an accredited veterinarian to verify the chip, vaccination sequence, expiration dates, and whether a new dose or waiting period is required.</p></div></li>
              <li><span>Before booking</span><div><strong>Match the certificate to how the pet travels</strong><p>Non-commercial rules generally apply when five or fewer pets travel and the owner or an authorized person travels within five days. Other arrangements can require commercial documentation and tighter timing.</p></div></li>
              <li><span>Official window</span><div><strong>Complete and endorse the current EU health certificate</strong><p>Follow APHIS timing exactly. A USDA-accredited veterinarian completes the certificate and USDA endorsement is normally required unless a qualifying military veterinarian issues it.</p></div></li>
              <li><span>Before departure</span><div><strong>Sign the non-commercial declaration and check every identifier</strong><p>The owner name, microchip number, rabies information, dates, flight arrangement, and certificate pages must agree. Carry originals rather than placing them in checked baggage.</p></div></li>
            </ol>
            <div className="pet-transition-note">
              <strong>2026 certificate transition</strong>
              <p>USDA APHIS says new non-commercial certificates take effect October 1, 2026. Download the current version only when you are ready to begin the certificate process.</p>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section" id="pets-travel-day">
          <div className="vehicle-guide-number">03</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Departure and entry</p>
            <h2>Keep the originals<br />within reach.</h2>
            <div className="pet-travel-grid">
              <article>
                <small>Hand-carry</small>
                <h3>The document packet</h3>
                <p>Endorsed health certificate, signed declaration, rabies certificates, microchip record, owner identification, orders when applicable, airline confirmation, and copies stored separately.</p>
              </article>
              <article>
                <small>At check-in</small>
                <h3>The carrier setup</h3>
                <p>Use the carrier and labeling required by the operating airline. Pack only permitted accessories and follow veterinarian and airline guidance for food, water, medication, and arrival time.</p>
              </article>
              <article>
                <small>At EU entry</small>
                <h3>The compliance check</h3>
                <p>Be ready to present the pet, scan the microchip, and show the original documents to the competent authority at the designated point of entry.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="vehicle-guide-section vehicle-guide-section--navy" id="pets-arrival">
          <div className="vehicle-guide-number">04</div>
          <div className="vehicle-guide-copy">
            <p className="eyebrow">Your first weeks in Germany</p>
            <h2>Register locally.<br />Settle in safely.</h2>
            <ol className="vehicle-arrival-order">
              <li><span>01</span><div><strong>Contact Pulaski Veterinary Clinic</strong><p>The current Army civilian sponsorship checklist says employees should register pets with the USAG Rheinland-Pfalz clinic within two weeks of arrival. Confirm eligibility, the current process, and the deadline directly with the clinic.</p></div></li>
              <li><span>02</span><div><strong>Ask your municipality about dog registration</strong><p>Dog tax, registration, local forms, and any insurance requirements depend on where you live. Contact your Gemeinde, Verbandsgemeinde, or city office after securing housing.</p></div></li>
              <li><span>03</span><div><strong>Establish local veterinary care</strong><p>Military clinics provide limited space-available care and are not emergency hospitals. Save an off-base veterinarian and an after-hours emergency option before you need one.</p></div></li>
              <li><span>04</span><div><strong>Prepare for future European travel</strong><p>Ask an authorized local veterinarian whether an EU pet passport is appropriate. Keep rabies coverage continuous and check each destination’s rules before crossing borders.</p></div></li>
              <li><span>05</span><div><strong>Follow housing and public-space rules</strong><p>Confirm landlord and installation limits, leash and cleanup rules, public-transit requirements, and any breed-specific muzzle or insurance obligations.</p></div></li>
            </ol>
            <button className="vehicle-directory-button" onClick={onDirectory}>Open pet services in the directory <span>→</span></button>
          </div>
        </section>

        <section className="vehicle-resources" aria-labelledby="pet-resources-title">
          <div>
            <p className="eyebrow">Verify before you travel</p>
            <h2 id="pet-resources-title">Official starting points.</h2>
          </div>
          <div>
            <a href="https://www.aphis.usda.gov/pet-travel/us-to-another-country-export/pet-travel-us-germany" target="_blank" rel="noreferrer"><span>U.S. departure requirements</span><strong>USDA APHIS — Germany</strong><i>↗</i></a>
            <a href="https://europa.eu/youreurope/citizens/travel/carry/pets-and-other-animals/index_en.htm" target="_blank" rel="noreferrer"><span>EU entry and movement rules</span><strong>Your Europe — pet travel</strong><i>↗</i></a>
            <a href="https://www.zoll.de/DE/Privatpersonen/Reisen/Rueckkehr-aus-einem-Nicht-EU-Staat/Einschraenkungen/Gefaehrliche-Hunde/gefaehrliche_hunde.html" target="_blank" rel="noreferrer"><span>Breed import restrictions</span><strong>German Customs</strong><i>↗</i></a>
            <a href="https://home.army.mil/rheinland-pfalz/usag-rheinland-pfalz/newcomers/newcomers-kaiserslautern" target="_blank" rel="noreferrer"><span>KMC newcomer resources</span><strong>USAG Rheinland-Pfalz</strong><i>↗</i></a>
          </div>
        </section>

        <div className="planner-reassurance vehicle-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Your species, origin, route, and travel date control.</strong> This overview focuses on non-commercial movement of dogs, cats, and ferrets from the United States. Other animals and arrangements can follow different rules. Verify the current APHIS, EU, German, airline, and local requirements before acting.</p>
        </div>
      </main>
    </div>
  )
}

function Companion({ onHome, onProfile, onDirectory, onLinks, onVehicle, onPets, onHouseholdGoods, onAllowances, onLife, onSuggestUpdate, onInstall }) {
  const [relocationProfile] = useState(readRelocationProfile)
  const [activePhase, setActivePhase] = useState(
    () => relocationStageMap[relocationProfile.stage]?.phase || 'Offer & orders',
  )
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('lrmc-plan-progress'))
        || JSON.parse(localStorage.getItem('germany-pcs-progress'))
        || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('lrmc-plan-progress', JSON.stringify(completed))
    } catch {
      // The checklist remains usable when browser storage is unavailable.
    }
  }, [completed])

  const visibleTasks = orderedPhaseTasks.filter((task) => task.phase === activePhase)
  const activeTip = phaseTips[activePhase]
  const taskGroups = activePhase === 'Offer & orders'
    ? [
        ['After your Tentative Job Offer (TJO)', visibleTasks.filter((task) => task.milestone === 'After your Tentative Job Offer (TJO)')],
        ['After your Final Job Offer (FJO)', visibleTasks.filter((task) => task.milestone === 'After your Final Job Offer (FJO)')],
      ]
    : [[null, visibleTasks]]
  const completion = Math.round((completed.length / phaseTasks.length) * 100)
  const personalizedTags = new Set(
    [
      ...relocationProfile.selected,
      ...(relocationProfile.appointment === 'new-federal' ? ['new-federal'] : []),
    ].flatMap((item) => relocationProfileTags[item] || []),
  )
  const hasProfile = Boolean(relocationProfile.appointment || relocationProfile.stage || relocationProfile.selected.length)

  const toggleTask = (id) => {
    setCompleted((current) =>
      current.includes(id) ? current.filter((taskId) => taskId !== id) : [...current, id],
    )
  }

  const printChecklist = () => window.print()

  const openTaskGuide = (guideType) => {
    if (guideType === 'pets') return onPets()
    if (guideType === 'household-goods') return onHouseholdGoods()
    if (guideType === 'life') return onLife()
    return onVehicle()
  }

  return (
    <div className="companion-shell">
      <SiteHeader />

      <main className="planner">
        <aside className="planner-sidebar">
          <p className="eyebrow">Your journey</p>
          <h2>One mission.<br />One step at a time.</h2>
          <div className="progress-card">
            <div>
              <span>Overall progress</span>
              <strong>{completion}%</strong>
            </div>
            <div className="progress-bar" aria-label={`${completion}% complete`}>
              <span style={{ width: `${completion}%` }} />
            </div>
            <small>{completed.length} of {phaseTasks.length} essential steps complete</small>
          </div>
          <button className="print-plan-button" onClick={printChecklist}>
            <span aria-hidden="true">⇩</span>
            <span>
              <strong>Print the complete checklist</strong>
              <small>Save all four stages as a PDF</small>
            </span>
            <span aria-hidden="true">→</span>
          </button>
          <p className="device-note">Your checkmarks are saved only on this device.</p>
        </aside>

        <section className="planner-main">
          <div className="planner-intro">
            <div>
              <p className="eyebrow">Your personalized roadmap</p>
              <h1>Where are you<br /><span>right now?</span></h1>
            </div>
            <p>Choose the stage that matches your move. We’ll keep the immediate tasks in focus while your full plan stays close at hand.</p>
          </div>

          {hasProfile && (
            <section className="plan-profile-summary" aria-label="Your saved relocation profile">
              <div className="plan-profile-summary__lead">
                <p className="eyebrow">Your move at a glance</p>
                <strong>{relocationStageMap[relocationProfile.stage]?.label || 'LRMC relocation plan'}</strong>
                <span>Tasks connected to your circumstances are marked “For your move.”</span>
              </div>
              {(relocationProfile.appointment || relocationProfile.selected.length > 0) && (
                <div className="plan-profile-chips" aria-label="Selected planning details">
                  {relocationProfile.appointment && <span>{relocationAppointmentLabels[relocationProfile.appointment]}</span>}
                  {relocationProfile.selected.map((item) => (
                    <span key={item}>{relocationProfileLabels[item]}</span>
                  ))}
                </div>
              )}
              <button type="button" onClick={onProfile}>Adjust profile</button>
            </section>
          )}

          <div className="phase-tabs" role="tablist" aria-label="PCS journey stage">
            {journeyStages.map(([number, title]) => (
              <button
                key={title}
                className={activePhase === title ? 'is-active' : ''}
                onClick={() => setActivePhase(title)}
                role="tab"
                aria-selected={activePhase === title}
              >
                <span>{number}</span>
                {title}
              </button>
            ))}
          </div>

          <div className="task-heading">
            <div>
              <p className="eyebrow">Focus now</p>
              <h2>{activePhase}</h2>
            </div>
            <span>{visibleTasks.length} essential {visibleTasks.length === 1 ? 'step' : 'steps'}</span>
          </div>

          {activeTip && (
            <aside className="good-to-know" aria-labelledby="good-to-know-title">
              <span className="good-to-know-icon" aria-hidden="true">i</span>
              <div>
                <p className="good-to-know-label">{activeTip.label}</p>
                <h3 id="good-to-know-title">{activeTip.title}</h3>
                <p>{activeTip.detail}</p>
                <small>{activeTip.note}</small>
              </div>
            </aside>
          )}

          <div className="task-groups">
            {taskGroups.map(([milestone, tasks]) => (
              <section className="task-group" key={milestone || activePhase} aria-label={milestone || activePhase}>
                {milestone && <h3 className="task-group-heading">{milestone}</h3>}
                <div className="task-list">
                  {tasks.map((task) => {
                    const isDone = completed.includes(task.id)
                    const isProfileMatch = personalizedTags.has(task.tag)
                    return (
                      <article className={`task-card ${isDone ? 'is-done' : ''} ${isProfileMatch ? 'is-profile-match' : ''}`} key={task.id}>
                        <button
                          className="task-check"
                          onClick={() => toggleTask(task.id)}
                          aria-label={`${isDone ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
                          aria-pressed={isDone}
                        >
                          {isDone ? '✓' : ''}
                        </button>
                        <div>
                          <div className="task-meta">
                            <span>{task.window}</span>
                            <span>{task.tag}</span>
                            {isProfileMatch && <strong className="profile-match-badge">For your move</strong>}
                            {task.critical && <strong className="critical-badge">Critical</strong>}
                          </div>
                          <h3>{task.title}</h3>
                          <p>{task.detail}</p>
                          {task.criticalNote && (
                            <aside className="critical-note">
                              <strong>Confirm your servicing path before you go</strong>
                              <p>{task.criticalNote}</p>
                              <div>
                                {task.criticalLinks.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}>{link.label} ↗</a>)}
                              </div>
                            </aside>
                          )}
                          {task.guideLabel && (
                            <button className="task-guide-link" onClick={() => openTaskGuide(task.guideType)}>
                              {task.guideLabel} <span aria-hidden="true">→</span>
                            </button>
                          )}
                          {task.forms && (
                            <div className="task-forms">
                              <small>Official forms</small>
                              <div>
                                {task.forms.map((form) => (
                                  <a href={form.url} target="_blank" rel="noreferrer" key={`${task.id}-${form.number}`}>
                                    <strong>{form.number}</strong>
                                    <span>
                                      {form.title}
                                      <small>{form.note}</small>
                                    </span>
                                    <span aria-hidden="true">↗</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <div className="planner-reassurance">
            <span aria-hidden="true">i</span>
            <p><strong>Unofficial public guide.</strong> This site is not affiliated with any government agency, installation, base, unit, or employer. Confirm requirements with your authorized relocation or HR contact before acting.</p>
          </div>
        </section>
      </main>

      <section className="print-checklist" aria-label="Complete four-stage LRMC relocation checklist">
        <header className="print-checklist-header">
          <div>
            <span className="print-brand-mark">LR</span>
            <p><strong>LANDSTUHL</strong><span>LRMC Companion</span></p>
          </div>
          <p>Unofficial community resource · Complete four-stage checklist</p>
          <h1>Your path to LRMC,<br /><span>one step at a time.</span></h1>
          <p>Use this printable copy alongside your personalized online checklist. Confirm eligibility, deadlines, documents, and case-specific requirements with your servicing CPAC, HR, relocation, transportation, finance, or responsible government office.</p>
        </header>

        {journeyStages.map(([number, phase, copy]) => {
          const printTasks = orderedPhaseTasks.filter((task) => task.phase === phase)
          return (
            <section className="print-phase" key={phase}>
              <header>
                <span>{number}</span>
                <div><p>{copy}</p><h2>{phase}</h2></div>
                <strong>{printTasks.length} steps</strong>
              </header>
              <div className="print-task-list">
                {printTasks.map((task) => (
                  <article className="print-task" key={task.id}>
                    <span className="print-checkbox" aria-hidden="true" />
                    <div>
                      <p className="print-task-meta">{task.milestone ? `${task.milestone} · ` : ''}{task.window} · {task.tag}</p>
                      <h3>{task.title}</h3>
                      <p>{task.detail}</p>
                      {task.forms && (
                        <div className="print-task-forms">
                          <strong>Official forms:</strong>{' '}
                          {task.forms.map((form) => `${form.number} — ${form.title}`).join(' · ')}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <footer className="print-checklist-footer">
          <strong>Unofficial LRMC Companion.</strong> Content and official-source links can change. Return to the interactive edition for updates and verify requirements with the responsible office before acting.
        </footer>
      </section>
    </div>
  )
}

function LifeInGermany({ onHome, onPlan, onDirectory, onLinks }) {
  const [category, setCategory] = useState('All')
  const visibleTopics = lifeTopics.filter((topic) => category === 'All' || topic.category === category)

  return (
    <div className="companion-shell life-shell">
      <SiteHeader />

      <main className="life-main">
        <section className="life-hero">
          <div>
            <p className="eyebrow">Life beyond the LRMC campus</p>
            <h1>Build a life<br /><span>around the mission.</span></h1>
          </div>
          <div className="life-hero-copy">
            <p>Start at LRMC and work outward into the Landstuhl–Ramstein–Kaiserslautern community. Learn the routines that shape a real week: housing, transportation, healthcare, installation access, neighbors and local life.</p>
            <div className="life-quick-start">
              <small>Your first local week</small>
              <ul>
                <li>Find your municipality’s waste calendar.</li>
                <li>Save your closest grocery store, bakery, pharmacy, and train or bus stop.</li>
                <li>Plan the first Sunday and public holiday before everything closes.</li>
                <li>Save 112, 116117, and the access office for the installations you use.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="local-area-section" aria-labelledby="local-area-heading">
          <div className="life-section-heading">
            <div>
              <p className="eyebrow">Your local geography</p>
              <h2 id="local-area-heading">One region,<br />many rhythms.</h2>
            </div>
            <p>The area works less like one city and more like a connected collection of towns, installations, and villages. Your home address will shape your commute, waste rules, school route, and everyday errands.</p>
          </div>
          <div className="local-area-grid">
            {localAreas.map((area, index) => (
              <article key={area.name}>
                <span className="local-area-number">0{index + 1}</span>
                <p className="path-card__eyebrow">{area.label}</p>
                <h3>{area.name}</h3>
                <p>{area.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="life-topics" aria-labelledby="life-topics-heading">
          <div className="life-section-heading">
            <div>
              <p className="eyebrow">The everyday guide</p>
              <h2 id="life-topics-heading">What changes<br />after you arrive.</h2>
            </div>
            <p>Choose a topic and learn the local pattern. These are practical starting points; city, county, lease, and village rules may differ by address.</p>
          </div>

          <div className="life-topic-filters" aria-label="Filter everyday-life topics">
            {lifeCategories.map((item) => (
              <button
                key={item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="life-topic-grid" aria-live="polite">
            {visibleTopics.map((topic) => (
              <article className="life-topic-card" key={topic.title}>
                <span className="life-topic-label">{topic.category}</span>
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
                <ul>
                  {topic.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="local-resources" aria-labelledby="local-resources-heading">
          <div>
            <p className="eyebrow">Keep the official sources close</p>
            <h2 id="local-resources-heading">Local answers,<br />when details matter.</h2>
          </div>
          <div className="local-resource-links">
            <a href="https://www.welcome-to-rlp.org/guide/overview" target="_blank" rel="noreferrer">
              <span>Living guide</span>
              <strong>Welcome to Rheinland-Pfalz</strong>
              <ArrowIcon />
            </a>
            <a href="https://www.kaiserslautern-kreis.de/verwaltung/abfallwirtschaft/" target="_blank" rel="noreferrer">
              <span>County addresses</span>
              <strong>Kaiserslautern County waste information</strong>
              <ArrowIcon />
            </a>
            <a href="https://stadtbildpflege-kaiserslautern.de/" target="_blank" rel="noreferrer">
              <span>City addresses</span>
              <strong>City of Kaiserslautern waste information</strong>
              <ArrowIcon />
            </a>
            <a href="https://www3.kaiserslautern.de/gaco/" target="_blank" rel="noreferrer">
              <span>Community help</span>
              <strong>German-American Community Office</strong>
              <ArrowIcon />
            </a>
            <a href="https://www.ramstein.af.mil/About/Fact-Sheets/Article/726166/ramstein-visitor-control-center/" target="_blank" rel="noreferrer">
              <span>Air Force installations</span>
              <strong>Ramstein visitor access guidance</strong>
              <ArrowIcon />
            </a>
            <a href="https://home.army.mil/rheinland-pfalz/index.php/about/directorates-support-offices/directorate-emergency-services-des/installation-access-control" target="_blank" rel="noreferrer">
              <span>Army installations</span>
              <strong>USAG Rheinland-Pfalz access guidance</strong>
              <ArrowIcon />
            </a>
            <a href="https://www.opm.gov/healthcare-insurance/healthcare/plan-information/important-facts-about-overseas-coverage/" target="_blank" rel="noreferrer">
              <span>Civilian health coverage</span>
              <strong>OPM overseas FEHB guidance</strong>
              <ArrowIcon />
            </a>
            <a href="https://gesund.bund.de/en" target="_blank" rel="noreferrer">
              <span>German healthcare</span>
              <strong>Federal health portal and provider search</strong>
              <ArrowIcon />
            </a>
          </div>
        </section>

        <div className="planner-reassurance life-disclaimer">
          <span aria-hidden="true">i</span>
          <p><strong>Unofficial local-life guide.</strong> Community and status-specific rules can differ by address and affiliation. Confirm local requirements with your municipality or landlord, installation access and patronage with the responsible security or service office, and healthcare coverage with your current FEHB plan.</p>
        </div>
      </main>
    </div>
  )
}

function App() {
  const getViewFromHash = () => {
    if (window.location.hash === '#plan') return 'plan'
    if (window.location.hash === '#directory') return 'directory'
    if (window.location.hash === '#life') return 'life'
    if (window.location.hash === '#links') return 'links'
    if (window.location.hash === '#vehicle') return 'vehicle'
    if (window.location.hash === '#pets') return 'pets'
    if (window.location.hash === '#household-goods') return 'household-goods'
    if (window.location.hash === '#allowances') return 'allowances'
    if (window.location.hash === '#suggest-update') return 'suggest-update'
    if (window.location.hash === '#about-lrmc') return 'about-lrmc'
    if (window.location.hash === '#careers-lrmc') return 'careers-lrmc'
    if (window.location.hash === '#tjo') return 'tjo'
    if (['#working-lrmc', '#work-culture', '#first-days', '#readiness-at-work', '#work-resources', '#career-paths', '#federal-application', '#career-life', '#joining', '#careers'].includes(window.location.hash)) return 'careers-lrmc'
    if (['#about', '#mission', '#history', '#leadership', '#identity', '#purpose', '#legacy', '#command'].includes(window.location.hash)) return 'about-lrmc'
    return 'home'
  }
  const [activeView, setActiveView] = useState(getViewFromHash)
  const [showCommunityNotice, setShowCommunityNotice] = useState(() => {
    try {
      return localStorage.getItem('lrmc-community-notice') !== 'accepted'
        && localStorage.getItem('germany-pcs-community-notice') !== 'accepted'
    } catch {
      return true
    }
  })

  const acceptCommunityNotice = () => {
    try {
      localStorage.setItem('lrmc-community-notice', 'accepted')
    } catch {
      // Keep the acknowledgment usable when browser storage is unavailable.
    }
    setShowCommunityNotice(false)
  }

  useEffect(() => {
    const handleHash = () => {
      const nextView = getViewFromHash()
      const anchor = document.getElementById(window.location.hash.slice(1))
      if (nextView !== 'home' || !anchor || window.location.hash === '#top') setActiveView(nextView)
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  useEffect(() => {
    const aliases = { mission: 'purpose', history: 'legacy', leadership: 'command', about: 'identity', 'working-lrmc': 'work-culture', joining: 'first-days', careers: 'career-paths' }
    const scrollToSection = () => {
      const hash = window.location.hash.slice(1)
      document.getElementById(aliases[hash] || hash)?.scrollIntoView()
    }
    const frame = requestAnimationFrame(scrollToSection)
    window.addEventListener('hashchange', scrollToSection)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', scrollToSection) }
  }, [activeView])

  useEffect(() => {
    if (!showCommunityNotice) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showCommunityNotice])


  const startPlan = () => {
    window.location.hash = 'plan'
    setActiveView('plan')
  }

  const openTjo = () => {


    window.location.hash = 'tjo'
    setActiveView('tjo')
    window.scrollTo(0, 0)
  }

  const openDirectory = () => {
    window.location.hash = 'directory'
    setActiveView('directory')
  }

  const openLife = () => {
    window.location.hash = 'life'
    setActiveView('life')
    window.scrollTo(0, 0)
  }

  const openLinks = () => {
    window.location.hash = 'links'
    setActiveView('links')
    window.scrollTo(0, 0)
  }

  const openVehicle = () => {
    window.location.hash = 'vehicle'
    setActiveView('vehicle')
    window.scrollTo(0, 0)
  }

  const openPets = () => {
    window.location.hash = 'pets'
    setActiveView('pets')
    window.scrollTo(0, 0)
  }

  const openHouseholdGoods = () => {
    window.location.hash = 'household-goods'
    setActiveView('household-goods')
    window.scrollTo(0, 0)
  }

  const openAllowances = () => {


    window.location.hash = 'allowances'
    setActiveView('allowances')
    window.scrollTo(0, 0)
  }

  const openSuggestUpdate = () => {


    window.location.hash = 'suggest-update'
    setActiveView('suggest-update')
    window.scrollTo(0, 0)
  }

  const openAboutLrmc = () => {


    window.location.hash = 'about-lrmc'
    setActiveView('about-lrmc')
    window.scrollTo(0, 0)
  }

  const openCareersLrmc = () => {


    window.location.hash = 'careers-lrmc'
    setActiveView('careers-lrmc')
    window.scrollTo(0, 0)
  }

  const openWorkingLrmc = () => {


    window.location.hash = 'working-lrmc'
    setActiveView('working-lrmc')
    window.scrollTo(0, 0)
  }

  const openInstall = () => {


    window.dispatchEvent(new Event('open-pwa-install'))
  }

  const returnHome = () => {
    window.history.pushState(null, '', window.location.pathname)
    setActiveView('home')
    window.scrollTo(0, 0)
  }

  if (activeView === 'plan') {
    return <><Companion onHome={returnHome} onProfile={openTjo} onDirectory={openDirectory} onLinks={openLinks} onVehicle={openVehicle} onPets={openPets} onHouseholdGoods={openHouseholdGoods} onAllowances={openAllowances} onLife={openLife} onSuggestUpdate={openSuggestUpdate} onInstall={openInstall} /><InstallPwa /></>
  }

  if (activeView === 'directory') {
    return <><Directory onHome={returnHome} onPlan={startPlan} onLinks={openLinks} /><InstallPwa /></>
  }

  if (activeView === 'life') {
    return <><LifeInGermany onHome={returnHome} onPlan={startPlan} onDirectory={openDirectory} onLinks={openLinks} /><InstallPwa /></>
  }

  if (activeView === 'links') {
    return <><OfficialLinks onHome={returnHome} onPlan={startPlan} onDirectory={openDirectory} /><InstallPwa /></>
  }

  if (activeView === 'vehicle') {
    return <><VehicleGuide onHome={returnHome} onPlan={startPlan} onDirectory={openDirectory} /><InstallPwa /></>
  }

  if (activeView === 'pets') {
    return <><PetGuide onHome={returnHome} onPlan={startPlan} onDirectory={openDirectory} /><InstallPwa /></>
  }

  if (activeView === 'household-goods') {
    return <><HouseholdGoodsGuide onHome={returnHome} onPlan={startPlan} onLinks={openLinks} /><InstallPwa /></>
  }

  if (activeView === 'allowances') {
    return <><AllowancesGuide onHome={returnHome} onPlan={startPlan} onLinks={openLinks} /><InstallPwa /></>
  }

  if (activeView === 'suggest-update') {
    return <><SuggestUpdate onHome={returnHome} onDirectory={openDirectory} /><InstallPwa /></>
  }


  if (activeView === 'about-lrmc') {
    return <><AboutLrmc onHome={returnHome} onPlan={openTjo} /><InstallPwa /></>
  }


  if (activeView === 'careers-lrmc') {
    return <><CareersLrmc onHome={returnHome} onPlan={openTjo} onLife={openLife} onDirectory={openDirectory} onArrival={startPlan} /><InstallPwa /></>
  }

  if (activeView === 'tjo') {
    return <><TjoLanding onHome={returnHome} onBuildPlan={startPlan} /><InstallPwa /></>
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      {showCommunityNotice && (
        <div className="community-modal-backdrop">
          <section
            className="community-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="community-modal-title"
            aria-describedby="community-modal-description"
          >
            <div className="community-modal-mark" aria-hidden="true">i</div>
            <p className="eyebrow">Before you continue</p>
            <h2 id="community-modal-title">Open community resource</h2>
            <div id="community-modal-description" className="community-modal-copy">
              <p>This companion is unofficial and maintained for the community. It is not affiliated with or endorsed by any government agency, base, installation, unit, organization, or employer.</p>
              <p>Information here is general guidance, not official direction. Requirements, eligibility, deadlines, benefits, and case-specific decisions must be confirmed with your servicing Civilian Personnel Advisory Center (CPAC), authorized HR or relocation office, or the responsible government agency.</p>
            </div>
            <button className="button button--primary community-modal-accept" onClick={acceptCommunityNotice} autoFocus>
              I understand — continue
              <span aria-hidden="true">→</span>
            </button>
          </section>
        </div>
      )}

      <main id="top">
        <section
          className="hero hero--mission section-pad"
          style={{ '--hero-image': `url("${assetUrl('/pictures/2977236532-20120920-A-UR215-140.JPG')}")` }}
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Landstuhl Regional Medical Center
            </p>
            <h1>
              Selfless Service.
              <span>Ready for every mission.</span>
            </h1>
            <p className="hero-lede">
              Selfless service is our center of gravity—uniting people, purpose
              and readiness in care for those who serve and the families who
              stand beside them.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#about-lrmc">
                Explore LRMC
                <span aria-hidden="true">→</span>
              </a>
              <button className="text-link" onClick={openTjo}>
                I received a TJO
                <ArrowIcon />
              </button>
            </div>
            <p className="privacy-note">
              <span>Unofficial public edition</span>
              <span className="privacy-note__dot" aria-hidden="true">•</span>
              <span>Official sources clearly identified</span>
            </p>
          </div>

        </section>

        <section className="home-destinations section-pad" aria-label="Explore LRMC">
          <article>
            <p className="eyebrow">About LRMC / Our Mission</p>
            <h2>Understand the place and its purpose.</h2>
            <p>Explore LRMC’s mission, its role within DHA, the history of the medical center and its leadership.</p>
            <button className="button button--secondary" onClick={openAboutLrmc}>About LRMC & Our Mission <span aria-hidden="true">→</span></button>
          </article>
          <article>
            <p className="eyebrow">Careers</p>
            <h2>Build your future at LRMC.</h2>
            <p>Find your career path, understand how to apply and learn what to expect when joining the team.</p>
            <button className="button button--secondary" onClick={openCareersLrmc}>Explore careers <span aria-hidden="true">→</span></button>
          </article>
        </section>

        <section className="closing section-pad">
          <img
            src={assetUrl('/pictures/2054941469-original.jpg')}
            alt="Entrance to Landstuhl Regional Medical Center"
          />
          <div className="closing-overlay" />
          <div className="closing-copy">
            <p className="eyebrow">Your path to LRMC</p>
            <h2>Called to serve? Start where you are.</h2>
            <button className="button button--light" onClick={openTjo}>
              Start my LRMC plan
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </main>
      <InstallPwa />

      <footer className="site-footer section-pad">
        <a className="brand" href="#top" aria-label="Back to top">
          <span className="brand-mark">LR</span>
          <span className="brand-copy">
            <strong>LANDSTUHL</strong>
            <span>Regional Medical Center</span>
          </span>
        </a>
        <p>Military medicine. Mission readiness. Human care.</p>
        <div className="footer-links">
          <button onClick={openAboutLrmc}>About LRMC & Our Mission</button>
          <button onClick={openCareersLrmc}>Careers</button>
          <button onClick={openDirectory}>Services & Offices</button>
          <button onClick={openSuggestUpdate}>Suggest an update</button>
          <button onClick={() => setShowCommunityNotice(true)}>About this guide</button>
        </div>
      </footer>
    </div>
  )
}

export default App
