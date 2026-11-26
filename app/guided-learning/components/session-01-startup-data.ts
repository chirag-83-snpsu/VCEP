/**
 * Session 01 Edition 3.1: Startup Experience Data & Models
 * Real Indian Startup Cases (Zerodha, Nykaa, Meesho) + Fictional Venture Simulations
 * Standards-compliant, strictly non-downloadable, client-hydrated.
 */

export interface StartupStory {
  id: 'zerodha' | 'nykaa' | 'meesho';
  company: string;
  foundingYear: string;
  location: string;
  badgeClass: string;
  hook: string;
  problem: string;
  model: string;
  verifiedFact: string;
  reportingPeriod: string;
  sourceUrl: string;
  decisionPrompt: string;
  options: {
    id: string;
    text: string;
    isOptimal: boolean;
    feedback: string;
  }[];
}

export const STARTUP_STORIES: StartupStory[] = [
  {
    id: 'zerodha',
    company: 'Zerodha',
    foundingYear: '2010',
    location: 'Bengaluru',
    badgeClass: 'badge-zerodha',
    hook: 'How two brothers built India’s largest stockbroker without raising venture capital or spending on advertising.',
    problem: 'Opaque brokerage charges (often 0.5%–1.0% per trade) and hidden fees blocked everyday retail Indians from investing.',
    model: 'Discount digital brokerage. Zero brokerage for equity delivery; flat ₹20 for intraday and F&O, powered by transparent technology (Kite).',
    verifiedFact: '16 years bootstrapped (August 2026 update); largest broker in India by customer AUM with ~₹9,000 Cr MTF book and zero ad spend.',
    reportingPeriod: 'Founder August 2026 16th Anniversary Letter',
    sourceUrl: 'https://zerodha.com/about/',
    decisionPrompt: 'How would you earn the trust of your first 100 customers with zero marketing budget?',
    options: [
      {
        id: 'opt-free',
        text: 'Offer free trading indefinitely and absorb server losses with personal credit cards.',
        isOptimal: false,
        feedback: 'Subsidizing losses without a viable revenue model creates cash burn, not sustainable trust.'
      },
      {
        id: 'opt-transparency',
        text: 'Publish 100% transparent pricing with zero lock-in, open free financial education (Varsity), and let active traders verify low costs.',
        isOptimal: true,
        feedback: 'Excellent founder thinking! Transparent pricing and genuine financial education built a viral word-of-mouth moat that attracted 1.3+ crore clients.'
      },
      {
        id: 'opt-affiliates',
        text: 'Pay social media influencers high commissions to aggressively promote your app.',
        isOptimal: false,
        feedback: 'Paying affiliate promoters can attract short-term speculative signups, but does not build durable fiduciary trust in financial services.'
      }
    ]
  },
  {
    id: 'nykaa',
    company: 'Nykaa',
    foundingYear: '2012',
    location: 'Mumbai',
    badgeClass: 'badge-nykaa',
    hook: 'An investment banker started a beauty company at age 50 and built an omnichannel market leader.',
    problem: 'The Indian beauty market was fragmented, flooded with counterfeit cosmetics, and lacked authentic international brands.',
    model: 'Curated, inventory-led omnichannel beauty marketplace with 150+ physical stores (Nykaa Luxe & On Trend) and direct brand sourcing.',
    verifiedFact: 'FY2026 Revenue from Operations reached ₹10,022 Cr (26% YoY growth) with GMV of ₹19,963 Cr and EBITDA of ₹752 Cr; >70% GMV from repeat customers.',
    reportingPeriod: 'FY2026 Integrated Annual Report (ended Mar 31, 2026)',
    sourceUrl: 'https://nykaa.com',
    decisionPrompt: 'What makes customers choose your new store over established, heavily discounted marketplaces?',
    options: [
      {
        id: 'opt-deep-discount',
        text: 'Sell unbranded replica cosmetics at 80% cheaper prices than branded items.',
        isOptimal: false,
        feedback: 'In personal care, selling unverified cheap replicas ruins skin safety and permanently destroys brand credibility.'
      },
      {
        id: 'opt-authenticity',
        text: 'Guarantee 100% verified brand authenticity, expert beauty tutorials, and physical stores where shoppers test shades before buying.',
        isOptimal: true,
        feedback: 'Spot on! Customers pay for verified authenticity and curated trial in beauty. Repeat customer orders account for over 70% of Nykaa’s total GMV.'
      },
      {
        id: 'opt-cashburn',
        text: 'Burn all seed funding on selling genuine luxury products at a 50% loss.',
        isOptimal: false,
        feedback: 'Price wars only attract bargain hunters who leave the moment prices normalize. Gross margin must cover operating delivery costs.'
      }
    ]
  },
  {
    id: 'meesho',
    company: 'Meesho',
    foundingYear: '2015',
    location: 'Bengaluru',
    badgeClass: 'badge-meesho',
    hook: 'Empowering regional manufacturers and small-town shoppers through zero-commission social commerce.',
    problem: 'Small manufacturers in Tier-2/3 cities could not afford 20%–30% marketplace commissions, while value-conscious shoppers wanted affordable everyday goods.',
    model: '0% seller commission marketplace. Monetizes through seller advertising and dedicated third-party logistics optimization (Valmo network).',
    verifiedFact: 'FY2026 Net Merchandise Value (NMV) reached ₹41,560 Cr across 2.67 billion orders with 264 million annual transacting users.',
    reportingPeriod: 'FY2026 Annual Report & Regulatory Filings',
    sourceUrl: 'https://bseindia.com',
    decisionPrompt: 'Would you prioritise explosive transaction order volume or sustainable unit operations?',
    options: [
      {
        id: 'opt-unlimited-free-ship',
        text: 'Subsidize free shipping on ₹50 items regardless of logistics cost to artificially inflate order counts.',
        isOptimal: false,
        feedback: 'Warning: Shipping a ₹50 product at a ₹60 delivery cost guarantees insolvency as volume scales. High GMV without margin control is fatal.'
      },
      {
        id: 'opt-unit-economics',
        text: 'Optimize logistics cost per order (Valmo network) and ensure every delivered shipment has positive unit contribution before scaling.',
        isOptimal: true,
        feedback: 'Master-level corporate thinking! Meesho built a customized logistics network (Valmo) to reduce shipping costs per parcel, sustaining 2.67 billion orders.'
      },
      {
        id: 'opt-high-commission',
        text: 'Impose a sudden 25% seller commission to extract quick revenue from existing regional vendors.',
        isOptimal: false,
        feedback: 'Sudden high commissions cause small regional sellers to abandon the platform, collapsing your core supply advantage.'
      }
    ]
  }
];

export interface VentureCase {
  id: string;
  name: string;
  tag: string;
  summary: string;
  persona: string;
  inconvenience: string;
  resources: string;
  expectations: string;
  friction: string;
  decisions: {
    decisionA: {
      question: string;
      options: { id: string; text: string; label: string; feedback: string; isRecommended: boolean }[];
    };
    decisionB: {
      question: string;
      options: { id: string; text: string; label: string; feedback: string; isRecommended: boolean }[];
    };
    decisionC: {
      question: string;
      options: { id: string; text: string; label: string; feedback: string; isRecommended: boolean }[];
    };
    decisionD: {
      question: string;
      options: { id: string; text: string; label: string; feedback: string; isRecommended: boolean }[];
    };
    decisionE: {
      question: string;
      options: { id: string; text: string; label: string; feedback: string; isRecommended: boolean }[];
    };
  };
}

