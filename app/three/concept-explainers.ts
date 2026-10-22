import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VCEP_3D_COLORS, disposeHierarchy, GraphicsTier } from './engine-utils';

export interface ConceptStage {
  name: string;
  shortDesc: string;
  details: string;
  metricLabel?: string;
  metricValue?: string;
}

export interface ConceptDefinition {
  id: string;
  title: string;
  category: string;
  objective: string;
  stages: ConceptStage[];
}

export const CONCEPT_DEFINITIONS: ConceptDefinition[] = [
  {
    id: 'supply-chain',
    title: '1. Supply Chain & Value Addition',
    category: 'Logistics & Operations',
    objective: 'Follow physical goods and costs from raw extraction to end consumer delivery.',
    stages: [
      { name: 'Raw Material', shortDesc: 'Source procurement', details: 'Direct material inputs acquired from verified suppliers at purchase cost.', metricLabel: 'Cost Base', metricValue: '₹100 / unit' },
      { name: 'Processing Factory', shortDesc: 'Primary manufacturing', details: 'Conversion of raw inputs into finished inventory; direct labour and overhead applied.', metricLabel: 'Value Added', metricValue: '+₹65 / unit' },
      { name: 'Central Warehouse', shortDesc: 'Inventory staging', details: 'Goods buffered under storage control; carrying costs, insurance, and batch tracking.', metricLabel: 'Holding Cost', metricValue: '+₹15 / unit' },
      { name: 'Logistics Fleet', shortDesc: 'Distribution transit', details: 'Freight transport, e-way bills, carrier SLAs, and route optimization.', metricLabel: 'Freight', metricValue: '+₹20 / unit' },
      { name: 'Retail Storefront', shortDesc: 'Commercial channel', details: 'Channel margin, shelf display, retail stocking, and Point-of-Sale promotion.', metricLabel: 'Channel Margin', metricValue: '+₹50 / unit' },
      { name: 'End Consumer', shortDesc: 'Fulfillment & consumption', details: 'Final customer purchase; warranty, customer satisfaction, and revenue recognition.', metricLabel: 'Retail Price', metricValue: '₹250 (Gross Margin: 20%)' },
    ],
  },
  {
    id: 'demand-supply',
    title: '2. Market Dynamics & Price Equilibrium',
    category: 'Economics & Pricing',
    objective: 'Explore how pricing shifts determine buyer willingness, seller supply, and market equilibrium.',
    stages: [
      { name: 'Price Floor / Low Price', shortDesc: 'High Demand, Supply Shortage', details: 'At low price points, consumer demand outstrips available production capacity, creating inventory depletion.', metricLabel: 'Market State', metricValue: 'Deficit / Shortage' },
      { name: 'Equilibrium Price', shortDesc: 'Clearing Market Balance', details: 'The price point where quantity demanded exactly equals quantity supplied. No persistent surplus or shortage.', metricLabel: 'Clearing Rate', metricValue: 'Optimal P* & Q*' },
      { name: 'Price Surge / High Price', shortDesc: 'Low Demand, Excess Inventory', details: 'At elevated prices, producers oversupply while buyers substitute, causing costly warehouse inventory accumulation.', metricLabel: 'Market State', metricValue: 'Surplus / Holding Drag' },
      { name: 'Elasticity Impact', shortDesc: 'Sensitivity to adjustments', details: 'How percentage changes in price impact total revenue depending on whether demand is elastic or inelastic.', metricLabel: 'Revenue Optima', metricValue: 'Marginal Rev = 0' },
    ],
  },
  {
    id: 'ecommerce-lifecycle',
    title: '3. E-Commerce Order Lifecycle',
    category: 'Digital Commerce',
    objective: 'Track an order packet from shopping cart checkout through payment, dispatch, and returns.',
    stages: [
      { name: 'Cart & Checkout', shortDesc: 'Customer order commitment', details: 'Customer converts shopping cart, selects delivery slot, and generates order token.', metricLabel: 'Step Duration', metricValue: '< 30 sec' },
      { name: 'Payment Gateway', shortDesc: 'Escrow & vault verification', details: '2-factor authorization, risk screening, 3D Secure protocol, and capture confirmation.', metricLabel: 'Auth Speed', metricValue: '1.2 sec (99.8% SLA)' },
      { name: 'Automated Pick & Pack', shortDesc: 'Fulfillment center execution', details: 'WMS barcode scanning, bubble packaging, shipping label generation, and batching.', metricLabel: 'Dispatch Time', metricValue: 'Under 2 hours' },
      { name: 'Carrier Hub Dispatch', shortDesc: 'Line-haul sorting', details: 'Automated sorting cross-docking, line-haul movement, and airway bill tracking.', metricLabel: 'Transit Window', metricValue: '24–48 hours' },
      { name: 'Last-Mile Delivery', shortDesc: 'Doorstep handoff', details: 'Courier rider app route, OTP verification, package handover, and POD upload.', metricLabel: 'Success Rate', metricValue: '98.5% First Attempt' },
      { name: 'Returns & Reverse Loop', shortDesc: 'Quality check & refund', details: 'RMA authorization, pickup, QC inspection, restocking to inventory, and instant refund.', metricLabel: 'Restock Window', metricValue: '3 days' },
    ],
  },
  {
    id: 'banking-payments',
    title: '4. Banking & UPI Digital Settlement',
    category: 'Banking & Fintech',
    objective: 'Understand real-time interbank transaction routing, clearing switches, and ledger settlement.',
    stages: [
      { name: 'Payer Account', shortDesc: 'Payment initiation & debit', details: 'Payer authenticates with MPIN/Biometrics; core banking debits account and creates hold.', metricLabel: 'CBS Debit', metricValue: 'Real-time' },
      { name: 'NPCI / UPI Switch', shortDesc: 'Central clearing router', details: 'National clearing switch resolves VPA/Account number, verifies bank endpoints, and routes message.', metricLabel: 'Switch Latency', metricValue: '85 ms' },
      { name: 'Fraud & Risk Check', shortDesc: 'Real-time velocity scoring', details: 'Machine learning rule engine checks device fingerprint, geo-location, and unusual transaction velocity.', metricLabel: 'Risk Score', metricValue: 'Clean (Pass)' },
      { name: 'Payee CBS Credit', shortDesc: 'Beneficiary credit & SMS', details: 'Payee bank credits beneficiary account, signs transaction receipt, and returns success code.', metricLabel: 'Settlement', metricValue: 'Immediate (IMPS/UPI)' },
    ],
  },
  {
    id: 'gst-invoice',
    title: '5. GST Invoice & Input Tax Credit (ITC)',
    category: 'Taxation & Compliance',
    objective: 'Map the triangular compliance flow between Supplier, Buyer, and the GSTN Government Portal.',
    stages: [
      { name: 'Supplier Invoice', shortDesc: 'B2B Invoice generation', details: 'Supplier issues GST invoice with HSN code, taxable value, and applicable CGST/SGST/IGST.', metricLabel: 'Invoice Base', metricValue: '₹1,00,000 + 18% GST' },
      { name: 'GSTR-1 Upload', shortDesc: 'Outward supplies disclosure', details: 'Supplier uploads invoice details to GST portal before deadline; assigns IRN & QR code.', metricLabel: 'Compliance', metricValue: 'Filing by 11th' },
      { name: 'GSTR-2B Auto-Draft', shortDesc: 'Buyer ITC entitlement', details: 'GSTN portal auto-populates buyer’s GSTR-2B ledger, making Input Tax Credit officially claimable.', metricLabel: 'ITC Eligible', metricValue: '₹18,000' },
      { name: 'Tax Netting Off', shortDesc: 'Output liability settlement', details: 'Buyer offsets outward tax liability using accumulated eligible ITC, paying only net cash tax.', metricLabel: 'Net Cash Outflow', metricValue: 'Output Tax - ITC' },
      { name: 'Mismatch Escalation', shortDesc: 'Audit reconciliation', details: 'Unmatched invoices flagged for supplier follow-up to prevent ITC forfeiture under Rule 37A.', metricLabel: 'Variance Check', metricValue: 'Zero Discrepancy' },
    ],
  },
  {
    id: 'warehouse-inventory',
    title: '6. Warehouse Inventory: FIFO vs LIFO',
    category: 'Inventory Management',
    objective: 'Examine multi-tier pallet racking, stock aging, and the financial impact of FIFO vs LIFO methods.',
    stages: [
      { name: 'Goods Receipt & Put-away', shortDesc: 'Barcode batch registration', details: 'New stock arrives, receives batch timestamp, and is positioned into designated rack bays.', metricLabel: 'Bay Address', metricValue: 'Rack A-04' },
      { name: 'FIFO Picking Order', shortDesc: 'First-In, First-Out', details: 'Oldest batch is picked first. Prevents inventory obsolescence and reflects current replacement costs.', metricLabel: 'COGS Basis', metricValue: 'Oldest Cost First' },
      { name: 'LIFO Picking Order', shortDesc: 'Last-In, First-Out', details: 'Newest batch is picked first. Often matches current high inflation costs against current revenues.', metricLabel: 'COGS Basis', metricValue: 'Newest Cost First' },
      { name: 'Safety Stock Threshold', shortDesc: 'Buffer stock protection', details: 'Minimum floor inventory maintained to prevent stock-outs during unexpected supplier lead-time spikes.', metricLabel: 'Buffer Level', metricValue: '250 units' },
      { name: 'Reorder Point Trigger', shortDesc: 'Automated PO generation', details: 'When inventory hits Lead Time Demand + Safety Stock, an automated replenishment purchase order triggers.', metricLabel: 'Trigger Point', metricValue: '400 units' },
    ],
  },
];

