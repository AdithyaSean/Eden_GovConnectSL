
"use client";

export interface ExtractionResult {
  text: string;
  confidence?: number;
  metadata?: {
    pages?: number;
    fileSize?: number;
    fileType?: string;
    language?: string;
  };
  success: boolean;
  error?: string;
}

export class DocumentExtractor {
  private tesseractWorker: Tesseract.Worker | null = null;

  // Initialize Tesseract worker
  private async initTesseract(): Promise<Tesseract.Worker> {
    const { createWorker } = await import('tesseract.js');
    if (!this.tesseractWorker) {
      this.tesseractWorker = await createWorker('eng');
    }
    return this.tesseractWorker;
  }

  // Extract text from images using OCR
  async extractFromImage(file: File): Promise<ExtractionResult> {
    try {
      const worker = await this.initTesseract();
      const { data } = await worker.recognize(file);
      
      return {
        text: data.text,
        confidence: data.confidence,
        metadata: {
          fileSize: file.size,
          fileType: file.type,
          language: 'en'
        },
        success: true
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Image extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Extract text from PDF files
  async extractFromPDF(file: File): Promise<ExtractionResult> {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      return {
        text: fullText.trim(),
        metadata: {
          pages: pdf.numPages,
          fileSize: file.size,
          fileType: file.type
        },
        success: true
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Extract text from plain text files
  async extractFromText(file: File): Promise<ExtractionResult> {
    try {
      const text = await file.text();
      
      return {
        text,
        metadata: {
          fileSize: file.size,
          fileType: file.type
        },
        success: true
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Text file extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Main extraction method that handles different file types
  async extractText(file: File): Promise<ExtractionResult> {
    const fileType = file.type.toLowerCase();
    
    try {
      // Image files (OCR)
      if (fileType.startsWith('image/')) {
        return await this.extractFromImage(file);
      }
      
      // PDF files
      if (fileType === 'application/pdf') {
        return await this.extractFromPDF(file);
      }
      
      // Plain text files
      if (fileType.startsWith('text/') || fileType === 'application/json') {
        return await this.extractFromText(file);
      }
      
      return {
        text: '',
        success: false,
        error: `Unsupported file type: ${fileType}. Word documents are not supported in this version.`
      };
    } catch (error) {
      return {
        text: '',
        success: false,
        error: `Extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}

// Utility functions for data processing
export class DataProcessor {
  // Extract specific patterns from text
  static extractPatterns(text: string): {
    emails: string[];
    phones: string[];
    urls: string[];
    dates: string[];
    numbers: string[];
  } {
    const patterns = {
      emails: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phones: /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g,
      urls: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
      dates: /\b\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}\b|\b\d{4}[\/\-.]\d{1,2}[\/\-.]\d{1,2}\b/g,
      numbers: /\b\d+(?:\.\d+)?\b/g
    };

    return {
      emails: Array.from(text.matchAll(patterns.emails)).map(m => m[0]) || [],
      phones: Array.from(text.matchAll(patterns.phones)).map(m => m[0]) || [],
      urls: Array.from(text.matchAll(patterns.urls)).map(m => m[0]) || [],
      dates: Array.from(text.matchAll(patterns.dates)).map(m => m[0]) || [],
      numbers: Array.from(text.matchAll(patterns.numbers)).map(m => m[0]) || []
    };
  }

  // Extract key-value pairs from text
  static extractKeyValuePairs(text: string): { [key: string]: string } {
    const pairs: { [key: string]: string } = {};
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const colonMatch = line.match(/^([^:]+):\s*(.+)$/);
      const equalMatch = line.match(/^([^=]+)=\s*(.+)$/);
      
      if (colonMatch) {
        pairs[colonMatch[1].trim()] = colonMatch[2].trim();
      } else if (equalMatch) {
        pairs[equalMatch[1].trim()] = equalMatch[2].trim();
      }
    });
    
    return pairs;
  }

  // Clean and normalize text
  static cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim();
  }

  // Extract tables from text (simple table detection)
  static extractTables(text: string): string[][] {
    const lines = text.split('\n');
    const tables: string[][] = [];
    let currentTable: string[] = [];
    
    lines.forEach(line => {
      // Simple heuristic: if line has multiple tabs or multiple spaces, treat as table row
      if (line.includes('\t') || (line.match(/\s{3,}/g) && line.match(/\s{3,}/g)!.length > 1)) {
        const cells = line.split(/\t|\s{3,}/).map(cell => cell.trim()).filter(cell => cell.length > 0);
        if (cells.length > 1) {
          currentTable.push(line);
        }
      } else if (currentTable.length > 0) {
        tables.push(currentTable);
        currentTable = [];
      }
    });
    
    if (currentTable.length > 0) {
      tables.push(currentTable);
    }
    
    return tables;
  }
}

// Export singleton instance
export const documentExtractor = new DocumentExtractor();
