import { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Progress } from '@components/ui/progress';
import { Skeleton } from '@components/ui/skeleton';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Textarea } from '@components/ui/textarea';
import { 
  Upload, File, FileText, Image, FileVideo, 
  FileSpreadsheet, CheckCircle2, AlertCircle, 
  X, Download, Eye, Loader2
} from 'lucide-react';
import { cn } from '@lib/utils';
import ITProgrammeBoard from '@generated/ITProgrammeBoard.js';
import FilePreview from '@components/FilePreview';

const FILE_ICONS = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  xls: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  csv: FileSpreadsheet,
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  mp4: FileVideo,
  mov: FileVideo,
  default: File
};

const getFileIcon = (extension) => {
  const ext = extension?.toLowerCase().replace('.', '');
  return FILE_ICONS[ext] || FILE_ICONS.default;
};

export default function FileUploadManager({ item, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [updatingItem, setUpdatingItem] = useState(false);

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);
  }, []);

  const removeFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    const results = [];

    try {
      const board = new ITProgrammeBoard();
      const totalFiles = selectedFiles.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = selectedFiles[i];
        
        try {
          await board.item(item.id).uploadFile({
            columnId: 'file_mm4aay5w', // files column
            file
          }).execute();

          results.push({ 
            name: file.name, 
            status: 'success',
            size: file.size
          });
          
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
          results.push({ 
            name: file.name, 
            status: 'error', 
            error: err.message 
          });
        }
      }

      setUploadResults(results);
      setSelectedFiles([]);
      
      // Update summary if provided
      if (summary.trim()) {
        setUpdatingItem(true);
        try {
          await board.item(item.id).update({
            summary: summary.trim()
          }).execute();
        } catch (err) {
          console.error('Error updating summary:', err);
        }
        setUpdatingItem(false);
        setSummary('');
      }

      if (onUploadComplete) {
        onUploadComplete();
      }

      // Clear results after 5 seconds
      setTimeout(() => {
        setUploadResults([]);
      }, 5000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* File Drop Zone */}
      <Card className="border-border/60 border-dashed">
        <CardContent className="p-6">
          <div className="text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
              aria-label="Upload files"
            />
            <label
              htmlFor="file-upload"
              className={cn(
                "flex flex-col items-center justify-center cursor-pointer py-8 px-4 rounded-lg transition-all",
                "hover:bg-muted/50",
                uploading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Upload className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm font-medium text-foreground mb-2">
                Click to upload files or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                Logs, reports, configuration files, screenshots
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary">
              Selected Files ({selectedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedFiles.map((file) => {
                const FileIcon = getFileIcon(file.name.split('.').pop());
                return (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(selectedFiles.indexOf(file))}
                      disabled={uploading}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Summary Input */}
            <div className="mt-4 space-y-2">
              <label htmlFor="upload-summary" className="text-sm font-medium text-foreground">
                Upload Summary (Optional)
              </label>
              <Textarea
                id="upload-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Add a summary of the uploaded logs and analysis findings..."
                className="bg-background border-primary/30"
                rows={3}
                disabled={uploading}
              />
            </div>

            {/* Upload Button */}
            <div className="mt-4 flex gap-3">
              <Button
                onClick={handleUpload}
                disabled={uploading || selectedFiles.length === 0}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedFiles([])}
                disabled={uploading}
              >
                Clear All
              </Button>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary">
              Upload Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadResults.map((result) => (
                <div
                  key={`${result.name}-${result.status}`}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    result.status === 'success' ? "bg-chart-1/10" : "bg-destructive/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {result.status === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-chart-1" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {result.name}
                      </p>
                      {result.error && (
                        <p className="text-xs text-destructive">{result.error}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Existing Files */}
      {item.files && item.files.length > 0 && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Existing Files ({item.files.length})
            </CardTitle>
            <CardDescription>
              Previously uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.files.map((file) => {
                const FileIcon = getFileIcon(file.extension);
                return (
                  <div
                    key={file.id}
                    className="border border-border rounded-lg p-3 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {file.downloadUrl && (
                        <a
                          href={file.downloadUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          title="Download file"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <div className="mt-2">
                      <FilePreview file={file} height="120px" objectFit="contain" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
