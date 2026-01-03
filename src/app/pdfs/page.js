

// "use client";
// import React, { useEffect, useState, useCallback } from "react";
// import { 
//   Container, Row, Col, Card, Button, Form, 
//   Badge, Spinner, Alert, Modal
// } from "react-bootstrap";
// import { useRouter } from "next/navigation";
// import { supabase } from '/lib/supabaseClient';
// import { FaFilePdf, FaDownload, FaEye, FaSignInAlt, FaUserPlus } from "react-icons/fa";

// export default function PDFsPage() {
//   const router = useRouter();
//   const [pdfs, setPdfs] = useState([]);
//   const [filteredPDFs, setFilteredPDFs] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("الكل");
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [sortBy, setSortBy] = useState("newest");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [previewModal, setPreviewModal] = useState({ show: false, url: "" });

//   // ✅ دالة handleSignin المطلوبة
//   const handleSignin = useCallback(async () => {
//     try {
//       // حفظ الصفحة الحالية للعودة إليها بعد تسجيل الدخول
//       sessionStorage.setItem("prevPage", window.location.pathname + window.location.search);
      
//       // تسجيل الخروج أولاً إذا كان هناك مستخدم مسجل
//       await supabase.auth.signOut();
      
//       // الانتقال إلى صفحة تسجيل الدخول
//       router.push("auth/signin");
//     } catch (error) {
//       console.error('Error in handleSignin:', error);
//     }
//   }, [router]);

//   // التحقق من حالة تسجيل الدخول
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setAuthLoading(true);
//         const { data: { session }, error } = await supabase.auth.getSession();
        
//         if (error) {
//           console.error('Auth error:', error);
//           setIsLoggedIn(false);
//           setAuthLoading(false);
//           return;
//         }
        
//         if (!session) {
//           setIsLoggedIn(false);
//           setAuthLoading(false);
//           return;
//         }
        
//         setIsLoggedIn(true);
//         setAuthLoading(false);
        
//       } catch (error) {
//         console.error('Error checking auth:', error);
//         setIsLoggedIn(false);
//         setAuthLoading(false);
//       }
//     };

//     checkAuth();
    
//     // الاستماع لتغيرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_IN') {
//           setIsLoggedIn(true);
//           setAuthLoading(false);
//           // إعادة تحميل البيانات بعد تسجيل الدخول
//           fetchData();
//         } else if (event === 'SIGNED_OUT') {
//           setIsLoggedIn(false);
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, [router]);

//   // جلب الملفات والفئات
//   const fetchData = async () => {
//     if (!isLoggedIn) return;
    
//     try {
//       setLoading(true);
      
//       // جلب الملفات
//       const pdfsRes = await fetch("/api/pdfs");
//       const pdfsData = await pdfsRes.json();
//       setPdfs(pdfsData);
//       setFilteredPDFs(pdfsData);