export const VENTURE_CASES: VentureCase[] = [
  {
    id: 'quickbite',
    name: 'QuickBite Fresh',
    tag: 'Student Food Subscription',
    summary: 'Homestyle, healthy daily lunch subscription for collegiate dormers and tech interns.',
    persona: '1st & 2nd year undergraduates and tech interns living in PGs in Koramangala / HSR Layout.',
    inconvenience: 'Hostel mess food is oily and unpalatable; food delivery apps cost ₹250–₹350 per meal with ₹40 delivery charges and take 45 minutes.',
    resources: 'Partnership with a licensed home-kitchen 500m from campus, ₹12,000 pooled student savings, 2 bicycle runners.',
    expectations: 'Hot, hygienic 3-item homestyle thali (dal, seasonal sabzi, 3 rotis/rice) delivered to hostel gate at 1:15 PM sharp for ₹90.',
    friction: 'Tight 45-minute lunch break between lectures. A 10-minute delay causes students to miss lunch or be late for class.',
    decisions: {
      decisionA: {
        question: 'Decision A · Identify the Core Problem',
        options: [
          {
            id: 'qa1',
            label: 'Acute Daily Friction',
            text: 'Hostellers eat unhealthy, expensive food because PG messes are unpalatable and delivery apps cost ₹300/meal.',
            feedback: 'Strong problem statement! It highlights both health frustration and budget pain experienced daily.',
            isRecommended: true
          },
          {
            id: 'qa2',
            label: 'Secondary Cosmetic Issue',
            text: 'Existing food delivery apps use too much disposable plastic tape on boxes.',
            feedback: 'Packaging is a valid eco-concern, but students buy food to eat affordably, not purely to reduce tape.',
            isRecommended: false
          },
          {
            id: 'qa3',
            label: 'Exotic Speculation',
            text: 'College students want 5-star European continental salads and avocado dips.',
            feedback: 'Unrealistic for everyday student budgets. Daily repeat demand is in clean, comforting staple meals.',
            isRecommended: false
          }
        ]
      },
      decisionB: {
        question: 'Decision B · Choose the Initial Target Customer',
        options: [
          {
            id: 'qb1',
            label: 'Focused Early Adopters',
            text: 'Hostel students in Blocks A & B without cooking access who eat out at least 5 days a week.',
            feedback: 'Clear beachhead market! You can physically reach and interview all 150 target students in one afternoon.',
            isRecommended: true
          },
          {
            id: 'qb2',
            label: 'Excessively Broad',
            text: 'All 1.4 crore residents of the Greater Bengaluru metropolitan area who get hungry.',
            feedback: 'Targeting everyone means targeting no one. You cannot market or deliver across 700 sq km with 2 bicycles.',
            isRecommended: false
          },
          {
            id: 'qb3',
            label: 'Mismatched Demographic',
            text: 'Senior corporate executives with in-house cafeteria plans in tech parks.',
            feedback: 'Corporate executives have completely different pricing, security access, and dietary demands than campus students.',
            isRecommended: false
          }
        ]
      },
      decisionC: {
        question: 'Decision C · Scope the Minimum Viable Service (MVP)',
        options: [
          {
            id: 'qc1',
            label: 'Focused Disciplined MVP',
            text: 'One fixed, high-quality homestyle thali menu rotated daily, delivered in insulated stainless tiffins at 1:15 PM.',
            feedback: 'Clean MVP! A single fixed menu eliminates food waste, streamlines kitchen prep, and ensures punctuality.',
            isRecommended: true
          },
          {
            id: 'qc2',
            label: 'Premature Feature Bloat',
            text: 'A 50-dish custom menu with live GPS mobile app tracking, calorie calculators, and on-demand cooking.',
            feedback: 'Feature bloat trap! You will spend your entire budget coding an app while the kitchen struggles to cook 50 dishes.',
            isRecommended: false
          },
          {
            id: 'qc3',
            label: 'Compromised Quality',
            text: 'Cold pre-packaged sandwiches bought from a wholesale depot 3 days in advance.',
            feedback: 'Students already reject cold stale food. Competing on stale cheap items ruins repeat subscription renewals.',
            isRecommended: false
          }
        ]
      },
      decisionD: {
        question: 'Decision D · How to Win Your First 10 Paying Customers',
        options: [
          {
            id: 'qd1',
            label: 'Grassroots Word-of-Mouth',
            text: 'Host a free taste-test table outside the hostel on Sunday evening; offer a 5-day prepaid meal pass for ₹400 with a 100% money-back guarantee.',
            feedback: 'Direct grassroots traction! Personal tasting eliminates food hesitation and secures upfront prepaid cash flow.',
            isRecommended: true
          },
          {
            id: 'qd2',
            label: 'Cash-Burning Ad Spend',
            text: 'Spend ₹15,000 on sponsored Instagram and Google Ads targeting Bengaluru foodies.',
            feedback: 'Capital burn mistake. Online ads yield low conversion without established reviews, depleting your seed cash in 48 hours.',
            isRecommended: false
          },
          {
            id: 'qd3',
            label: 'Passive Hope Marketing',
            text: 'Paste a printed black-and-white flyer on the library notice board and wait for incoming calls.',
            feedback: 'Passive flyers are ignored. Founders must personally put the product in front of early customers.',
            isRecommended: false
          }
        ]
      },
      decisionE: {
        question: 'Decision E · Delivery Process & Failure Remediation',
        options: [
          {
            id: 'qe1',
            label: 'Reliable Rota with Standby Buffer',
            text: 'Two dedicated campus runners with WhatsApp coordination and 2 standby buffer meals; immediate apology and instant refund if late by >10 mins.',
            feedback: 'Professional operational control! Buffer meals and proactive refund guarantees build fierce customer loyalty.',
            isRecommended: true
          },
          {
            id: 'qe2',
            label: 'Uncontrolled Outsourcing',
            text: 'Book random gig riders through third-party apps with no phone contact and no backup if rider cancels.',
            feedback: 'High operational vulnerability. If the third-party rider cancels, 40 hungry students starve and cancel their plans.',
            isRecommended: false
          },
          {
            id: 'qe3',
            label: 'Customer Blaming',
            text: 'Tell hungry students they should have walked to the kitchen if they wanted their food on time.',
            feedback: 'Customer service catastrophe. Blaming the user destroys venture reputation and triggers viral negative reviews.',
            isRecommended: false
          }
        ]
      }
    }
  },
  {
    id: 'campusmerch',
    name: 'CampusMerch Co',
    tag: 'Custom Collegiate Apparel',
    summary: 'Fast-turnaround premium hoodies and fest kits with low minimum order quantities.',
    persona: 'College fest committees, sports captains, departmental clubs, and graduating class reps.',
    inconvenience: 'Wholesale printers in industrial zones demand 200+ piece minimum orders, take 3 weeks, and deliver wrong sizes or poor prints.',
    resources: 'Direct tie-up with a local digital direct-to-garment (DTG) print workshop in Peenya, student designer on Figma, physical fabric swatch kit.',
    expectations: '240 GSM heavy cotton hoodies with crisp screen printing, delivered in 72 hours with zero defective pieces.',
    friction: 'Event deadlines are rigid. If hoodies arrive 2 hours after the college fest opens, the committee cancels the order.',
    decisions: {
      decisionA: {
        question: 'Decision A · Identify the Core Problem',
        options: [
          {
            id: 'ma1',
            label: 'Acute Event Deadline Risk',
            text: 'College club leaders face unmanageable minimum order limits (200 pcs) and frequent late deliveries that arrive after fest dates.',
            feedback: 'Sharp problem definition! It targets non-negotiable event timelines and prohibitive order minimums.',
            isRecommended: true
          },
          {
            id: 'ma2',
            label: 'Minor Style Issue',
            text: 'College merchandise lacks trendy neon zip pulls.',
            feedback: 'Zip pulls are trivial styling details; clubs struggle with size misprints, fabric shrinkage, and late delivery.',
            isRecommended: false
          },
          {
            id: 'ma3',
            label: 'Irrelevant Scope',
            text: 'Students want expensive Italian leather jackets for college sports day.',
            feedback: 'Leather jackets do not fit collegiate budgets or sports activity requirements.',
            isRecommended: false
          }
        ]
      },
      decisionB: {
        question: 'Decision B · Choose the Initial Target Customer',
        options: [
          {
            id: 'mb1',
            label: 'High-Urgency Club Organizers',
            text: 'The 6 organizing committees of the upcoming annual Inter-Collegiate Cultural Fest.',
            feedback: 'Ideal beachhead! Fest organizers have approved club budgets, high urgency, and ready customer counts.',
            isRecommended: true
          },
          {
            id: 'mb2',
            label: 'Scattered Retail Shoppers',
            text: 'Individual random students buying single plain t-shirts.',
            feedback: 'Single-unit retail sales have high acquisition costs and small margins. Bulk club orders provide immediate cash.',
            isRecommended: false
          },
          {
            id: 'mb3',
            label: 'Distant Corporations',
            text: 'National airline cabin crews requiring tailored uniforms.',
            feedback: 'Airline uniform tenders require years of manufacturing certifications and massive credit cycles.',
            isRecommended: false
          }
        ]
      },
      decisionC: {
        question: 'Decision C · Scope the Minimum Viable Service (MVP)',
        options: [
          {
            id: 'mc1',
            label: 'Fast-Turnaround Core Apparel',
            text: 'Black and Navy 240 GSM cotton hoodies with 1-color screen print, 20-piece minimum order, delivered in 4 days.',
            feedback: 'Disciplined MVP! Standardizing base garment colors and print specs keeps production predictable.',
            isRecommended: true
          },
          {
            id: 'mc2',
            label: 'Complex Customization Overload',
            text: 'Embroidery, glow-in-the-dark inks, custom metal buttons, and 20 different fabric blends across 15 styles.',
            feedback: 'Production nightmare! Custom embroidery and 15 blends multiply supplier delays and misprint rates.',
            isRecommended: false
          },
          {
            id: 'mc3',
            label: 'Low-Grade Polyester',
            text: 'Cheap 100% synthetic polyester t-shirts that make students sweat profusely.',
            feedback: 'Poor fabric quality ruins club trust; committees will never re-order from you for next semester.',
            isRecommended: false
          }
        ]
      },
      decisionD: {
        question: 'Decision D · How to Win Your First 10 Paying Customers',
        options: [
          {
            id: 'md1',
            label: 'Direct Physical Sample Pitch',
            text: 'Carry a physical sample hoodie and fabric swatch kit directly into the Fest Committee meeting; offer a guaranteed on-time delivery bond.',
            feedback: 'Founder hustle! Organizers want to touch fabric and inspect stitching before releasing club funds.',
            isRecommended: true
          },
          {
            id: 'md2',
            label: 'Mass Email Blast',
            text: 'Send cold bulk emails to generic college info@ address boxes.',
            feedback: 'College generic email boxes are spam-filtered and rarely read by student club heads.',
            isRecommended: false
          },
          {
            id: 'md3',
            label: 'Online Storefront Build',
            text: 'Spend 2 months coding an e-commerce website before talking to any club heads.',
            feedback: 'Premature engineering. B2B club merchandise is sold through relationship pitches, not cold web checkouts.',
            isRecommended: false
          }
        ]
      },
      decisionE: {
        question: 'Decision E · Delivery Process & Failure Remediation',
        options: [
          {
            id: 'me1',
            label: 'On-Site Quality Check & Penalty Clause',
            text: 'Founder personally inspects print alignment at the factory before pickup; 24-hour advance delivery buffer with a 20% refund if late.',
            feedback: 'Robust operational governance! Factory-gate quality inspection eliminates defective surprises.',
            isRecommended: true
          },
          {
            id: 'me2',
            label: 'Blind Dispatch',
            text: 'Have the factory courier the boxes directly to the fest stage without opening them to check sizes.',
            feedback: 'Disaster waiting to happen! Misprinted logos or wrong sizes will be discovered on the fest stage.',
            isRecommended: false
          },
          {
            id: 'me3',
            label: 'Zero Accountability Clause',
            text: 'Force the committee to sign a disclaimer saying late arrival is their problem.',
            feedback: 'No customer will sign an agreement that strips them of late delivery protection for a fest.',
            isRecommended: false
          }
        ]
      }
    }
  },
  {
    id: 'cleanwash',
    name: 'CleanWash Express',
    tag: 'Dorm Laundry Logistics',
    summary: 'Next-day wash, dry, and fold laundry pickup for students in PGs without washing facilities.',
    persona: 'Hostel and PG residents living near major colleges without in-house laundry machines or drying balconies.',
    inconvenience: 'Hand-washing takes 4 exhausting weekend hours; local dhobis take 6 days and regularly fade garments or mix up clothes.',
    resources: 'Off-peak rate agreement with a commercial laundromat, 30 barcode-tagged washable canvas bags, electric scooter for pickups.',
    expectations: 'Fresh, neatly folded clothes returned within 24 hours at ₹60/kg with zero lost socks or color bleeding.',
    friction: 'Monsoon humidity slows drying, and sorting errors risk customer garments getting mixed up.',
    decisions: {
      decisionA: {
        question: 'Decision A · Identify the Core Problem',
        options: [
          {
            id: 'ca1',
            label: 'Acute Weekend Time Drain',
            text: 'Hostel students waste 4 hours hand-washing clothes or wait 6 days for traditional dhobis who lose garments.',
            feedback: 'Clear, compelling pain point! Saves valuable weekend study/rest time and eliminates lost clothes anxiety.',
            isRecommended: true
          },
          {
            id: 'ca2',
            label: 'Minor Aesthetic Concern',
            text: 'Laundry detergent boxes have unattractive packaging designs.',
            feedback: 'Detergent box aesthetics do not matter to busy students who just need clean clothes.',
            isRecommended: false
          },
          {
            id: 'ca3',
            label: 'Luxury Dry-Cleaning Niche',
            text: 'College students need dry-cleaning for bespoke wedding sherwanis every week.',
            feedback: 'Students wear t-shirts and jeans daily. Daily wash-and-fold is the repeat demand driver.',
            isRecommended: false
          }
        ]
      },
      decisionB: {
        question: 'Decision B · Choose the Initial Target Customer',
        options: [
          {
            id: 'cb1',
            label: 'Dormers Without Washing Machines',
            text: 'Students in 3 private PGs on 5th Cross Road that have no washing machines or terrace clotheslines.',
            feedback: 'Geographically dense beachhead! Pickups across 3 adjacent buildings take only 20 minutes.',
            isRecommended: true
          },
          {
            id: 'cb2',
            label: 'City-Wide Scatter',
            text: 'Independent apartments across the entire Whitefield and Electronic City corridors.',
            feedback: 'Logistics trap! Spending 3 hours riding an electric scooter across 40 km burns all profit in battery and time.',
            isRecommended: false
          },
          {
            id: 'cb3',
            label: 'Industrial Uniforms',
            text: 'Chemical manufacturing plant hazard suits.',
            feedback: 'Hazardous chemical laundry requires specialized EPA/pollution permits and industrial steam autoclaves.',
            isRecommended: false
          }
        ]
      },
      decisionC: {
        question: 'Decision C · Scope the Minimum Viable Service (MVP)',
        options: [
          {
            id: 'cc1',
            label: 'Standard Wash-Dry-Fold',
            text: 'Pick up 1 tagged canvas bag (up to 5 kg) at 8:00 PM; return washed, tumble-dried, and folded at 8:00 PM next evening for ₹250.',
            feedback: 'Pragmatic MVP! Predictable evening collection and delivery slots match student campus schedules.',
            isRecommended: true
          },
          {
            id: 'cc2',
            label: 'Complex On-Demand Custom Care',
            text: 'Stain removal, steam pressing, hand-knitted fabric repair, and custom scented fabric softeners.',
            feedback: 'Operational complexity trap. Complex stain treatment and tailoring repairs multiply turnaround delays.',
            isRecommended: false
          },
          {
            id: 'cc3',
            label: 'Cold Wash Without Drying',
            text: 'Return soaking wet clothes in plastic bags and ask students to dry them on their hostel beds.',
            feedback: 'Wet clothes mildew quickly and create dormitory odor; students will immediately cancel subscriptions.',
            isRecommended: false
          }
        ]
      },
      decisionD: {
        question: 'Decision D · How to Win Your First 10 Paying Customers',
        options: [
          {
            id: 'cd1',
            label: 'PG Common Room Demonstration',
            text: 'Distribute 10 free trial bags to PG floor leaders; demonstrate 24-hour return with a clean, crisp fold.',
            feedback: 'High-leverage conversion! When hostel floor leaders show their fresh laundry, roommates sign up instantly.',
            isRecommended: true
          },
          {
            id: 'cd2',
            label: 'Broadsheet Newspaper Ads',
            text: 'Publish an advertisement in the city edition of a major English newspaper.',
            feedback: 'Massive cost with near-zero campus targeting. College students do not read print broadsheet classifieds.',
            isRecommended: false
          },
          {
            id: 'cd3',
            label: 'Radio Jingles',
            text: 'Record a radio FM jingle to broadcast during evening drive-time traffic.',
            feedback: 'Radio ads cost tens of thousands of rupees and fail to target specific campus hostel clusters.',
            isRecommended: false
          }
        ]
      },
      decisionE: {
        question: 'Decision E · Delivery Process & Failure Remediation',
        options: [
          {
            id: 'ce1',
            label: 'Barcoded Bag Tracking & Color-Sorting Audit',
            text: 'Each customer bag has an individual barcode and mesh wash net; clothes sorted by dark/light before washing; ₹1,000 garment protection pledge.',
            feedback: 'Prevents the #1 customer nightmare: color bleeding and lost garments. The protection pledge builds ironclad trust.',
            isRecommended: true
          },
          {
            id: 'ce2',
            label: 'Communal Wash Heap',
            text: 'Dump all clothes from 10 customers into one giant washer drum without tags and sort them by memory.',
            feedback: 'Guaranteed disaster! Socks and identical black t-shirts will get permanently mixed up.',
            isRecommended: false
          },
          {
            id: 'ce3',
            label: 'Refuse Lost-Garment Liability',
            text: 'Tell the customer that missing clothes are assumed stolen by their roommates.',
            feedback: 'Erodes all trust. If founders do not stand behind their service quality, word-of-mouth turns hostile.',
            isRecommended: false
          }
        ]
      }
    }
  },
  {
    id: 'digitlocal',
    name: 'DigitLocal Studio',
    tag: 'SME Digital Onboarding',
    summary: 'Turnaround digital presence and WhatsApp catalogs for neighborhood campus kiranas and bakeries.',
    persona: 'Owners of standalone bakery shops, stationery stores, and traditional kirana grocers near college clusters.',
    inconvenience: 'Losing daily student orders to 10-minute quick-commerce apps because they have no digital presence or online ordering catalog.',
    resources: 'Smartphone, Canva templates, Google Business Profile expertise, student tech fluency, basic photo lighting clip.',
    expectations: 'Verified Google Maps presence, clean WhatsApp Business digital menu with photos, and tabletop QR code stand for ₹1,500.',
    friction: 'Shopkeepers are skeptical of technology, hesitant to spend money, and fear complex inventory software.',
    decisions: {
      decisionA: {
        question: 'Decision A · Identify the Core Problem',
        options: [
          {
            id: 'da1',
            label: 'Acute Small-Biz Revenue Loss',
            text: 'Independent neighborhood shops lose customer orders to quick-commerce delivery apps because they have no digital catalog.',
            feedback: 'Exact market dynamic! Small shop owners feel existential pressure from hyper-funded delivery apps.',
            isRecommended: true
          },
          {
            id: 'da2',
            label: 'Superficial Issue',
            text: 'Shop cash registers make an unappealing dinging sound.',
            feedback: 'Cash register sound does not affect shop survival or online customer discovery.',
            isRecommended: false
          },
          {
            id: 'da3',
            label: 'Irrelevant Complexity',
            text: 'Small kirana shops need automated AI drone delivery on their rooftops.',
            feedback: 'Drone delivery is science fiction for a 200 sq ft corner kirana. They need simple WhatsApp ordering.',
            isRecommended: false
          }
        ]
      },
      decisionB: {
        question: 'Decision B · Choose the Initial Target Customer',
        options: [
          {
            id: 'db1',
            label: 'High-Footfall Campus Cafes & Bakeries',
            text: 'The 8 bakery and snack joints along College Road that students frequent during tea breaks.',
            feedback: 'Ideal early adopters! Bakeries and cafes have visually appealing snacks and high student impulse ordering.',
            isRecommended: true
          },
          {
            id: 'db2',
            label: 'Global Enterprise Conglomerates',
            text: 'Multinational automobile manufacturers with 50,000 employees.',
            feedback: 'MNC enterprise contracts take 18 months of corporate procurement committee reviews.',
            isRecommended: false
          },
          {
            id: 'db3',
            label: 'Remote Rural Farms',
            text: 'Deep-rural grain farmers 300 km outside the city with limited network.',
            feedback: 'Remote rural farming requires agritech logistics and mandi infrastructure, not campus snack menus.',
            isRecommended: false
          }
        ]
      },
      decisionC: {
        question: 'Decision C · Scope the Minimum Viable Service (MVP)',
        options: [
          {
            id: 'dc1',
            label: 'Turnkey 48-Hour Digital Pack',
            text: 'Set up verified Google Maps listing, photograph top 15 bestselling items for WhatsApp Business catalog, and provide 2 acrylic QR stands.',
            feedback: 'Outstanding MVP! Delivers concrete, tangible business assets to the shopkeeper in 48 hours for an affordable fee.',
            isRecommended: true
          },
          {
            id: 'dc2',
            label: 'Custom ERP Software Build',
            text: 'Promise to build a custom enterprise ERP software from scratch with barcode scanners and cloud databases.',
            feedback: 'Overpromising trap! A custom ERP takes 6 months to code and traditional shopkeepers refuse to learn complex screens.',
            isRecommended: false
          },
          {
            id: 'dc3',
            label: 'Low-Effort Paper Flyer',
            text: 'Hand the shopkeeper a photocopied paper flyer and tell them to figure out WhatsApp themselves.',
            feedback: 'No added value. Shopkeepers pay for done-for-you execution, not confusing advice.',
            isRecommended: false
          }
        ]
      },
      decisionD: {
        question: 'Decision D · How to Win Your First 10 Paying Customers',
        options: [
          {
            id: 'dd1',
            label: 'In-Person Storefront Walk-In Demo',
            text: 'Walk into the bakery during slow afternoon hours; show a mock WhatsApp menu already built on your phone for their shop; offer pay-after-setup.',
            feedback: 'Classic sales mastery! Showing their own bakery items live on WhatsApp overcomes skepticism instantly.',
            isRecommended: true
          },
          {
            id: 'dd2',
            label: 'Cold Telephone Sales',
            text: 'Call shopkeepers during peak evening rush hour and pitch cloud digital transformations.',
            feedback: 'Shopkeepers are busy attending to counter customers; cold calls during peak rush get hung up immediately.',
            isRecommended: false
          },
          {
            id: 'dd3',
            label: 'Billboard Advertising',
            text: 'Rent a highway billboard advertising your digital agency.',
            feedback: 'Highway billboards cost lakhs of rupees and will not persuade a local corner tea shop owner.',
            isRecommended: false
          }
        ]
      },
      decisionE: {
        question: 'Decision E · Delivery Process & Failure Remediation',
        options: [
          {
            id: 'de1',
            label: 'In-Person Staff Training & 14-Day Check-In',
            text: 'Train the shopkeeper and cashier for 20 minutes on how to receive WhatsApp orders; visit in person on day 7 & 14 to verify orders; 100% money-back if no orders received.',
            feedback: 'Ensures real adoption! Training the counter staff guarantees the digital catalog actually gets used.',
            isRecommended: true
          },
          {
            id: 'de2',
            label: 'Hit and Run',
            text: 'Take the money, print the QR code, and never answer the shopkeeper’s phone calls again.',
            feedback: 'Unethical and destructive. The shopkeeper will tell neighboring businesses you ran a scam.',
            isRecommended: false
          },
          {
            id: 'de3',
            label: 'Charge Hourly Support Fees',
            text: 'Charge the shopkeeper ₹500 every time they forget how to open WhatsApp on their phone.',
            feedback: 'Exploitative support fees create customer resentment and kill any chance of word-of-mouth referral.',
            isRecommended: false
          }
        ]
      }
    }
  }
];

