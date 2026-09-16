import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { 
  GitPullRequest, ShoppingCart, Settings, ShieldCheck, 
  ClipboardCheck, CheckCircle2, ChevronRight, FileText,
  Download, History, UserCheck, Shield
} from 'lucide-react';
import { cn } from '@lib/utils';
import { usePdfExport } from '@/skills/pdf-export.jsx';

export default function WorkflowView() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const { exportToPdf, isExporting } = usePdfExport();

  const steps = [
    {
      title: "1. Intake & Request",
      icon: <GitPullRequest className="h-5 w-5" />,
      description: "Project or operational request entry into the IT Programme Board.",
      details: [
        "Capture business requirements",
        "Assign project/operational type",
        "Initial priority assessment"
      ],
      color: "primary"
    },
    {
      title: "2. Procurement & RFP",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Vendor selection, RFP preparation, and pre-evaluation signing.",
      details: [
        "RFP drafting (Cisco/AWS/Vendor)",
        "Pre-evaluation signature",
        "Submission to procurement team"
      ],
      color: "chart-2"
    },
    {
      title: "3. Implementation",
      icon: <Settings className="h-5 w-5" />,
      description: "Technical setup, server configuration, and resource allocation.",
      details: [
        "AWS/On-Prem server deployment",
        "Firewall and network configuration",
        "Progress updates and status tracking"
      ],
      color: "chart-1"
    },
    {
      title: "4. Compliance & SLA",
      icon: <ShieldCheck className="h-5 w-5" />,
      description: "Security auditing and verification of service level agreements.",
      details: [
        "Security standards verification",
        "SLA monitoring (uptime/availability)",
        "Infrastructure type documentation"
      ],
      color: "chart-3"
    },
    {
      title: "5. Audit & Closure",
      icon: <ClipboardCheck className="h-5 w-5" />,
      description: "Final budget verification and management approval reporting.",
      details: [
        "Annual cost verification (BHD)",
        "Budget document synchronization",
        "Management audit report generation"
      ],
      color: "chart-4"
    }
  ];
const handleExport = async () => {
  try {
    await exportToPdf(containerRef, 'IT-Workflow-Lifecycle.pdf');
      } catch (err) {
      console.error('PDF Export failed:', err);
    }
  };

  return (
<div className="space-y-6" ref={containerRef} style={{ backgroundColor: 'var(--background)' }}>
<div className="flex items-center justify-between no-pdf">
<div>
  <h2 className="text-2xl font-bold tracking-tight">IT Programme Lifecycle</h2>
    <p className="text-sm text-muted-foreground">Standardized workflow for TRA IT Department operations</p>
      </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="gap-2" disabled={isExporting}>
        <Download className="h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export Workflow'}
      </Button>
        </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 hidden md:block" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <button
              key={step.title}
              className={cn(
                "group transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg block w-full text-left",
                activeStep === idx ? "scale-105" : "opacity-70 hover:opacity-100"
              )}
              onClick={() => setActiveStep(idx)}
              aria-label={`Select ${step.title} phase`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center border-2 bg-background transition-colors",
                  activeStep === idx ? "border-primary text-primary shadow-lg shadow-primary/20" : "border-muted text-muted-foreground"
                )}>
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider", activeStep === idx ? "text-primary" : "text-muted-foreground")}>
                    {step.title}
                  </h4>
                  <p className="text-[10px] leading-tight text-muted-foreground line-clamp-2 px-2">
                    {step.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Card className="border-primary/20 bg-muted/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 text-primary">
            {steps[activeStep].icon}
            <CardTitle className="text-lg">{steps[activeStep].title} Phase</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-sm text-foreground">{steps[activeStep].description}</p>
              <ul className="space-y-2">
                {steps[activeStep].details.map((detail) => (
                  <li key={detail} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-chart-1" />
                    {detail}
                  </li>
                ))}
              </ul>

            </div>
            <div className="bg-card p-4 rounded-lg border border-border/60 flex flex-col justify-center items-center space-y-3">
              <Shield className="h-10 w-10 text-primary/40" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role Primary</p>
                <p className="text-sm font-medium">IT Admin / Procurement Officer</p>
              </div>
              <Badge variant="outline" className="text-[10px] bg-primary/5">Standard ISO 27001 Compliant</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
