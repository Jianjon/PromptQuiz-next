"use client";

import FileUploader from "@/components/FileUploader";

export default function UploadTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto">
        <FileUploader />
      </div>
    </div>
  );
}