export interface BoardroomRole {
  id: string;
  title: string;
  mandate: string;
  focus: string;
}

export const BOARDROOM_ROLES: BoardroomRole[] = [
  {
    id: 'role-strategy',
    title: 'Founder & Strategy Lead',
    mandate: 'Owns overall venture vision, customer promise, brand reputation, and team morale.',
    focus: 'Protecting long-term customer trust over short-term panic.'
  },
  {
    id: 'role-marketing',
    title: 'Customer & Marketing Lead',
    mandate: 'Acts as the customer’s advocate, manages direct communication, reviews, and retention.',
    focus: 'Proactive customer transparency, honest apologies, and future booking incentives.'
  },
  {
    id: 'role-operations',
    title: 'Operations & Logistics Lead',
    mandate: 'Manages suppliers, kitchens, couriers, inventory, and physical fulfilment.',
    focus: 'Finding emergency delivery routes and managing inventory buffers.'
  },
  {
    id: 'role-finance',
    title: 'Finance & Sustainability Lead',
    mandate: 'Guards unit margins, burn rate, cash flow, and supplier payment cycles.',
    focus: 'Ensuring emergency solutions do not wipe out all working capital reserves.'
  },
  {
    id: 'role-risk',
    title: 'Risk & Quality Lead',
    mandate: 'Ensures service standards, safety compliance, and prevents brand-destroying failures.',
    focus: 'Validating that delivered meals/items meet 100% quality standards.'
  }
];