export interface ExplainerHandle {
  setStep: (stepIndex: number) => void;
  destroy: () => void;
}

/**
 * 3D-03: Six Interactive Case-Study Concept Explainers
 */
export function initConceptExplainer(
  container: HTMLElement,
  conceptId: string,
  onStepChange?: (index: number) => void,
  tier: GraphicsTier = 'Full'
): ExplainerHandle {
  const isLight = tier === 'Light';
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 380;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1e27);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.2, 100);
  camera.position.set(9, 7.5, 11);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isLight,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLight ? 1 : 1.75));
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxDistance = 25;
  controls.minDistance = 4;
  controls.target.set(0, 1.2, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xdcf3f8, 1.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffedd5, 2.5);
  keyLight.position.set(8, 14, 8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
  rimLight.position.set(-8, 6, -8);
  scene.add(rimLight);

  const root = new THREE.Group();
  scene.add(root);

  // Base platform
  const basePlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(7, 7.4, 0.6, 24),
    new THREE.MeshStandardMaterial({ color: 0x143743, roughness: 0.85 })
  );
  basePlinth.position.y = -0.3;
  root.add(basePlinth);

  // Decorative golden ring
  const goldRing = new THREE.Mesh(
    new THREE.TorusGeometry(7.1, 0.08, 8, 32),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8 })
  );
  goldRing.rotateX(Math.PI / 2);
  goldRing.position.y = 0.01;
  root.add(goldRing);

  // Concept-specific objects
  const stageNodes: THREE.Mesh[] = [];
  let dynamicParticle: THREE.Mesh | null = null;
  let currentStep = 0;

  // Build the 3D scene based on the concept ID
  if (conceptId === 'supply-chain') {
    // 6 stations in a curve
    const nodeCoords = [
      [-4.5, 0.4, -2.5],
      [-2.8, 0.6, -0.8],
      [-0.8, 0.8, 0.6],
      [1.2, 0.6, 1.6],
      [3.0, 0.7, 0.0],
      [4.5, 0.5, -2.0],
    ];

    // Pathway tube
    const curvePoints = nodeCoords.map((c) => new THREE.Vector3(c[0], c[1] + 0.1, c[2]));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x225566, metalness: 0.5 });
    root.add(new THREE.Mesh(tubeGeo, tubeMat));

    // Station Nodes
    nodeCoords.forEach((c, idx) => {
      const geo = idx % 2 === 0 ? new THREE.BoxGeometry(0.8, 0.8, 0.8) : new THREE.CylinderGeometry(0.45, 0.45, 0.9, 12);
      const mat = new THREE.MeshStandardMaterial({ color: 0x1d586d, roughness: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(c[0], c[1] + 0.4, c[2]);
      root.add(mesh);
      stageNodes.push(mesh);
    });

    // Moving cargo crate packet
    const packetGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const packetMat = new THREE.MeshStandardMaterial({ color: 0xf5d061, metalness: 0.8 });
    dynamicParticle = new THREE.Mesh(packetGeo, packetMat);
    dynamicParticle.position.copy(curvePoints[0]);
    root.add(dynamicParticle);

  } else if (conceptId === 'demand-supply') {
    // 3D Demand & Supply Curves on a coordinate grid
    const axisGeo = new THREE.BoxGeometry(7, 0.08, 0.08);
    const axisMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const xAxis = new THREE.Mesh(axisGeo, axisMat);
    xAxis.position.set(0, 0.1, 0);
    root.add(xAxis);

    // Demand Curve (Red/Amber downward curve)
    const demandPoints = [
      new THREE.Vector3(-3, 3.8, -1.5),
      new THREE.Vector3(-1, 2.5, -0.5),
      new THREE.Vector3(0, 1.8, 0), // Equilibrium
      new THREE.Vector3(1.5, 1.1, 0.8),
      new THREE.Vector3(3, 0.4, 1.5),
    ];
    const demandCurve = new THREE.CatmullRomCurve3(demandPoints);
    const demandMesh = new THREE.Mesh(
      new THREE.TubeGeometry(demandCurve, 24, 0.1, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xef4444 })
    );
    root.add(demandMesh);

    // Supply Curve (Emerald upward curve)
    const supplyPoints = [
      new THREE.Vector3(-3, 0.4, 1.5),
      new THREE.Vector3(-1.5, 1.1, 0.8),
      new THREE.Vector3(0, 1.8, 0), // Equilibrium
      new THREE.Vector3(1.5, 2.6, -0.5),
      new THREE.Vector3(3, 3.8, -1.5),
    ];
    const supplyCurve = new THREE.CatmullRomCurve3(supplyPoints);
    const supplyMesh = new THREE.Mesh(
      new THREE.TubeGeometry(supplyCurve, 24, 0.1, 8, false),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    root.add(supplyMesh);

    // Glowing Equilibrium Golden Sphere
    const eqGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const eqMat = new THREE.MeshStandardMaterial({ color: 0xf5d061, metalness: 0.9, roughness: 0.1 });
    const eqSphere = new THREE.Mesh(eqGeo, eqMat);
    eqSphere.position.set(0, 1.8, 0);
    root.add(eqSphere);
    stageNodes.push(eqSphere);

    // Floating market tokens
    for (let i = 0; i < 6; i++) {
      const buyer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.08, 12),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8 })
      );
      buyer.position.set(-2.5 + i * 0.4, 0.2, -1.8 + (i % 2) * 0.6);
      root.add(buyer);
    }

  } else if (conceptId === 'ecommerce-lifecycle') {
    // Oval conveyor loop with 6 stations
    const loopPoints = [
      new THREE.Vector3(-3.5, 0.5, 0),
      new THREE.Vector3(-2.2, 0.5, 2.2),
      new THREE.Vector3(0, 0.5, 2.8),
      new THREE.Vector3(2.5, 0.5, 1.8),
      new THREE.Vector3(3.5, 0.5, -0.5),
      new THREE.Vector3(1.5, 0.5, -2.5),
      new THREE.Vector3(-1.8, 0.5, -2.2),
    ];
    const loopCurve = new THREE.CatmullRomCurve3(loopPoints, true);
    const trackMesh = new THREE.Mesh(
      new THREE.TubeGeometry(loopCurve, 40, 0.08, 8, true),
      new THREE.MeshStandardMaterial({ color: 0x335566 })
    );
    root.add(trackMesh);

    loopPoints.slice(0, 6).forEach((pt) => {
      const station = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.8, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x184252, roughness: 0.4 })
      );
      station.position.set(pt.x, 0.4, pt.z);
      root.add(station);
      stageNodes.push(station);
    });

    // Delivery Van Token
    const van = new THREE.Group();
    const vanBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.45, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xf5d061 })
    );
    van.add(vanBody);
    dynamicParticle = van as any;
    root.add(van);

  } else if (conceptId === 'banking-payments') {
    // 4 Bank Hubs (Payer, NPCI Switch, Risk, Payee)
    const bankCoords = [
      [-3.5, 0.8, 0],
      [-1.0, 1.5, -1.5],
      [1.0, 1.5, 1.5],
      [3.5, 0.8, 0],
    ];

    bankCoords.forEach((c) => {
      const bTower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.75, 1.6, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e4f60, metalness: 0.3 })
      );
      bTower.position.set(c[0], c[1], c[2]);
      root.add(bTower);
      stageNodes.push(bTower);
    });

    // Connecting wires
    for (let i = 0; i < bankCoords.length - 1; i++) {
      const p1 = new THREE.Vector3(bankCoords[i][0], bankCoords[i][1], bankCoords[i][2]);
      const p2 = new THREE.Vector3(bankCoords[i + 1][0], bankCoords[i + 1][1], bankCoords[i + 1][2]);
      const dist = p1.distanceTo(p2);
      const wire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, dist, 8),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      wire.position.copy(p1).lerp(p2, 0.5);
      wire.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      root.add(wire);
    }

    // Glowing payment transaction token
    const tokenMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.25, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf3cf65, metalness: 0.9 })
    );
    dynamicParticle = tokenMesh;
    tokenMesh.position.set(-3.5, 1.8, 0);
    root.add(tokenMesh);

  } else if (conceptId === 'gst-invoice') {
    // Triangular arrangement: Supplier (A), Government Portal (B), Buyer (C)
    const triNodes = [
      [-3.2, 0.8, 2.0],  // Supplier
      [0.0, 1.6, -2.8],  // GSTN Portal
      [3.2, 0.8, 2.0],   // Buyer
    ];

    triNodes.forEach((c) => {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.6, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x1a4554, roughness: 0.4 })
      );
      pillar.position.set(c[0], c[1], c[2]);
      root.add(pillar);
      stageNodes.push(pillar);
    });

    // Triangular laser beams
    for (let i = 0; i < 3; i++) {
      const p1 = new THREE.Vector3(triNodes[i][0], triNodes[i][1] + 0.8, triNodes[i][2]);
      const p2 = new THREE.Vector3(triNodes[(i + 1) % 3][0], triNodes[(i + 1) % 3][1] + 0.8, triNodes[(i + 1) % 3][2]);
      const dist = p1.distanceTo(p2);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, dist, 8),
        new THREE.MeshBasicMaterial({ color: 0xd4af37 })
      );
      beam.position.copy(p1).lerp(p2, 0.5);
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
      root.add(beam);
    }

    // ITC Tax token
    const itcToken = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.8 })
    );
    itcToken.rotateX(Math.PI / 2);
    dynamicParticle = itcToken;
    root.add(itcToken);

  } else {
    // Warehouse inventory with 3-tier racking
    const rackFrameMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const rack = new THREE.Group();

    // Uprights
    for (let x = -2.5; x <= 2.5; x += 2.5) {
      for (let z = -1; z <= 1; z += 2) {
        const upright = new THREE.Mesh(new THREE.BoxGeometry(0.12, 3.2, 0.12), rackFrameMat);
        upright.position.set(x, 1.6, z);
        rack.add(upright);
      }
    }
    // Shelf beams (3 levels)
    for (let y = 0.8; y <= 2.6; y += 0.9) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.08, 2.1), rackFrameMat);
      shelf.position.set(0, y, 0);
      rack.add(shelf);

      // Pallets on shelf
      for (let bx = -1.8; bx <= 1.8; bx += 1.8) {
        const pallet = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.6, 1.2),
          new THREE.MeshStandardMaterial({
            color: y < 1.5 ? 0x059669 : y < 2.0 ? 0xd97706 : 0x0284c7,
            roughness: 0.5,
          })
        );
        pallet.position.set(bx, y + 0.34, 0);
        rack.add(pallet);
        stageNodes.push(pallet);
      }
    }
    rack.position.set(0, 0, 0);
    root.add(rack);
  }

  // Active step highlighter
  const setStep = (stepIdx: number) => {
    currentStep = stepIdx;
    // Highlight target node
    stageNodes.forEach((node, idx) => {
      if (node.material instanceof THREE.MeshStandardMaterial) {
        if (idx === stepIdx % stageNodes.length) {
          node.material.color.setHex(0xf3cf65); // Active Gold
        } else {
          node.material.color.setHex(0x1d586d); // Normal Teal
        }
      }
    });

    if (onStepChange) {
      onStepChange(stepIdx);
    }
  };

  setStep(0);

  // Animation Loop
  let animationFrameId = 0;
  let isRunning = true;
  let isInteracting = false;
  controls.addEventListener('start', () => { isInteracting = true; });
  controls.addEventListener('end', () => { isInteracting = false; });
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isRunning) return;
    const elapsed = clock.getElapsedTime();

    // Gentle camera rotation if idle
    if (!isInteracting) {
      root.rotation.y += 0.002;
    }

    // Dynamic particle floating along nodes
    if (dynamicParticle && stageNodes.length > 0) {
      const targetNode = stageNodes[currentStep % stageNodes.length];
      if (targetNode) {
        dynamicParticle.position.lerp(
          new THREE.Vector3(targetNode.position.x, targetNode.position.y + 0.8, targetNode.position.z),
          0.05
        );
        dynamicParticle.position.y += Math.sin(elapsed * 4) * 0.02;
        dynamicParticle.rotation.y += 0.03;
      }
    }

    controls.update();
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();

  // Resize Observer
  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 380;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return {
    setStep,
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