//       // جلب الفئات
//       const categoriesRes = await fetch("/api/categories/pdfs");
//       const categoriesData = await categoriesRes.json();
//       setCategories(categoriesData);
      
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isLoggedIn) {
//       fetchData();
//     }
//   }, [isLoggedIn]);

//   // فلترة وترتيب الملفات
//   useEffect(() => {
//     if (!isLoggedIn) return;
    
//     let filtered = pdfs;

//     if (selectedCategory !== "الكل") {
//       filtered = filtered.filter((pdf) => pdf.category === selectedCategory);
//     }

//     if (sortBy === "downloads") {
//       filtered = [...filtered].sort((a, b) => b.downloads_count - a.downloads_count);
//     } else if (sortBy === "newest") {
//       filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//     }

//     setFilteredPDFs(filtered);
//   }, [selectedCategory, sortBy, pdfs, isLoggedIn]);

//   // ✅ دالة تحميل الملف مع تحديث العداد
//   const handleDownload = async (pdf) => {
//     try {
//       const { data: { user } } = await supabase.auth.getUser();
      
//       // 1. تحديث عدد التحميلات
//       const updateResponse = await fetch(`/api/pdfs/${pdf.id}/download`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
//         },
//         body: JSON.stringify({
//           userId: user?.id,
//           userEmail: user?.email,
//           userName: user?.user_metadata?.full_name || user?.email?.split('@')[0]
//         })
//       });

//       if (!updateResponse.ok) {
//         throw new Error('فشل في تحديث عدد التحميلات');
//       }

//       const updatedData = await updateResponse.json();
      
//       // 2. إنشاء رابط تحميل
//       const link = document.createElement('a');
//       link.href = pdf.file_url;
//       link.download = pdf.title + '.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // 3. تحديث القائمة المحلية
//       setPdfs(prev => prev.map(p => 
//         p.id === pdf.id 
//           ? { ...p, downloads_count: updatedData.downloads_count } 
//           : p
//       ));
      
//       setFilteredPDFs(prev => prev.map(p => 
//         p.id === pdf.id 
//           ? { ...p, downloads_count: updatedData.downloads_count } 
//           : p
//       ));
      
//       alert(`✅ تم تحميل "${pdf.title}"`);
      
//     } catch (error) {
//       console.error('Download error:', error);
//       alert('❌ حدث خطأ أثناء التحميل');
//     }
//   };

//   // ✅ دالة تسجيل الخروج معدلة لاستخدام handleSignin
//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setIsLoggedIn(false);
//       setPdfs([]);
//       setFilteredPDFs([]);
      
//       // استخدام handleSignin للعودة إلى تسجيل الدخول
//       handleSignin();
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // ========== شاشة "يجب تسجيل الدخول أولاً" ==========
//   if (!isLoggedIn && !authLoading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center py-5">
//           <div className="mb-4">
//             <FaFilePdf className="text-danger" style={{ fontSize: "5rem" }} />
//           </div>
          
//           <h1 className="text-danger mb-3">🔒 مكتبة الملفات التعليمية</h1>
          
//           <Alert variant="danger" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
//             <h4 className="alert-heading">هذه الصفحة محمية</h4>
//             <p className="mb-0">
//               يجب عليك تسجيل الدخول أولاً للوصول إلى مكتبة الملفات التعليمية
//             </p>
//           </Alert>
          
//           <div className="row justify-content-center mt-5">
//             <div className="col-md-4 mb-3">
//               <Button 
//                 variant="success" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={handleSignin} // ✅ استخدام handleSignin هنا
//               >
//                 <FaSignInAlt className="me-2" />
//                 تسجيل الدخول
//               </Button>
//               <p className="text-muted mt-2">لديك حساب بالفعل؟</p>
//             </div>
            
//             <div className="col-md-4 mb-3">
//               <Button 
//                 variant="primary" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={() => {
//                   sessionStorage.setItem("prevPage", window.location.pathname + window.location.search);
//                   router.push("auth/signin");
//                 }}
//               >
//                 <FaUserPlus className="me-2" />
//                 إنشاء حساب جديد
//               </Button>
//               <p className="text-muted mt-2">ليس لديك حساب؟ سجل الآن</p>
//             </div>
//           </div>
          
//           <div className="mt-5 p-4 bg-light rounded">
//             <h5>📚 ماذا ستجد في مكتبتنا؟</h5>
//             <Row className="mt-3">
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="info" className="mb-2">ملفات PDF تعليمية</Badge>
//                   <p>دروس، كتب، وملخصات في مختلف المجالات</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="success" className="mb-2">تحميل مجاني</Badge>
//                   <p>جميع الملفات متاحة للتحميل بعد التسجيل</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="warning" className="mb-2">فئات متنوعة</Badge>
//                   <p>تنظيم الملفات حسب التخصصات والمواضيع</p>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   // ========== شاشة التحميل ==========
//   if (authLoading || loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ التحقق من الصلاحيات...</p>
//       </Container>
//     );
//   }

//   // ========== الواجهة الرئيسية بعد تسجيل الدخول ==========
//   return (
//     <Container className="py-5">
//       {/* شريط التحكم العلوي */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <Button 
//           variant="outline-danger" 
//           size="sm"
//           onClick={handleLogout} // ✅ تستخدم handleSignin تلقائياً
//         >
//           🚪 تسجيل الخروج
//         </Button>
//       </div>

//       {/* رسالة ترحيبية للمستخدم المسجل */}
//       <Alert variant="secondary" className="text-center mb-4">
//         <strong>رسالة تنبيه او عروض 🚪 </strong>
//         <br />
//         رسالة تنبيه او عروض 
//       </Alert>

//       {/* أدوات الفلترة */}
//       <div className="row justify-content-between mb-4">
//         <div className="col-md-4 mb-3">
//           <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//             <option value="الكل">📂 كل الملفات</option>
//             {categories.map((category) => (
//               <option key={category.id} value={category.name}>{category.name}</option>
//             ))}
//           </Form.Select>
//         </div>

//         <div className="col-md-4 mb-3">
//           <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="newest">🆕 الأحدث</option>
//             <option value="downloads">⬇️ الأكثر تحميلاً</option>
//           </Form.Select>
//         </div>
//       </div>

//       {/* مؤشر النتائج */}
//       <div className="text-center mb-4">
//         <p className="text-muted">
//           {selectedCategory === "الكل" 
//             ? `عرض ${filteredPDFs.length} ملف`
//             : `عرض ${filteredPDFs.length} ملف في فئة "${selectedCategory}"`
//           }
//         </p>
//       </div>

//       {/* شبكة الملفات */}
//       <Row>
//         {filteredPDFs.length > 0 ? (
//           filteredPDFs.map((pdf) => (
//             <Col lg={3} md={4} sm={6} key={pdf.id} className="mb-4">
//               <Card className="shadow-sm h-100 pdf-card">
//                 {/* صورة الغلاف */}
//                 <div className="position-relative">
//                   <Card.Img
//                     variant="top"
//                     src={pdf.thumbnail_url || "/default-pdf-thumbnail.jpg"}
//                     style={{ 
//                       height: "180px", 
//                       objectFit: "cover",
//                       cursor: "pointer"
//                     }}
//                     alt={pdf.title}
//                     onClick={() => setPreviewModal({ show: true, url: pdf.file_url })}
//                   />
//                   <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
//                     <FaFilePdf /> PDF
//                   </Badge>
//                 </div>
                
//                 <Card.Body className="d-flex flex-column">
//                   <Badge bg="outline-primary" text="dark" className="mb-2 align-self-start">
//                     {pdf.category || "عام"}
//                   </Badge>
                  
//                   <Card.Title style={{ fontSize: "1.1rem" }}>
//                     {pdf.title}
//                   </Card.Title>
                  
//                   <div className="d-flex justify-content-between align-items-center mt-auto">
//                     <div>
//                       <Badge bg="dark" className="">
//                         ⬇️ {pdf.downloads_count || 0} تحميل
//                       </Badge>
//                       <Badge bg="danger" className="me-1">
//                         📄 {(pdf.file_size / (1024*1024)).toFixed(2)} MB
//                       </Badge>
//                     </div>
//                     <div>
//                       <small className="text-muted">
//                         {new Date(pdf.created_at).toLocaleDateString('en-GB')}
//                       </small>
//                     </div>
//                   </div>
                  
//                   {/* أزرار التحكم */}
//                   <div className="d-grid gap-2 mt-3">
//                     <Button 
//                       className="main-button"
//                       onClick={() => handleDownload(pdf)}
//                     >
//                       <FaDownload /> تحميل
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))
//         ) : (
//           <Col className="text-center py-5">
//             <Alert variant="info">
//               <h4>📭 لا توجد ملفات</h4>
//               <p>لا توجد ملفات متاحة حالياً</p>
//               <Button 
//                 variant="primary" 
//                 onClick={() => router.push('/dashboard/pdfs')}
//                 className="mt-2"
//               >
//                 📤 ارفع أول ملف
//               </Button>
//             </Alert>
//           </Col>
//         )}
//       </Row>