export const CRISIS_SCENARIO = {
  title: 'Operational Fulfilment Setback',
  scenario:
    'Customer interest is surging: 40 orders have been booked and prepaid for tomorrow morning. However, at 8:00 PM tonight, your primary delivery vendor messages: "Vehicle fleet broke down across our delivery hub. We cannot fulfil tomorrow morning’s deliveries!"',
  options: [
    {
      id: 'strat-a',
      title: 'Strategy A · Proactive Transparency & Founder Fulfilment (Recommended)',
      summary: 'Founders manually deliver the top 15 priority orders on campus; immediately phone the remaining 25 customers with an honest apology, a 50% discount voucher for next week, and reschedule.',
      isOptimal: true,
      feedback: 'Outstanding founder leadership! Customers respect honesty and hustle. You preserve cash, protect trust with priority clients, and turn an operational crisis into a loyalty-building moment.'
    },
    {
      id: 'strat-b',
      title: 'Strategy B · Emergency Courier Hire at Any Cost',
      summary: 'Hire instant on-demand bike couriers at 3x commercial rate, absorbing an immediate ₹2,000 cash loss on day 1 to deliver 100% of orders.',
      isOptimal: false,
      feedback: 'Protects delivery completion, but burning ₹2,000 of limited seed cash on day one threatens venture solvency if couriers fail again tomorrow.'
    },
    {
      id: 'strat-c',
      title: 'Strategy C · Silent Delay',
      summary: 'Say nothing to customers tonight, hope the delivery partner repairs their fleet overnight, and dispatch orders 3 hours late tomorrow afternoon.',
      isOptimal: false,
      feedback: 'Fatal trust breach! Hungry or waiting customers will cancel orders, demand refunds, and post scathing reviews across campus.'
    }
  ]
};

export interface CustomerInterviewQuestion {
  id: string;
  question: string;
  category: 'behavior' | 'friction' | 'cost' | 'leading' | 'hypothetical' | 'hearsay';
  isRecommended: boolean;
  typeLabel: string;
  feedback: string;
}

export const CUSTOMER_INTERVIEW_QUESTIONS: CustomerInterviewQuestion[] = [
  {
    id: 'iq-past-behavior',
    question: 'When was the last time you experienced this problem, and how did you resolve it?',
    category: 'behavior',
    isRecommended: true,
    typeLabel: 'Past Behavior Evidence',
    feedback: 'Excellent discovery question! Asking about specific past actions reveals actual customer habits rather than hypothetical promises.'
  },
  {
    id: 'iq-friction-depth',
    question: 'What is the most frustrating or time-consuming part of dealing with this issue today?',
    category: 'friction',
    isRecommended: true,
    typeLabel: 'Acute Pain Point',
    feedback: 'Great founder question! It pinpoints the exact operational friction the customer cares about most.'
  },
  {
    id: 'iq-workaround-cost',
    question: 'How much time, money, or effort do you currently spend on workarounds for this?',
    category: 'cost',
    isRecommended: true,
    typeLabel: 'Current Cost of Inaction',
    feedback: 'High-value validation question! Quantifying current spend proves genuine commercial willingness to pay.'
  },
  {
    id: 'iq-leading-feature',
    question: 'Would you use a cool, convenient digital app that solves this problem for you?',
    category: 'leading',
    isRecommended: false,
    typeLabel: 'Leading Feature Trap',
    feedback: 'Warning: Leading question! People are naturally polite and almost always answer YES to hypothetical features, giving you false validation.'
  },
  {
    id: 'iq-hypothetical-pricing',
    question: 'If this service existed tomorrow, would you pay ₹100 per week for it?',
    category: 'hypothetical',
    isRecommended: false,
    typeLabel: 'Hypothetical Price Guess',
    feedback: 'Caution: Asking for hypothetical payment promises produces false positives. Look for what they currently spend or ask for a real pre-order.'
  },
  {
    id: 'iq-hearsay',
    question: 'Do you think other students or colleagues would like an idea like this?',
    category: 'hearsay',
    isRecommended: false,
    typeLabel: 'Speculative Hearsay',
    feedback: 'Avoid: Asking respondents to speak for other people yields speculation, not reliable customer validation data.'
  }
];

