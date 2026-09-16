import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Alert, AlertDescription } from '@components/ui/alert';
import { 
  GitMerge, Mail, Database, FolderOpen, FileSpreadsheet,
  ArrowRight, CheckCircle2, Settings, Download, Copy
} from 'lucide-react';
import CyberpunkHeader from './CyberpunkHeader';

export default function PowerAutomateWorkflowSpec() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const workflowSteps = [
    {
      id: 1,
      title: "Outlook Folder Monitoring",
      description: "Monitor specific Outlook folders for new email attachments",
      folders: ["Projects 2026", "Operation 2026"],
      trigger: "When a new email arrives in folder",
      icon: Mail
    },
    {
      id: 2,
      title: "Attachment Extraction",
      description: "Extract all attachments from incoming emails",
      action: "Get attachments from email",
      fileTypes: "PDF, XLSX, DOCX, PNG, JPG",
      icon: FileSpreadsheet
    },
    {
      id: 3,
      title: "SharePoint Upload",
      description: "Upload extracted attachments to designated SharePoint path",
      path: "/sites/TRA-IT/Shared Documents/IT Programme Board/Incoming",
      action: "Create file in SharePoint",
      icon: Database
    },
    {
      id: 4,
      title: "File Classification (AI)",
      description: "Analyze file content to determine document type",
      classification: ["RFP Document", "Budget Data", "Invoice", "Project Update", "General Document"],
      action: "Use AI Builder to classify document",
      icon: Settings
    },
    {
      id: 5,
      title: "Monday.com Integration",
      description: "Send classified document to appropriate Monday.com table",
      mapping: {
        "RFP Document": "RFP Table (Group: Procurement)",
        "Budget Data": "Budget Table (Group: IT BUDGET Details)",
        "Invoice": "Invoice Column in Projects",
        "Project Update": "Project Update Summary Column"
      },
      action: "Create or update Monday.com item",
      icon: CheckCircle2
    },
    {
      id: 6,
      title: "Dashboard Auto-Refresh",
      description: "Trigger dashboard refresh to display new data",
      action: "Send webhook notification to Monday.com app",
      icon: GitMerge
    }
  ];

  const powerAutomateJSON = {
    "definition": {
      "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
      "contentVersion": "1.0.0.0",
      "triggers": {
        "When_a_new_email_arrives_in_folder": {
          "type": "ApiConnection",
          "inputs": {
            "host": {
              "connection": {
                "name": "@parameters('$connections')['office365']['connectionId']"
              }
            },
            "method": "get",
            "path": "/v2/Mail/OnNewEmail",
            "queries": {
              "folderPath": "Projects 2026",
              "importance": "Any",
              "fetchOnlyWithAttachment": true
            }
          }
        }
      },
      "actions": {
        "Get_Attachments": {
          "type": "ApiConnection",
          "inputs": {
            "host": {
              "connection": {
                "name": "@parameters('$connections')['office365']['connectionId']"
              }
            },
            "method": "get",
            "path": "/v2/Mail/@{triggerBody()?['Id']}/Attachments"
          },
          "runAfter": {}
        },
        "For_each_attachment": {
          "type": "Foreach",
          "foreach": "@body('Get_Attachments')",
          "actions": {
            "Upload_to_SharePoint": {
              "type": "ApiConnection",
              "inputs": {
                "host": {
                  "connection": {
                    "name": "@parameters('$connections')['sharepointonline']['connectionId']"
                  }
                },
                "method": "post",
                "path": "/datasets/@{encodeURIComponent(encodeURIComponent('https://tra.sharepoint.com/sites/TRA-IT'))}/files",
                "queries": {
                  "folderPath": "/Shared Documents/IT Programme Board/Incoming",
                  "name": "@items('For_each_attachment')?['Name']"
                },
                "body": "@items('For_each_attachment')?['ContentBytes']"
              }
            },
            "Classify_Document": {
              "type": "ApiConnection",
              "inputs": {
                "host": {
                  "connection": {
                    "name": "@parameters('$connections')['aibuilder']['connectionId']"
                  }
                },
                "method": "post",
                "path": "/formrecognizer/categories",
                "body": {
                  "file": "@body('Upload_to_SharePoint')"
                }
              },
              "runAfter": {
                "Upload_to_SharePoint": ["Succeeded"]
              }
            },
            "Switch_on_Document_Type": {
              "type": "Switch",
              "expression": "@body('Classify_Document')?['category']",
              "cases": {
                "RFP_Document": {
                  "case": "RFP",
                  "actions": {
                    "Create_Monday_Item_RFP": {
                      "type": "Http",
                      "inputs": {
                        "method": "POST",
                        "uri": "https://api.monday.com/v2",
                        "headers": {
                          "Authorization": "@parameters('MondayAPIKey')",
                          "Content-Type": "application/json"
                        },
                        "body": {
                          "query": "mutation { create_item (board_id: 18416931185, group_id: \"group_rfp\", item_name: \"@{items('For_each_attachment')?['Name']}\", column_values: \"{\\\"file_column\\\": \\\"@{body('Upload_to_SharePoint')?['Path']}\\\"}\") { id } }"
                        }
                      }
                    }
                  }
                },
                "Budget_Data": {
                  "case": "Budget",
                  "actions": {
                    "Create_Monday_Item_Budget": {
                      "type": "Http",
                      "inputs": {
                        "method": "POST",
                        "uri": "https://api.monday.com/v2",
                        "headers": {
                          "Authorization": "@parameters('MondayAPIKey')",
                          "Content-Type": "application/json"
                        },
                        "body": {
                          "query": "mutation { create_item (board_id: 18416931185, group_id: \"group_mm452vv3\", item_name: \"Budget - @{items('For_each_attachment')?['Name']}\", column_values: \"{\\\"it_budget_data\\\": \\\"@{body('Upload_to_SharePoint')?['Path']}\\\"}\") { id } }"
                        }
                      }
                    }
                  }
                }
              },
              "runAfter": {
                "Classify_Document": ["Succeeded"]
              }
            }
          },
          "runAfter": {
            "Get_Attachments": ["Succeeded"]
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <CyberpunkHeader
        title="POWER AUTOMATE WORKFLOW SPECIFICATION"
        subtitle="Outlook → SharePoint → Monday.com Integration Architecture"
        stats={[
          { label: '6 WORKFLOW STAGES', variant: 'default' },
          { label: 'AI-POWERED CLASSIFICATION', variant: 'default' }
        ]}
      />

      <Alert className="border-primary/60 bg-primary/10">
        <GitMerge className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs">
          <strong className="text-primary">Automated Document Flow:</strong> This workflow monitors your Outlook folders 
          (Projects 2026, Operation 2026), extracts attachments, uploads them to SharePoint, uses AI to classify document types, 
          and automatically creates Monday.com items in the correct groups with proper metadata.
        </AlertDescription>
      </Alert>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={step.id} className="border-primary/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded border border-primary/60 bg-primary/10 flex items-center justify-center flex-shrink-0"
                       style={{ boxShadow: 'var(--glow-primary-subtle)' }}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[9px] font-mono">STEP {step.id}</Badge>
                      <CardTitle className="text-sm font-black uppercase tracking-wider">{step.title}</CardTitle>
                    </div>
                    <CardDescription className="text-[10px]">{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {step.folders && (
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <p className="text-[10px] font-semibold text-foreground mb-2 uppercase">Monitored Folders</p>
                    <div className="flex flex-wrap gap-2">
                      {step.folders.map(f => (
                        <Badge key={f} variant="secondary" className="text-[9px] font-mono">
                          <FolderOpen className="h-3 w-3 mr-1" />
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {step.fileTypes && (
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <p className="text-[10px] font-semibold text-foreground mb-2 uppercase">Supported File Types</p>
                    <p className="text-xs text-muted-foreground">{step.fileTypes}</p>
                  </div>
                )}

                {step.path && (
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <p className="text-[10px] font-semibold text-foreground mb-2 uppercase">SharePoint Path</p>
                    <code className="text-[10px] font-mono text-primary">{step.path}</code>
                  </div>
                )}

                {step.classification && (
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <p className="text-[10px] font-semibold text-foreground mb-2 uppercase">Document Classifications</p>
                    <div className="flex flex-wrap gap-2">
                      {step.classification.map(c => (
                        <Badge key={c} variant="secondary" className="text-[9px]">{c}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {step.mapping && (
                  <div className="p-3 bg-muted/30 rounded border border-border/40">
                    <p className="text-[10px] font-semibold text-foreground mb-2 uppercase">Monday.com Routing</p>
                    <div className="space-y-2">
                      {Object.entries(step.mapping).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-[10px]">
                          <Badge variant="outline" className="text-[9px] min-w-[120px]">{key}</Badge>
                          <ArrowRight className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step.action && (
                  <div className="flex items-center gap-2 text-[10px] text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="font-semibold uppercase tracking-wider">Action: {step.action}</span>
                  </div>
                )}
              </CardContent>
              
              {idx < workflowSteps.length - 1 && (
                <div className="flex justify-center pb-4">
                  <ArrowRight className="h-5 w-5 text-primary rotate-90" style={{ filter: 'drop-shadow(0 0 4px var(--color-primary))' }} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Power Automate JSON Export */}
      <Card className="border-primary/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-l-[20px] border-l-transparent border-t-primary/20" />
        <CardHeader>
          <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Download className="h-4 w-4 text-primary" />
            Power Automate Flow Definition (JSON)
          </CardTitle>
          <CardDescription className="text-[10px] uppercase tracking-wider">
            Import this JSON into Power Automate to create the workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-black/40 rounded border border-border/40 max-h-64 overflow-y-auto">
            <pre className="text-[9px] font-mono text-primary whitespace-pre-wrap">
              {JSON.stringify(powerAutomateJSON, null, 2)}
            </pre>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => copyToClipboard(JSON.stringify(powerAutomateJSON, null, 2))}
              className="text-[10px] h-8 bg-primary hover:bg-primary/90 uppercase tracking-wider font-bold"
            >
              <Copy className="h-3 w-3 mr-1.5" />
              Copy JSON
            </Button>
            <Button 
              variant="outline"
              size="sm" 
              onClick={() => {
                const blob = new Blob([JSON.stringify(powerAutomateJSON, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'TRA-IT-Programme-Board-PowerAutomate-Flow.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="text-[10px] h-8 uppercase tracking-wider"
            >
              <Download className="h-3 w-3 mr-1.5" />
              Download JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Notes */}
      <Card className="border-accent/40 bg-accent/10">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-wider">Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p><strong className="text-foreground">1. Prerequisites:</strong> Office 365 license, SharePoint site permissions, Monday.com API key</p>
          <p><strong className="text-foreground">2. AI Builder:</strong> Requires AI Builder license for document classification (or use condition-based logic on file name patterns)</p>
          <p><strong className="text-foreground">3. Connections:</strong> Configure Office 365 Outlook, SharePoint Online, and HTTP connectors in Power Automate</p>
          <p><strong className="text-foreground">4. Monday.com API:</strong> Store API key as Power Automate environment variable for security</p>
          <p><strong className="text-foreground">5. Error Handling:</strong> Add try-catch blocks and email notifications for failed classifications</p>
          <p><strong className="text-foreground">6. Testing:</strong> Test with sample emails in a dev folder before deploying to production folders</p>
        </CardContent>
      </Card>
    </div>
  );
}
