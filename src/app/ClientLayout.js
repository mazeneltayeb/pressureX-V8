// "use client";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import "./globals.css";

// export default function ClientLayout({ children }) {
//   const [loading, setLoading] = useState(true);
//   const pathname = usePathname();

//   useEffect(() => {
//     setLoading(true);
//     const timeout = setTimeout(() => setLoading(false), 800); // وقت التحميل التجريبي
//     return () => clearTimeout(timeout);
//   }, [pathname]);

//   if (loading) {
//     return (
//       <div className="global-loader">
//         <div className="spinner"></div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Spinner } from "react-bootstrap"; // ✅ أضفنا Spinner من Bootstrap
import "./globals.css";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // ✅ وقت تحميل أقصر (300ms بدلاً من 800ms)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // ✅ 300ms فقط
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (loading) {
    return (
      <div className="global-loader">
        {/* ✅ استخدام Spinner من Bootstrap بدلاً من CSS مخصص */}
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
        <p className="mt-2">جاري التحميل...</p>
      </div>
    );
  }

  return <>{children}</>;
}