export interface PricingTradeOffOption {
  id: string;
  title: string;
  badge: string;
  consequence: string;
  isOptimal: boolean;
  feedback: string;
}

export const PRICING_TRADE_OFF_OPTIONS: PricingTradeOffOption[] = [
  {
    id: 'pt-discount',
    title: 'Grant an immediate 30% discount to guarantee your first booking.',
    badge: 'Cash-Burning Price War',
    consequence: 'Generates an immediate order, but creates negative unit margin and anchors an unsustainably low price point that customers resist raising later.',
    isOptimal: false,
    feedback: 'Caution: Discounting below delivery costs burns cash and attracts price-sensitive churn. Initial customers must validate your core value, not subsidised prices.'
  },
  {
    id: 'pt-scope',
    title: 'Keep the price per unit firm, but reduce the order scope or volume to match their budget.',
    badge: 'Disciplined Scope Pruning',
    consequence: 'Protects positive unit contribution while accommodating the customer’s limited initial spend, establishing fair value per unit.',
    isOptimal: true,
    feedback: 'Sharp founder thinking! Reducing scope preserves unit margin and tests genuine demand without cheapening your brand value.'
  },
  {
    id: 'pt-guarantee',
    title: 'Defend standard price by demonstrating calculated ROI and backing it with a 100% satisfaction guarantee.',
    badge: 'Value-Anchored Assurance',
    consequence: 'Anchors premium brand positioning and builds fiduciary trust, but requires flawless operational execution to avoid refund claims.',
    isOptimal: true,
    feedback: 'Master-level commercial discipline! Customers pay full price when risk is removed through credible quality guarantees and proven savings.'
  }
];

export const VAYENTRA_LABS_FINANCIAL_CASE = {
  company: 'Vayentra Labs',
  scenario:
    'Vayentra Labs sells corporate support services. In September, the company earned ₹1,00,000 in revenue and incurred ₹75,000 in operating expenses. Customers paid ₹60,000 in cash towards their invoices; cash paid out for expenses was ₹70,000. Opening bank balance was ₹20,000. An operations manager proposes paying an immediate ₹15,000 vendor invoice for new office equipment, claiming that the ₹25,000 accounting profit means the money is fully available to spend.',
  figures: {
    revenue: 100000,
    expenses: 75000,
    customerCashReceipts: 60000,
    cashExpensesPaid: 70000,
    openingBank: 20000,
    minimumSafetyReserve: 5000,
    proposedSupplierPayment: 15000,
  },
  correctSolutions: {
    profit: 25000,
    netCashMovement: -10000,
    closingBank: 10000,
    availableAboveReserve: 5000,
    paymentShortfall: 10000,
  },
  teachingExplanation:
    'In business, accounting profit and liquid cash are completely different. While Vayentra Labs earned ₹25,000 in accounting profit, ₹40,000 of September sales remain uncollected in accounts receivable. Because actual cash paid out (₹70,000) exceeded cash receipts (₹60,000), cash flow was negative ₹10,000. After setting aside the mandatory ₹5,000 emergency reserve, only ₹5,000 of free cash is available—leaving a ₹10,000 shortfall for the proposed ₹15,000 equipment payment! Paying ₹15,000 today would breach the bank reserve and risk operational insolvency.',
};

export interface OrderToCashStep {
  id: string;
  stepNumber: number;
  title: string;
  defaultOwner: string;
  roleOptions: string[];
  description: string;
  riskIfMissing: string;
}

export const ORDER_TO_CASH_STEPS: OrderToCashStep[] = [
  {
    id: 'enquiry',
    stepNumber: 1,
    title: 'Inbound Enquiry & Scope Request',
    defaultOwner: 'Sales Lead',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'Prospective client contacts business with requirement specifications.',
    riskIfMissing: 'Misunderstood scope creates delivery disputes and delayed invoicing.'
  },
  {
    id: 'order',
    stepNumber: 2,
    title: 'Order Confirmation & Agreement',
    defaultOwner: 'Sales Lead',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'Signed client contract, purchase order, or written confirmation.',
    riskIfMissing: 'Commencing work without signed confirmation risks non-payment.'
  },
  {
    id: 'delivery',
    stepNumber: 3,
    title: 'Delivery Evidence & Acceptance Note',
    defaultOwner: 'Delivery Manager',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'Signed delivery receipt, milestone acceptance sign-off, or service completion note.',
    riskIfMissing: 'CRITICAL FAILURE: Without written proof of delivery, clients dispute invoices, freezing collections indefinitely!'
  },
  {
    id: 'invoice',
    stepNumber: 4,
    title: 'Tax Invoice Generation',
    defaultOwner: 'Finance Officer',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'GST-compliant invoice sent with clear 15-day / 30-day payment terms.',
    riskIfMissing: 'Delayed invoicing postpones the client payment clock, creating unnecessary cash shortfalls.'
  },
  {
    id: 'collection',
    stepNumber: 5,
    title: 'Cash Collection Follow-up',
    defaultOwner: 'Finance Officer',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'Active reconciliation and professional reminders prior to due date.',
    riskIfMissing: 'Unmonitored receivables turn into bad debts and starve the business of working capital.'
  },
  {
    id: 'receipt',
    stepNumber: 6,
    title: 'Receipt Allocation & Bank Reconciliation',
    defaultOwner: 'Finance Officer',
    roleOptions: ['Sales Lead', 'Delivery Manager', 'Finance Officer'],
    description: 'Match customer bank deposit credit against outstanding invoice in ledger.',
    riskIfMissing: 'Unreconciled cash records lead to duplicate customer follow-ups and inaccurate financial reporting.'
  }
];

export interface TrainerStageGuide {
  stage: number;
  title: string;
  suggestedMinutes: number;
  objective: string;
  openingQuestion: string;
  studentAction: string;
  discussionPrompt: string;
  expectedOutcome: string;
  commonErrors: string;
  offlineFallback: string;
}

export const TRAINER_GUIDELINES: TrainerStageGuide[] = [
  {
    stage: 1,
    title: 'The Founder Spark',
    suggestedMinutes: 7,
    objective: 'Demonstrate that all business value originates from solving an acute customer inconvenience.',
    openingQuestion: 'Think about your last 24 hours on campus. What is one daily hassle you would gladly pay ₹50 to make disappear?',
    studentAction: 'Pick one of 4 relatable problem scenarios, define the target user, and explain why it matters.',
    discussionPrompt: 'How can you distinguish an acute everyday problem from a minor personal annoyance?',
    expectedOutcome: 'A concise student opportunity brief anchoring the remainder of the session.',
    commonErrors: 'Choosing broad, vague problems without identifying who specifically suffers.',
    offlineFallback: 'Distribute print index cards; students pair up to pitch their customer problem in 30 seconds.'
  },
  {
    stage: 2,
    title: 'Inside Real Startups',
    suggestedMinutes: 9,
    objective: 'Extract disciplined customer-centric principles from verified Indian unicorn journeys.',
    openingQuestion: 'Why did Zerodha grow to dominate Indian stockbroking without spending a single rupee on TV or celebrity ads?',
    studentAction: 'Analyze Zerodha, Nykaa, and Meesho scenarios, tackle the founder decision dilemma, and record 1 transferable lesson.',
    discussionPrompt: 'When does deep discounting help a business, and when does it guarantee bankruptcy?',
    expectedOutcome: 'Understanding the necessity of trust, authentic value, and positive unit contribution.',
    commonErrors: 'Believing that massive VC funding or heavy discounting replaces good product-market fit.',
    offlineFallback: 'Whiteboard a 3-column table comparing Zerodha, Nykaa, and Meesho customer value propositions.'
  },
  {
    stage: 3,
    title: 'Find Your Business Opportunity',
    suggestedMinutes: 10,
    objective: 'Structure the chosen problem into a viable commercial opportunity.',
    openingQuestion: 'If you could ask prospective customers only three questions, what would you ask without leading them to a fake YES?',
    studentAction: 'Answer the 5 core opportunity questions and select 3 non-leading customer interview questions.',
    discussionPrompt: 'Why do friends always say your idea is amazing, and why is that feedback dangerous?',
    expectedOutcome: 'Clear customer definition, core friction statement, and an unbiased validation plan.',
    commonErrors: 'Asking leading questions like "Would you buy this cool app?" instead of uncovering past behavior.',
    offlineFallback: 'Pair roleplay: Student A interviews Student B as a potential customer for 3 minutes.'
  },
  {
    stage: 4,
    title: 'Build Your Startup',
    suggestedMinutes: 12,
    objective: 'Assemble the 8-block Startup Launch Canvas and resolve a practical pricing trade-off.',
    openingQuestion: 'Your first customer demands a 30% discount. What are the three ways to respond without losing money?',
    studentAction: 'Review auto-populated launch canvas blocks, make the pricing trade-off choice, and justify unit margins.',
    discussionPrompt: 'What is the long-term danger of discounting your initial orders below delivery cost?',
    expectedOutcome: 'Completed 8-block Startup Launch Canvas with a defensible pricing strategy.',
    commonErrors: 'Feature bloat (trying to build 10 features in Version 1) and margin-eroding discounts.',
    offlineFallback: 'Students sketch the 8 canvas blocks on a blank sheet and annotate costs vs. revenue.'
  },
  {
    stage: 5,
    title: 'Run the Business (Vayentra Labs Case)',
    suggestedMinutes: 14,
    objective: 'Master the fundamental corporate separation between accounting profit and real cash liquidity.',
    openingQuestion: 'Vayentra Labs reported ₹25,000 in net profit for September. Why can’t the manager write a ₹15,000 cheque today?',
    studentAction: 'Predict spendability, calculate Profit (₹25k), Net Cash (−₹10k), Closing Bank (₹10k), Shortfall (₹10k), map handoffs, and recommend action.',
    discussionPrompt: 'Where is the missing ₹40,000? What happens if the delivery evidence note was never signed by the client?',
    expectedOutcome: 'Flawless calculation of the 5 case metrics and defensible cash-protective management advice.',
    commonErrors: 'Confusing earned revenue (₹1,00,000) with cash collected (₹60,000) or ignoring the ₹5,000 reserve.',
    offlineFallback: 'Step-by-step T-account / cashflow waterfall walkthrough on the classroom blackboard.'
  },
  {
    stage: 6,
    title: 'Pitch Your Business',
    suggestedMinutes: 8,
    objective: 'Deliver an executive summary of the venture and practice peer feedback.',
    openingQuestion: 'Can you explain the problem, your solution, and how you make money in under 60 seconds?',
    studentAction: 'Review auto-generated 8-slide pitch deck, edit key assumptions, conduct peer feedback, and write self-reflection.',
    discussionPrompt: 'What is the single most uncertain assumption in your venture model today?',
    expectedOutcome: 'Saved 8-slide presentation draft and honest reflection on what decision to change.',
    commonErrors: 'Reading slide bullet points verbatim instead of explaining the core business logic.',
    offlineFallback: '1-minute elevator pitch delivered standing to a squad partner.'
  }
];

