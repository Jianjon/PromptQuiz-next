export type ExtractedParagraph = {
    source: string;
    content: string;
    page?: number;
    type?: "normal" | "heading" | "table" | "code";
  };
  
  export type ExtractedResult = ExtractedParagraph[];
  