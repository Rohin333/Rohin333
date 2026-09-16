import { useState } from 'react';
import { ItProgrammeBoard } from '@api/BoardSDK';
import { useDocumentAI } from '@skills/document-extract.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Upload, FileText, DollarSign, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';

export default function BudgetInvoiceUpload({ item, open, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const { extractDocumentAI } = useDocumentAI();

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setExtractedData(null);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);

      // Upload file to the item first
      const board = new ItProgrammeBoard();
      await board.item(item.id).uploadFile({
        columnId: 'itBudgetData',
        file: selectedFile
      }).execute();

      // First get the file assets from the item after upload
      const itemDetails = await board.item(item.id).withAssets().execute();
      const uploadedAsset = itemDetails.assets?.find(f => f.name === selectedFile.name);

      if (!uploadedAsset) {
        throw new Error('File uploaded but not found in item assets');
      }

      // Extract comprehensive budget data from the uploaded file using AI
      const schema = {
        type: 'object',
        properties: {
          annualCost: {
            type: 'number',
            description: 'Total annual cost in BHD (Bahraini Dinar). Extract from budget or invoice total.'
          },
          monthlyCost: {
            type: 'number',
            description: 'Monthly cost in BHD. If only annual cost is available, divide by 12.'
          },
          currency: {
            type: 'string',
            description: 'Currency code (e.g., BHD, USD, EUR, SAR)'
          },
          invoiceNumber: {
            type: 'string',
            description: 'Invoice or budget reference number'
          },
          vendor: {
            type: 'string',
            description: 'Vendor or supplier name'
          },
          description: {
            type: 'string',
            description: 'Brief description of what the cost is for'
          },
          department: {
            type: 'string',
            description: 'Department name (e.g., IT, Finance, Operations)'
          },
          directorate: {
            type: 'string',
            description: 'Directorate or division name'
          },
          budgetCategory: {
            type: 'string',
            description: 'Budget category (e.g., CAPEX, OPEX, Personnel, Infrastructure)'
          },
          fiscalYear: {
            type: 'string',
            description: 'Fiscal year (e.g., 2026, FY2026)'
          },
          monthlyProjectAmounts: {
            type: 'string',
            description: 'Monthly breakdown for project costs if available'
          },
          monthlyOperationalAmounts: {
            type: 'string',
            description: 'Monthly breakdown for operational costs if available'
          },
          totalBudgetAmount: {
            type: 'string',
            description: 'Total budget amount as text with currency'
          },
          overview: {
            type: 'string',
            description: 'Executive summary or overview of the budget'
          },
          lineItems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                item: { type: 'string', description: 'Item description' },
                amount: { type: 'number', description: 'Item amount' }
              },
              required: ['item', 'amount'],
              additionalProperties: false
            },
            description: 'Individual line items from the invoice/budget'
          }
        },
        required: ['annualCost', 'monthlyCost', 'currency', 'invoiceNumber', 'vendor', 'description', 'department', 'directorate', 'budgetCategory', 'fiscalYear', 'monthlyProjectAmounts', 'monthlyOperationalAmounts', 'totalBudgetAmount', 'overview', 'lineItems'],
        additionalProperties: false
      };

      const result = await extractDocumentAI(
        'Extract comprehensive budget and cost information from this invoice or budget document. Include department, directorate, fiscal year, budget categories, monthly breakdowns, and all financial details. Convert all costs to BHD if in another currency. Focus on total annual and monthly costs, along with organizational metadata.',
        {
          mondayAssets: [{ assetId: uploadedAsset.id }],
          schema
        }
      );

      if (result.success) {
        setExtractedData(result.data);
      } else {
        throw new Error('Failed to extract data from file');
      }
    } catch (err) {
      console.error('Error extracting budget data:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleApplyCosts = async () => {
    if (!extractedData) return;

    try {
      setUploading(true);
      const board = new ItProgrammeBoard();

      // Parse fiscal year to date if available
      let yearDate = null;
      if (extractedData.fiscalYear) {
        const yearMatch = extractedData.fiscalYear.match(/\d{4}/);
        if (yearMatch) {
          yearDate = new Date(`${yearMatch[0]}-01-01`);
        }
      }

      // Construct description with other extracted fields to preserve data
      const detailedDesc = [
        extractedData.description,
        extractedData.department ? `🏛️ Department: ${extractedData.department}` : '',
        extractedData.directorate ? `🏢 Directorate: ${extractedData.directorate}` : '',
        extractedData.overview ? `📝 Overview: ${extractedData.overview}` : '',
        extractedData.totalBudgetAmount ? `💰 Total Budget: ${extractedData.totalBudgetAmount}` : ''
      ].filter(Boolean).join('\n\n');

      // Update the item with comprehensive extracted budget data
      await board.item(item.id).update({
        annualCostBhd: extractedData.annualCost,
        monthlyCostBhd: extractedData.monthlyCost || (extractedData.annualCost / 12),
        vendor: extractedData.vendor || null,
        budgetCategories: extractedData.budgetCategory || null,
        year: yearDate,
        approved: true,
        taskDescription: detailedDesc
      }).execute();

      // Create a comprehensive update post with extraction details
      const details = [
        `📄 **Budget Document**: ${selectedFile.name}`,
        extractedData.invoiceNumber ? `📋 **Reference**: ${extractedData.invoiceNumber}` : '',
        extractedData.vendor ? `🏢 **Vendor**: ${extractedData.vendor}` : '',
        extractedData.department ? `🏛️ **Department**: ${extractedData.department}` : '',
        extractedData.directorate ? `📊 **Directorate**: ${extractedData.directorate}` : '',
        extractedData.budgetCategory ? `📁 **Category**: ${extractedData.budgetCategory}` : '',
        extractedData.fiscalYear ? `📅 **Fiscal Year**: ${extractedData.fiscalYear}` : '',
        '',
        `💰 **Annual Cost**: ${extractedData.annualCost.toFixed(2)} ${extractedData.currency || 'BHD'}`,
        `📆 **Monthly Cost**: ${(extractedData.monthlyCost || extractedData.annualCost / 12).toFixed(2)} ${extractedData.currency || 'BHD'}`,
        extractedData.totalBudgetAmount ? `💵 **Total Budget**: ${extractedData.totalBudgetAmount}` : '',
        '',
        extractedData.overview ? `📝 **Overview**:\n${extractedData.overview}` : '',
        extractedData.description ? `\n**Description**: ${extractedData.description}` : ''
      ].filter(Boolean).join('\n');

      await board.item(item.id).post().create(
        `✅ Budget information automatically extracted and applied:\n\n${details}`
      ).execute();

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error applying budget data:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            AI Budget Extraction - {item.name}
          </DialogTitle>
          <DialogDescription>
            Upload budget or invoice document (PDF, Excel, Image) and AI will automatically extract all cost details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <label htmlFor="budget-file-input" className="block text-sm font-medium text-foreground">
              Select Budget or Invoice File
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
                onClick={() => document.getElementById('budget-file-input').click()}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <input
                id="budget-file-input"
                type="file"
                accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.webp"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Budget or invoice file upload"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">{selectedFile.name}</span>
                  <Badge variant="outline">{(selectedFile.size / 1024).toFixed(1)} KB</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Extract Button */}
          {selectedFile && !extractedData && (
            <Button
              onClick={handleExtract}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extracting Budget Data...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Extract Budget Information
                </>
              )}
            </Button>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Extracted Data Preview */}
          {extractedData && (
            <Card className="border-border/60 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Extracted Budget Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Annual Cost</div>
                    <div className="text-2xl font-bold text-chart-1">
                      {extractedData.annualCost?.toFixed(2)} {extractedData.currency || 'BHD'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Monthly Cost</div>
                    <div className="text-2xl font-bold text-chart-3">
                      {(extractedData.monthlyCost || extractedData.annualCost / 12)?.toFixed(2)} {extractedData.currency || 'BHD'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {extractedData.vendor && (
                    <div>
                      <div className="text-xs text-muted-foreground">Vendor</div>
                      <div className="font-medium text-foreground">{extractedData.vendor}</div>
                    </div>
                  )}
                  {extractedData.invoiceNumber && (
                    <div>
                      <div className="text-xs text-muted-foreground">Reference</div>
                      <div className="font-mono text-foreground">{extractedData.invoiceNumber}</div>
                    </div>
                  )}
                  {extractedData.department && (
                    <div>
                      <div className="text-xs text-muted-foreground">Department</div>
                      <div className="font-medium text-foreground">{extractedData.department}</div>
                    </div>
                  )}
                  {extractedData.directorate && (
                    <div>
                      <div className="text-xs text-muted-foreground">Directorate</div>
                      <div className="font-medium text-foreground">{extractedData.directorate}</div>
                    </div>
                  )}
                  {extractedData.budgetCategory && (
                    <div>
                      <div className="text-xs text-muted-foreground">Category</div>
                      <div className="font-medium text-foreground">{extractedData.budgetCategory}</div>
                    </div>
                  )}
                  {extractedData.fiscalYear && (
                    <div>
                      <div className="text-xs text-muted-foreground">Fiscal Year</div>
                      <div className="font-medium text-foreground">{extractedData.fiscalYear}</div>
                    </div>
                  )}
                </div>

                {extractedData.description && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Description</div>
                    <div className="text-sm text-foreground bg-muted/30 rounded p-2">{extractedData.description}</div>
                  </div>
                )}

                {extractedData.overview && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Budget Overview</div>
                    <div className="text-sm text-foreground bg-muted/30 rounded p-2">{extractedData.overview}</div>
                  </div>
                )}

                {extractedData.lineItems && extractedData.lineItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Line Items</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {extractedData.lineItems.map((line, idx) => (
                        <div key={`line-${idx}-${line.item}`} className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{line.item}</span>
                          <span className="font-mono text-foreground">{line.amount?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleApplyCosts}
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Applying to Dashboard...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Apply Budget to Dashboard
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