export const STARTUP_STORAGE_KEY = 'vcep:s01:edition-3.1:startup-lab';

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface StageMetadata {
  number: StageNumber;
  title: string;
  eyebrow: string;
  subtitle: string;
  keyDeliverable: string;
}

export const S01_STAGES: StageMetadata[] = [
  {
    number: 1,
    title: 'Discover the Founder Mindset',
    eyebrow: 'STAGE 1 · FOUNDER FOUNDATIONS',
    subtitle: 'Look around you. Every service, product, and app exists because somebody identified a problem worth solving.',
    keyDeliverable: 'One-Sentence Opportunity Brief'
  },
  {
    number: 2,
    title: 'Inside Real Startups',
    eyebrow: 'STAGE 2 · REAL INDIAN VENTURES',
    subtitle: 'Analyze how Zerodha, Nykaa, and Meesho created trust, unit economics, and repeat demand.',
    keyDeliverable: 'Startup Model Insights & Rationale'
  },
  {
    number: 3,
    title: 'Find Your Business Opportunity',
    eyebrow: 'STAGE 3 · VENTURE SELECTION',
    subtitle: 'Choose a realistic collegiate or local consumer problem and craft your opportunity brief.',
    keyDeliverable: 'Startup Opportunity Brief'
  },
  {
    number: 4,
    title: 'Build Your Startup',
    eyebrow: 'STAGE 4 · INTERACTIVE FOUNDER LAB',
    subtitle: 'Make 5 connected founder decisions to structure, scope, and deliver your new venture.',
    keyDeliverable: 'Startup Launch Canvas'
  },
  {
    number: 5,
    title: 'Run the Business',
    eyebrow: 'STAGE 5 · STARTUP BOARDROOM',
    subtitle: 'Assume an executive role and navigate a high-stakes operational crisis under time pressure.',
    keyDeliverable: 'Boardroom Decision Record'
  },
  {
    number: 6,
    title: 'Create Your Investor Pitch Deck',
    eyebrow: 'STAGE 6 · EXECUTIVE PRESENTATION',
    subtitle: 'Synthesize your venture into an 8-slide investor pitch deck ready for classroom defence.',
    keyDeliverable: 'In-Platform Investor Pitch Deck (8 Slides)'
  }
];

export interface CollegeProblemOption {
  id: string;
  category: string;
  title: string;
  description: string;
  friction: string;
  opportunityHint: string;
}

export const COLLEGE_PROBLEM_OPTIONS: CollegeProblemOption[] = [
  {
    id: 'prob-laundry',
    category: 'Hostel Operations',
    title: 'Affordable Student Laundry',
    description: 'Hostel students spend 4 hours hand-washing clothes or wait 6 days for local dhobis who fade fabric and mix up garments.',
    friction: 'Hostel rooms lack drying space; students frequently run out of clean clothes before seminars and job interviews.',
    opportunityHint: 'Standardized 24-hour wash, tumble-dry, and fold canvas bag pickup service priced transparently by weight.'
  },
  {
    id: 'prob-food',
    category: 'Food & Daily Living',
    title: 'Better Food Options Near Colleges',
    description: 'Hostellers face oily, unpalatable mess food, while food delivery apps cost ₹300+ per meal with steep delivery charges and take 45 minutes.',
    friction: '45-minute lunch breaks leave students hungry, eating junk, or missing the first 10 minutes of afternoon lectures.',
    opportunityHint: 'Pre-ordered homestyle meal subscriptions delivered directly to campus gates at 1:15 PM sharp for under ₹90.'
  },
  {
    id: 'prob-inventory',
    category: 'Small Retail Operations',
    title: 'Inventory Management for Small Shops',
    description: 'Corner kirana shops and independent retail stores run out of fast-moving daily items or overstock slow inventory using paper notebooks.',
    friction: 'Lost daily sales when popular products run dry, and wasted working capital locked in expired slow-moving stock.',
    opportunityHint: 'Simple WhatsApp-based daily inventory reorder alerts and fast stock counting for neighborhood shops.'
  },
  {
    id: 'prob-support',
    category: 'Local Commerce',
    title: 'Digital Customer Support for Local Businesses',
    description: 'Neighborhood clinics, repair shops, and coaching centers miss customer inquiries after hours because they cannot staff full-time support desks.',
    friction: 'Frustrated customers switch to larger corporate chains when local businesses fail to reply promptly.',
    opportunityHint: 'Turnkey WhatsApp automated inquiry responder and booking manager tailored for neighborhood businesses.'
  }
];

export interface OpportunityQuestionConfig {
  id: 'q1-who' | 'q2-what' | 'q3-why' | 'q4-how';
  number: string;
  question: string;
  prompt: string;
  example: string;
  chips: string[];
  whyMatters: string;
}

export const OPPORTUNITY_QUESTIONS: OpportunityQuestionConfig[] = [
  {
    id: 'q1-who',
    number: '01',
    question: 'Who has the problem?',
    prompt: 'Identify the exact customer group experiencing this daily friction.',
    example: 'e.g., 1st & 2nd year undergraduates living in campus hostels/PGs without kitchen or laundry access.',
    chips: [
      'Hostel students & PG residents without kitchen/laundry access',
      'Local kirana and independent retail shopkeepers',
      'Neighborhood clinics, tutors & service providers',
      'College club organizers & sports team leads'
    ],
    whyMatters: 'If you try to serve everybody on day one, you build for nobody. A narrow beachhead customer segment gives you a focused group of people you can personally interview, observe, and delight.'
  },
  {
    id: 'q2-what',
    number: '02',
    question: 'What problem will you solve?',
    prompt: 'Describe the specific pain, delay, or frustration your business eliminates.',
    example: 'e.g., Eliminate 45-minute lunch friction with scheduled, healthy ₹90 homestyle meal deliveries.',
    chips: [
      'Eliminate 45-min lunch break delay with ₹90 gate delivery',
      'Prevent laundry fabric damage with 24-hr wash-and-fold service',
      'Stop daily stockouts with simple WhatsApp inventory alerts',
      'Prevent lost customers with 24/7 automated inquiry responses'
    ],
    whyMatters: 'A business exists to solve a real human inconvenience. Customers don’t buy products; they buy a solution to a problem they want gone.'
  },
  {
    id: 'q3-why',
    number: '03',
    question: 'Why would customers choose or pay for your solution?',
    prompt: 'What makes your offer better, faster, or more reliable than their existing alternatives?',
    example: 'e.g., Half the cost of food delivery apps, zero delivery surcharges, and guaranteed delivery before 1:15 PM.',
    chips: [
      'Guaranteed punctuality at half the cost of commercial apps',
      'Individual barcode laundry bags ensure zero lost garments',
      'Operates 100% inside WhatsApp with zero software training needed',
      'Instant replies within 30 seconds with automated appointment booking'
    ],
    whyMatters: 'Your value proposition explains why someone will pull money out of their pocket for your solution instead of sticking with free alternatives or old habits.'
  },
  {
    id: 'q4-how',
    number: '04',
    question: 'How will you reach your first customers?',
    prompt: 'What grassroots founder hustle will secure your first 10 paying customers?',
    example: 'e.g., In-person sample tasting outside hostel gates and word-of-mouth WhatsApp community groups.',
    chips: [
      'In-person sample tasting & table setup outside hostel gates',
      'Direct walk-ins & 10-minute demonstrations for 15 local shopkeepers',
      'Word-of-mouth referral cards with 10% off for roommates',
      'Free 3-day trial for the first 5 neighborhood businesses'
    ],
    whyMatters: 'Real founders don’t burn money on expensive city-wide digital ads before launch. They personally visit early customers, earn trust, and iterate based on direct feedback.'
  }
];