//       {/* مودال المعاينة */}
//       <Modal 
//         show={previewModal.show} 
//         onHide={() => setPreviewModal({ show: false, url: "" })}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>معاينة الملف</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ height: "70vh" }}>
//           <iframe 
//             src={previewModal.url} 
//             style={{ width: "100%", height: "100%", border: "none" }}
//             title="PDF Preview"
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setPreviewModal({ show: false, url: "" })}>
//             إغلاق
//           </Button>
//           <Button 
//             variant="success" 
//             onClick={() => {
//               window.open(previewModal.url, '_blank');
//               setPreviewModal({ show: false, url: "" });
//             }}
//           >
//             <FaDownload /> تحميل
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }



"use client";
import React, { useEffect, useState, useCallback } from "react";
import { 
  Container, Row, Col, Card, Button, Form, 
  Badge, Spinner, Alert, Modal
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { FaFilePdf, FaDownload, FaEye, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function PDFsPage() {
  const router = useRouter();
  const [pdfs, setPdfs] = useState([]);
  const [filteredPDFs, setFilteredPDFs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [previewModal, setPreviewModal] = useState({ show: false, url: "" });

  // 🔥 استخدام Auth Context
  const { user, loading: authLoading, isAuthenticated, signOut } = useAuth();

  // ✅ دالة handleSignin المطلوبة
  const handleSignin = useCallback(() => {
    // حفظ الصفحة الحالية للعودة إليها بعد تسجيل الدخول
    localStorage.setItem("prevPage", window.location.pathname + window.location.search);
    
    // الانتقال إلى صفحة تسجيل الدخول
    router.push("/auth/signin");
  }, [router]);

  // جلب الملفات والفئات
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      // جلب الملفات
      const pdfsRes = await fetch("/api/pdfs");
      const pdfsData = await pdfsRes.json();
      setPdfs(pdfsData);
      setFilteredPDFs(pdfsData);

      // جلب الفئات
      const categoriesRes = await fetch("/api/categories/pdfs");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setPdfs([]);
      setFilteredPDFs([]);
      setCategories([]);
      setLoading(false);
    }
  }, [isAuthenticated, fetchData]);

  // فلترة وترتيب الملفات
  useEffect(() => {
    if (!isAuthenticated) return;
    
    let filtered = pdfs;

    if (selectedCategory !== "الكل") {
      filtered = filtered.filter((pdf) => pdf.category === selectedCategory);
    }

    if (sortBy === "downloads") {
      filtered = [...filtered].sort((a, b) => b.downloads_count - a.downloads_count);
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredPDFs(filtered);
  }, [selectedCategory, sortBy, pdfs, isAuthenticated]);

  // ✅ دالة تحميل الملف مع تحديث العداد
  const handleDownload = async (pdf) => {
    try {
      // 1. تحديث عدد التحميلات
      const updateResponse = await fetch(`/api/pdfs/${pdf.id}/download`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0]
        })
      });

      if (!updateResponse.ok) {
        throw new Error('فشل في تحديث عدد التحميلات');
      }

      const updatedData = await updateResponse.json();
      
      // 2. إنشاء رابط تحميل
      const link = document.createElement('a');
      link.href = pdf.file_url;
      link.download = pdf.title + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 3. تحديث القائمة المحلية
      setPdfs(prev => prev.map(p => 
        p.id === pdf.id 
          ? { ...p, downloads_count: updatedData.downloads_count } 
          : p
      ));
      
      setFilteredPDFs(prev => prev.map(p => 
        p.id === pdf.id 
          ? { ...p, downloads_count: updatedData.downloads_count } 
          : p
      ));
      
      alert(`✅ تم تحميل "${pdf.title}"`);
      
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ حدث خطأ أثناء التحميل');
    }
  };

  // ✅ دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // ========== شاشة "يجب تسجيل الدخول أولاً" ==========
  if (!isAuthenticated && !authLoading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <FaFilePdf className="text-danger" style={{ fontSize: "5rem" }} />
          </div>
          
          <h1 className="text-danger mb-3">🔒 مكتبة الملفات التعليمية</h1>
          
          <Alert variant="danger" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="alert-heading">هذه الصفحة محمية</h4>
            <p className="mb-0">
              يجب عليك تسجيل الدخول أولاً للوصول إلى مكتبة الملفات التعليمية
            </p>
          </Alert>
          
          <div className="row justify-content-center mt-5">
            <div className="col-md-4 mb-3">
              <Button 
                variant="success" 
                size="lg" 
                className="w-100 py-3"
                onClick={handleSignin}
              >
                <FaSignInAlt className="me-2" />
                تسجيل الدخول
              </Button>
              <p className="text-muted mt-2">لديك حساب بالفعل؟</p>
            </div>
            
            <div className="col-md-4 mb-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 py-3"
                onClick={() => {
                  localStorage.setItem("prevPage", window.location.pathname);
                  router.push("/auth/signin");
                }}
              >
                <FaUserPlus className="me-2" />
                إنشاء حساب جديد
              </Button>
              <p className="text-muted mt-2">ليس لديك حساب؟ سجل الآن</p>
            </div>
          </div>
          
          <div className="mt-5 p-4 bg-light rounded">
            <h5>📚 ماذا ستجد في مكتبتنا؟</h5>
            <Row className="mt-3">
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="info" className="mb-2">ملفات PDF تعليمية</Badge>
                  <p>دروس، كتب، وملخصات في مختلف المجالات</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="success" className="mb-2">تحميل مجاني</Badge>
                  <p>جميع الملفات متاحة للتحميل بعد التسجيل</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="warning" className="mb-2">فئات متنوعة</Badge>
                  <p>تنظيم الملفات حسب التخصصات والمواضيع</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    );
  }

  // ========== شاشة التحميل ==========
  if (authLoading || (loading && isAuthenticated)) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">
          {authLoading ? "جارٍ التحقق من الصلاحيات..." : "جارٍ تحميل الملفات..."}
        </p>
      </Container>
    );
  }

  // ========== الواجهة الرئيسية بعد تسجيل الدخول ==========
  return (
    <Container className="py-5">
      {/* شريط التحكم العلوي */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary rounded-circle p-2">
            <FaFilePdf size={20} color="white" />
          </div>
          <div>
            <h5 className="mb-0">مرحباً، {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "عزيزي العميل"}</h5>
            <small className="text-muted">📚 مكتبة الملفات التعليمية</small>
          </div>
        </div>
        
        <Button 
          variant="outline-danger" 
          size="sm"
          onClick={handleLogout}
        >
          🚪 تسجيل الخروج
        </Button>
      </div>

      {/* رسالة ترحيبية للمستخدم المسجل */}
      <Alert variant="secondary" className="text-center mb-4">
        <strong>رسالة تنبيه او عروض 🚪 </strong>
        <br />
        رسالة تنبيه او عروض 
      </Alert>

      {/* أدوات الفلترة */}
      <div className="row justify-content-between mb-4">
        <div className="col-md-4 mb-3">
          <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="الكل">📂 كل الملفات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-4 mb-3">
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">🆕 الأحدث</option>
            <option value="downloads">⬇️ الأكثر تحميلاً</option>
          </Form.Select>
        </div>
      </div>

      {/* مؤشر النتائج */}
      <div className="text-center mb-4">
        <p className="text-muted">
          {selectedCategory === "الكل" 
            ? `عرض ${filteredPDFs.length} ملف`
            : `عرض ${filteredPDFs.length} ملف في فئة "${selectedCategory}"`
          }
        </p>
      </div>

      {/* شبكة الملفات */}
      <Row>
        {filteredPDFs.length > 0 ? (
          filteredPDFs.map((pdf) => (
            <Col lg={3} md={4} sm={6} key={pdf.id} className="mb-4">
              <Card className="shadow-sm h-100 pdf-card">
                {/* صورة الغلاف */}
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={pdf.thumbnail_url || "/default-pdf-thumbnail.jpg"}
                    style={{ 
                      height: "180px", 
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    alt={pdf.title}
                    onClick={() => setPreviewModal({ show: true, url: pdf.file_url })}
                  />
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                    <FaFilePdf /> PDF
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Badge bg="outline-primary" text="dark" className="mb-2 align-self-start">
                    {pdf.category || "عام"}
                  </Badge>
                  
                  <Card.Title style={{ fontSize: "1.1rem" }}>
                    {pdf.title}
                  </Card.Title>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <Badge bg="dark" className="">
                        ⬇️ {pdf.downloads_count || 0} تحميل
                      </Badge>
                      <Badge bg="danger" className="me-1">
                        📄 {(pdf.file_size / (1024*1024)).toFixed(2)} MB
                      </Badge>
                    </div>
                    <div>
                      <small className="text-muted">
                        {new Date(pdf.created_at).toLocaleDateString('en-GB')}
                      </small>
                    </div>
                  </div>
                  
                  {/* أزرار التحكم */}
                  <div className="d-grid gap-2 mt-3">
                    <Button 
                      variant="success"
                      className="main-button"
                      onClick={() => handleDownload(pdf)}
                    >
                      <FaDownload /> تحميل
                    </Button>
                    <Button 
                      variant="outline-primary"
                      onClick={() => setPreviewModal({ show: true, url: pdf.file_url })}
                    >
                      <FaEye /> معاينة
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : isAuthenticated ? (
          <Col className="text-center py-5">
            <Alert variant="info">
              <h4>📭 لا توجد ملفات</h4>
              <p>لا توجد ملفات متاحة حالياً</p>
              {selectedCategory !== "الكل" && (
                <Button 
                  variant="primary" 
                  onClick={() => setSelectedCategory("الكل")}
                  className="mt-2 me-2"
                >
                  عرض كل الملفات
                </Button>
              )}
              <Button 
                variant="outline-primary" 
                onClick={fetchData}
                className="mt-2"
              >
                🔄 تحديث القائمة
              </Button>
            </Alert>
          </Col>
        ) : null}
      </Row>

      {/* مودال المعاينة */}
      <Modal 
        show={previewModal.show} 
        onHide={() => setPreviewModal({ show: false, url: "" })}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>معاينة الملف</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "70vh" }}>
          <iframe 
            src={previewModal.url} 
            style={{ width: "100%", height: "100%", border: "none" }}
            title="PDF Preview"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPreviewModal({ show: false, url: "" })}>
            إغلاق
          </Button>
          <Button 
            variant="success" 
            onClick={() => {
              window.open(previewModal.url, '_blank');
              setPreviewModal({ show: false, url: "" });
            }}
          >
            <FaDownload /> تحميل
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS إضافي */}
      <style jsx>{`
        .pdf-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pdf-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .main-button {
          font-weight: 600;
          transition: all 0.3s;
        }
        .main-button:hover:not(:disabled) {
          transform: scale(1.02);
        }
      `}</style>
    </Container>
  );
}