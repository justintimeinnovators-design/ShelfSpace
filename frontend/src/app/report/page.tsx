import fs from "fs/promises";
import path from "path";
// Temporarily disabled due to Turbopack font loading issue
// import { EB_Garamond, Cinzel } from "next/font/google";
import ReportRenderer from "@/components/report/ReportRenderer";
import "./report.css";

// const bodyFont = EB_Garamond({
//   subsets: ["latin"],
//   variable: "--font-report-body",
//   weight: ["400", "500", "600", "700"],
// });

// const displayFont = Cinzel({
//   subsets: ["latin"],
//   variable: "--font-report-display",
//   weight: ["400", "500", "600", "700"],
// });

/**
 * Report Page.
 */
export default async function ReportPage() {
  const reportPath = path.resolve(
    process.cwd(),
    "src",
    "content",
    "shelfspace_report.md"
  );
  const content = await fs.readFile(reportPath, "utf8");

  return (
    <main className="report-page">
      <header className="report-running-header">
        <span>SHELFSPACE: COMPREHENSIVE ENGINEERING REVIEW REPORT</span>
      </header>
      <section className="report-shell">
        <div className="report-download">
          <a href="/reports/shelfspace.docx">Download DOCX</a>
        </div>
        <ReportRenderer content={content} />
      </section>
      <footer className="report-running-footer">
        <span>Department of Software Engineering</span>
        <span className="report-page-number" />
      </footer>
    </main>
  );
}