export interface SlideField {
  key: string;
  label: string;
  value: string;
  placeholder: string;
  isTextArea?: boolean;
  isAssumption?: boolean;
}

export interface PitchSlide {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  fields: SlideField[];
  speakerNotes: string;
}

export interface StartupLabState {
  version: '3.1';
  currentStage: StageNumber;
  // Stage 1
  stage1: {
    selectedProblemId: string;
    targetCampusPersona: string;
    opportunityStatement: string; // One-sentence business opportunity
    whyItMatters: string;
    validationApproach?: string;
  };
  // Stage 2
  storyDecisions: Record<string, string>; // { zerodha, nykaa, meesho }
  storyInspiration: {
    chosenModel: 'zerodha' | 'nykaa' | 'meesho' | '';
    inspirationReason: string;
  };
  // Stage 3
  selectedCaseId: string; // 'quickbite' | 'campusmerch' | 'cleanwash' | 'digitlocal'
  opportunityBrief: {
    customerProblem: string;
    targetPersona: string;
    existingAlternatives: string;
    whyItMatters: string;
    validationEvidence: string;
  };
  selectedInterviewQuestions?: string[]; // Stage 3 customer interview validation questions
  // Stage 4
  decisions: {
    decisionA?: string;
    decisionB?: string;
    decisionC?: string;
    decisionD?: string;
    decisionE?: string;
  };
  pricingTradeOff?: {
    choice: string;
    rationale: string;
  };
  // Stage 5: Approved Vayentra Labs Case & Process Handoffs
  vlab?: {
    prediction: 'yes' | 'no' | 'not-sure' | '';
    calcProfit: string;
    calcNetCash: string;
    calcClosingBank: string;
    calcAvailableAboveReserve: string;
    calcPaymentShortfall: string;
    calcAttempted: boolean;
    processOrder: string[];
    processOwners: Record<string, string>;
    paymentRecommendation: string;
    paymentRationale: string;
  };
  boardroom: {
    roleId?: string;
    crisisChoice?: string;
    crisisRationale?: string;
    consequencesAnalysis?: string;
    assignedOwner?: string;
    recoveryPlan?: string;
    pitchProblem?: string;
    pitchSolution?: string;
    pitchTarget?: string;
    pitchMoat?: string;
    pitchAsk?: string;
  };
  // Stage 6
  pitchDeck: {
    slides: PitchSlide[];
    activeSlideIndex: number;
    lastSaved?: string;
  };
  peerFeedback?: {
    problemClear: boolean | null;
    solutionBelievable: boolean | null;
    businessModelClear: boolean | null;
    tradeoffExplained: boolean | null;
  };
  reflectionChange?: string;
  unitPrice?: number;
  unitCost?: number;
  expectedMonthlyUnits?: number;
  cashDecision?: 'yes' | 'no' | '';
  cashRationale?: string;
  firstStepAction?: string;
  lastSaved?: string;
}

export function buildDefaultPitchDeck(caseObj: VentureCase, decisions: StartupLabState['decisions'], s1: StartupLabState['stage1'], s5: StartupLabState['boardroom']): PitchSlide[] {
  const getDec = (step: 'decisionA' | 'decisionB' | 'decisionC' | 'decisionD' | 'decisionE') => {
    const id = decisions[step];
    if (!id) return '';
    return caseObj.decisions[step].options.find(o => o.id === id)?.text || '';
  };

  const probText = getDec('decisionA') || s1.opportunityStatement || caseObj.inconvenience;
  const personaText = getDec('decisionB') || s1.targetCampusPersona || caseObj.persona;
  const mvpText = getDec('decisionC') || caseObj.expectations;
  const first10Text = getDec('decisionD') || 'Host grassroots taste-test / physical demonstration with 100% money-back satisfaction guarantee.';
  const deliveryText = getDec('decisionE') || 'Standardized batch delivery with 2 dedicated campus runners, buffer stock, and active WhatsApp tracking.';
  const crisisStrat = CRISIS_SCENARIO.options.find(o => o.id === s5.crisisChoice)?.title || 'Strategy A: Proactive Transparency & Founder Fulfilment';
  const roleObj = BOARDROOM_ROLES.find(r => r.id === s5.roleId) || BOARDROOM_ROLES[0];

  return [
    {
      id: 1,
      number: '01',
      title: 'Startup Name and Vision',
      subtitle: 'Startup Name, Tagline & Business Idea',
      fields: [
        { key: 'name', label: 'Venture Name', value: caseObj.name, placeholder: 'e.g. QuickBite Fresh' },
        { key: 'tagline', label: 'Tagline & Core Promise', value: caseObj.tag, placeholder: 'e.g. Hot homestyle food delivered at 1:15 PM sharp.' },
        { key: 'concept', label: 'One-Sentence Pitch', value: `${caseObj.name} provides ${caseObj.tag.toLowerCase()} for ${personaText.slice(0, 80)}.`, placeholder: 'What does your venture do in one simple sentence?', isTextArea: true }
      ],
      speakerNotes: `Introduce the venture with confidence. Clearly connect the brand name to the immediate customer promise.`
    },
    {
      id: 2,
      number: '02',
      title: 'The Customer Problem',
      subtitle: 'Customer Pain Point & Real Evidence',
      fields: [
        { key: 'problem', label: 'Core Customer Friction', value: probText, placeholder: 'What acute inconvenience do customers face daily?', isTextArea: true },
        { key: 'evidence', label: 'Field Evidence & Data Point', value: caseObj.inconvenience, placeholder: 'What verifiable evidence shows this problem exists today?', isTextArea: true, isAssumption: true },
        { key: 'costOfInaction', label: 'Cost of Doing Nothing', value: 'Students waste money and time on unpalatable food, disrupting their daily academic routine.', placeholder: 'Why can customers no longer tolerate the current alternative?', isTextArea: true }
      ],
      speakerNotes: `Frame the problem from the customer's direct perspective. Focus on time lost, money wasted, and daily emotional friction.`
    },
    {
      id: 3,
      number: '03',
      title: 'Our Solution',
      subtitle: 'Product/Service Scope & Value Proposition',
      fields: [
        { key: 'solution', label: 'Minimum Viable Product / Service (MVP)', value: mvpText, placeholder: 'What is the simplest useful solution you will offer?', isTextArea: true },
        { key: 'valueProp', label: 'Primary Value Proposition', value: caseObj.expectations, placeholder: 'Why do customers choose you over alternatives?', isTextArea: true },
        { key: 'scopeConstraint', label: 'Disciplined Boundary (What We Do NOT Do)', value: 'We do not build bloated mobile apps or 50-dish custom menus until our core offering operates with positive unit economics.', placeholder: 'What feature traps are you actively avoiding in Version 1.0?', isTextArea: true }
      ],
      speakerNotes: `Explain how doing ONE simple thing reliably outperforms over-engineered solutions.`
    },
    {
      id: 4,
      number: '04',
      title: 'Target Customers',
      subtitle: 'Beachhead Audience & Immediate Needs',
      fields: [
        { key: 'beachhead', label: 'Beachhead Customer Persona', value: personaText, placeholder: 'Who is the exact initial group of paying customers?', isTextArea: true },
        { key: 'reachability', label: 'Physical Accessibility', value: 'Geographically concentrated within 500m of campus, reachable in person within 15 minutes.', placeholder: 'How easily can your team interview and serve these first users?', isTextArea: true },
        { key: 'customerNeed', label: 'Non-Negotiable Customer Expectation', value: 'Guaranteed punctuality, hygienic preparation, and honest pricing.', placeholder: 'What must you get 100% right on day one?', isTextArea: true }
      ],
      speakerNotes: `Prove that you know your first 50 customers by name, location, and daily schedule.`
    },
    {
      id: 5,
      number: '05',
      title: 'Business Model',
      subtitle: 'Revenue Mechanics & Unit Sustainability',
      fields: [
        { key: 'earningModel', label: 'Earning Model & Pricing', value: 'Direct customer subscription / transaction with transparent upfront pricing and zero hidden fees.', placeholder: 'How does cash flow into the business?', isTextArea: true },
        { key: 'unitEconomics', label: 'Unit Economics (Revenue vs Direct Costs)', value: 'Every delivered unit generates positive contribution margin after raw materials and runner fees; no subsidized cash-burn.', placeholder: 'How do you ensure each order makes economic sense?', isTextArea: true, isAssumption: true },
        { key: 'lessonApplied', label: 'Startup Principle Applied', value: 'Learned from Zerodha and Meesho: Prioritize positive unit contribution and word-of-mouth trust over reckless advertising spend.', placeholder: 'Which real startup model informs your financial discipline?', isTextArea: true }
      ],
      speakerNotes: `Differentiate transaction volume from true unit sustainability. Show that every order covers its direct delivery costs.`
    },
    {
      id: 6,
      number: '06',
      title: 'Customer Acquisition Plan',
      subtitle: 'Acquiring the First 10 Paying Customers',
      fields: [
        { key: 'first10Plan', label: 'First 10 Customers Acquisition Strategy', value: first10Text, placeholder: 'What specific founder hustle secures your first 10 paying customers?', isTextArea: true },
        { key: 'referralLoop', label: 'Word-of-Mouth Referral Trigger', value: 'Delighted early adopters receive a shareable 10% discount card for roommates when they renew their weekly pass.', placeholder: 'How will happy first users bring in customers 11 through 50?', isTextArea: true },
        { key: 'marketingBudget', label: 'Customer Acquisition Budget', value: '₹0 paid advertising. 100% grassroots personal tasting, word-of-mouth, and campus community engagement.', placeholder: 'How much are you spending to acquire initial users?', isTextArea: true }
      ],
      speakerNotes: `Investors love founders who talk directly to customers rather than burning money on social media ads.`
    },
    {
      id: 7,
      number: '07',
      title: 'Operations and Key Risks',
      subtitle: 'Delivery Fulfilment, Governance & Contingency',
      fields: [
        { key: 'deliveryProcess', label: 'Standard Delivery & Fulfilment Workflow', value: deliveryText, placeholder: 'How does an order travel from supplier to customer hands reliably?', isTextArea: true },
        { key: 'teamRoles', label: 'Executive Accountability', value: `Team governed by dedicated functional roles (${roleObj.title} leading). Every order has an explicit operational owner.`, placeholder: 'Who is accountable for service delivery and quality checks?', isTextArea: true },
        { key: 'crisisPlan', label: 'Contingency Response for Operational Disruption', value: `${crisisStrat}. In the event of partner failure, founders step in with proactive customer transparency and immediate remedies.`, placeholder: 'How will your team handle an unexpected breakdown or delay?', isTextArea: true }
      ],
      speakerNotes: `Highlight operational resilience. Outline how your team prevents failures and remediates mistakes before customers complain.`
    },
    {
      id: 8,
      number: '08',
      title: 'Ask and Next Steps',
      subtitle: 'Immediate Validation Experiment & Support Required',
      fields: [
        { key: 'nextExperiment', label: 'Immediate Next Experiment (7-Day Milestone)', value: 'Conduct 15 in-person interviews with campus hostel students and run a 1-day pilot with 10 pre-orders to validate pricing willingness.', placeholder: 'What will you test in the next 7 days to prove your assumptions?', isTextArea: true },
        { key: 'resourceAsk', label: 'Our Ask from Mentors / Institution', value: 'Permission to set up an authorized sampling table outside the student cafeteria, plus feedback on supplier agreement terms.', placeholder: 'What specific faculty, mentor, or space support do you need?', isTextArea: true },
        { key: 'validationGoal', label: '30-Day Validation Milestone', value: 'Achieve 20 consecutive prepaid weekly subscriptions with a >80% renewal rate and zero unaddressed late complaints.', placeholder: 'What verifiable metric marks proof of concept after 30 days?', isTextArea: true, isAssumption: true }
      ],
      speakerNotes: `End with an actionable ask. Frame the pitch not as a finished enterprise, but as a disciplined, testable hypothesis.`
    }
  ];
}

