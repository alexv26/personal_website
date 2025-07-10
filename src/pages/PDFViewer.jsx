// src/pages/PDFViewer.jsx
import { useParams } from "react-router-dom";

export default function PDFViewer() {
  const { pdfName } = useParams();
  const base = import.meta.env.BASE_URL;
  const viewerUrl = `${base}pdfjs/web/viewer.html?file=${base}assets/pdfs/${encodeURIComponent(
    pdfName
  )}`;

  return (
    <iframe
      src={viewerUrl}
      title="PDF Viewer"
      width="100%"
      height="1000px"
      style={{ border: "none" }}
    />
  );
}