export function loadStartupLabState(): StartupLabState {
  const defaultCase = VENTURE_CASES[0];
  const defaultBoardroom = {
    roleId: 'role-strategy',
    crisisChoice: 'strat-a',
    crisisRationale: 'Founders personally delivering priority orders protects customer trust immediately. An honest phone call with a discount voucher turns an operational vendor breakdown into a loyalty-building moment.',
    consequencesAnalysis: 'Immediate founder hustle costs zero additional cash while preserving the brand reputation for the remaining 25 rescheduled orders.',
    assignedOwner: 'Founder & Strategy Lead together with Operations Lead',
    recoveryPlan: 'Secure an alternate standby runner fleet and conduct morning dispatch audits before 8:00 AM daily.',
    pitchProblem: '',
    pitchSolution: '',
    pitchTarget: '',
    pitchMoat: '',
    pitchAsk: ''
  };

  const defaultStage1 = {
    selectedProblemId: 'prob-food',
    targetCampusPersona: '1st & 2nd year undergraduates and tech interns living in campus hostels/PGs without kitchen access.',
    opportunityStatement: 'Deliver healthy, hot homestyle lunch boxes directly to campus hostel gates at 1:15 PM sharp for ₹90.',
    whyItMatters: 'Saves students 45 minutes of daily meal friction and provides nutritious food without expensive delivery surcharges.'
  };

  const defaultBrief = {
    customerProblem: defaultCase.inconvenience,
    targetPersona: defaultCase.persona,
    existingAlternatives: 'Expensive delivery apps (₹300/meal) or unpalatable PG mess food.',
    whyItMatters: 'Daily repeat necessity: students must eat every afternoon within a strict 45-minute timetable window.',
    validationEvidence: '15 preliminary interviews in Block A confirmed 12 out of 15 students skip lunch or order unhealthily at least 4 days a week.'
  };

  const defaultDecisions = {
    decisionA: 'qa1',
    decisionB: 'qb1',
    decisionC: 'qc1',
    decisionD: 'qd1',
    decisionE: 'qe1'
  };

  const defaultStoryDecisions = {
    zerodha: 'opt-transparency',
    nykaa: 'opt-authenticity',
    meesho: 'opt-unit-economics'
  };

  const defaultState: StartupLabState = {
    version: '3.1',
    currentStage: 1,
    stage1: defaultStage1,
    storyDecisions: defaultStoryDecisions,
    storyInspiration: {
      chosenModel: 'zerodha',
      inspirationReason: 'Zerodha proves that radical pricing transparency and customer education build sustainable word-of-mouth moats without burning venture capital.'
    },
    selectedCaseId: 'quickbite',
    opportunityBrief: defaultBrief,
    selectedInterviewQuestions: ['iq-past-behavior', 'iq-friction-depth', 'iq-workaround-cost'],
    decisions: defaultDecisions,
    pricingTradeOff: {
      choice: 'pt-scope',
      rationale: 'Keeping price per unit firm while reducing initial delivery scope protects unit economics and establishes fair value.'
    },
    vlab: {
      prediction: '',
      calcProfit: '',
      calcNetCash: '',
      calcClosingBank: '',
      calcAvailableAboveReserve: '',
      calcPaymentShortfall: '',
      calcAttempted: false,
      processOrder: ['enquiry', 'order', 'delivery', 'invoice', 'collection', 'receipt'],
      processOwners: {
        enquiry: 'Sales Lead',
        order: 'Sales Lead',
        delivery: 'Delivery Manager',
        invoice: 'Finance Officer',
        collection: 'Finance Officer',
        receipt: 'Finance Officer',
      },
      paymentRecommendation: 'reschedule',
      paymentRationale: 'Pay ₹5,000 from available cash above safety reserve; defer remaining ₹10,000 until client receivables are collected.',
    },
    boardroom: defaultBoardroom,
    pitchDeck: {
      slides: buildDefaultPitchDeck(defaultCase, defaultDecisions, defaultStage1, defaultBoardroom),
      activeSlideIndex: 0
    },
    peerFeedback: {
      problemClear: null,
      solutionBelievable: null,
      businessModelClear: null,
      tradeoffExplained: null,
    },
    reflectionChange: 'I would spend more time interviewing early adopters directly rather than relying on initial assumptions.',
    unitPrice: 90,
    unitCost: 55,
    expectedMonthlyUnits: 500,
    cashDecision: 'no',
    cashRationale: 'Closing bank balance is only ₹10,000, leaving just ₹5,000 free cash after reserving ₹5,000. Paying ₹15,000 creates a ₹10,000 deficit.',
    firstStepAction: 'Interview 5 students outside the hostel gate on Sunday to validate willingness to pay.',
  };

  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(STARTUP_STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    const activeCase = VENTURE_CASES.find(c => c.id === (parsed.selectedCaseId || 'quickbite')) || defaultCase;
    const mergedSlides = parsed.pitchDeck?.slides && parsed.pitchDeck.slides.length === 8
      ? parsed.pitchDeck.slides
      : buildDefaultPitchDeck(activeCase, parsed.decisions || defaultDecisions, parsed.stage1 || defaultStage1, parsed.boardroom || defaultBoardroom);

    return {
      ...defaultState,
      ...parsed,
      stage1: { ...defaultState.stage1, ...(parsed.stage1 || {}) },
      storyInspiration: { ...defaultState.storyInspiration, ...(parsed.storyInspiration || {}) },
      opportunityBrief: { ...defaultState.opportunityBrief, ...(parsed.opportunityBrief || {}) },
      vlab: { ...defaultState.vlab, ...(parsed.vlab || {}) },
      boardroom: { ...defaultState.boardroom, ...(parsed.boardroom || {}) },
      pitchDeck: {
        slides: mergedSlides,
        activeSlideIndex: parsed.pitchDeck?.activeSlideIndex || 0,
        lastSaved: parsed.pitchDeck?.lastSaved
      }
    };
  } catch {
    return defaultState;
  }
}

export function saveStartupLabState(state: StartupLabState): void {
  if (typeof window === 'undefined') return;
  try {
    state.lastSaved = new Date().toLocaleTimeString();
    localStorage.setItem(STARTUP_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}
