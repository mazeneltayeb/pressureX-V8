"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Navbar, 
  Nav, 
  Container, 
  Badge, 
  Button,
  Dropdown
} from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@/contexts/AuthContext'; // استيراد AuthContext
import useTranslate from '@/hooks/useTranslate';
import LanguageButton from './LanguageButton';
import imgLogo from "components/img/logo.png"

export default function NavigationBar() {
  const [totalItems, setTotalItems] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { t } = useTranslate(null);
  
  // استخدام Auth Context بدلاً من إدارة المستخدم محلياً
  const { user, loading, signOut, isAuthenticated } = useAuth();

  // 🔥 تحديث السلة
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(itemsCount);
    };

    updateCart();
    const interval = setInterval(updateCart, 1000);

    return () => clearInterval(interval);
  }, []);

  // إغلاق dropdown عند النقر خارج
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🔥 تسجيل الخروج باستخدام Auth Context
  const handleSignOut = async () => {
    try {
      await signOut();
      setExpanded(false);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // دالة تسجيل الدخول
  const handleSignin = () => {
    localStorage.setItem("prevPage", window.location.href);
    setExpanded(false);
    setShowDropdown(false);
    // الانتقال إلى صفحة تسجيل الدخول يتم عبر Link
  };

  // إغلاق القائمة عند النقر على رابط
  const closeNavbar = () => {
    setExpanded(false);
    setShowDropdown(false);
  };

  // تبديل dropdown الأسعار
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // عرض حالة التحميل
  if (loading) {
    return (
      <Navbar 
        bg="" 
        expand="lg" 
        className="shadow-sm fixed-top px-sm-2 px-md-4 main-color"
        style={{ height: '60px' }}
      >
        <Container fluid>
          <Navbar.Brand as={Link} href="/">
            <Image src={imgLogo} alt="Logo" width={100} height={40} />
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
            <small className="text-muted">جاري التحميل...</small>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar 
      bg="" 
      expand="lg" 
      className="shadow-sm fixed-top px-sm-2 px-md-4 main-color"
      expanded={expanded}
    >
      <Container fluid>
        {/* الشعار */}
        <Navbar.Brand as={Link} href="/" onClick={closeNavbar}>
          <Image src={imgLogo} alt="Logo" width={100} height={40} />
        </Navbar.Brand>
        
        {/* زر اللغة */}
        <LanguageButton onClick={closeNavbar} className=""/>
        
        {/* زر القائمة المخصصة */}
        <button
          className="navbar-toggler p-0 d-lg-none"
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            background: 'transparent',
            width: '36px',
            height: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: 'none'
          }}
        >
          {expanded ? (
            // أيقونة X
            <div style={{
              position: 'relative',
              width: '20px',
              height: '20px'
            }}>
              <span style={{
                position: 'absolute',
                top: '9px',
                left: '0',
                width: '20px',
                height: '2px',
                backgroundColor: '#333',
                transform: 'rotate(45deg)',
                transition: 'all 0.3s ease'
              }}></span>
              <span style={{
                position: 'absolute',
                top: '9px',
                left: '0',
                width: '20px',
                height: '2px',
                backgroundColor: '#333',
                transform: 'rotate(-45deg)',
                transition: 'all 0.3s ease'
              }}></span>
            </div>
          ) : (
            // أيقونة ثلاث خطوط
            <div style={{
              width: '20px',
              height: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease'
              }}></span>
              <span style={{
                width: '75%',
                height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease'
              }}></span>
              <span style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease'
              }}></span>
            </div>
          )}
        </button>

        <Navbar.Collapse id="basic-navbar-nav" className="p-2" in={expanded}>
          <Nav className="me-auto">
            <Nav.Link className="button fw-bolder fs-6" as={Link} href="/" onClick={closeNavbar}>
              {t('home')}
            </Nav.Link>
            <Nav.Link className="button fw-bolder fs-6" as={Link} href="/about" onClick={closeNavbar}>
              {t('about')}
            </Nav.Link>
            <Nav.Link className="button fw-bolder fs-6" as={Link} href="/contact" onClick={closeNavbar}>
              {t('contact')}
            </Nav.Link>
            <Nav.Link className="button fw-bolder fs-6" as={Link} href="/pdfs" onClick={closeNavbar}>
              {t('Lists')}
            </Nav.Link>
            <Nav.Link className="button fw-bolder fs-6" as={Link} href="/store" onClick={closeNavbar}>
              {t('Store')}
            </Nav.Link>

            {/* رابط طلباتي - يظهر فقط للمستخدم المسجل */}
            {/* {isAuthenticated && (
              <Nav.Link 
                className="button fw-bolder fs-6" 
                as={Link} 
                href="/trackorders" 
                onClick={closeNavbar}
              >
                📦 طلباتي
              </Nav.Link>
            )} */}
          </Nav>

          {/* أزرار المستخدم والسلة */}
          <Nav className="ms-3 d-flex align-items-center flex-wrap">
            {isAuthenticated ? (
              // 🔥 المستخدم مسجل الدخول
              <div className="d-flex align-items-center gap-2">
                {/* زر السلة */}
                <Nav.Link 
                  as={Link} 
                  href="/cart" 
                  className="position-relative mx-2" 
                  onClick={closeNavbar}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  🛒
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.5rem', borderRadius: '100%' }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>

                {/* زر البروفايل Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="light"
                    className="d-flex align-items-center gap-1 border-0"
                    style={{ background: 'transparent', whiteSpace: 'nowrap' }}
                  >
                    <span className="d-none d-md-inline">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'حسابي'}
                    </span>
                    <i className="bi bi-person-circle"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item 
                      as={Link} 
                      href="/profile" 
                      onClick={closeNavbar}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-person"></i> الملف الشخصي
                    </Dropdown.Item>
                    <Dropdown.Item 
                      as={Link} 
                      href="/trackorders" 
                      onClick={closeNavbar}
                      className="d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-box-seam"></i> طلباتي
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => {
                        handleSignOut();
                        closeNavbar();
                      }}
                      className="text-danger d-flex align-items-center gap-2"
                    >
                      <i className="bi bi-box-arrow-right"></i> تسجيل الخروج
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* زر تسجيل الخروج مباشر (بدون dropdown) */}
                {/* <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    handleSignOut();
                    closeNavbar();
                  }}
                  size="sm"
                  className="button fw-bolder fs-6"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t('sign_out')}
                </Button> */}
              </div>
            ) : (
              // 🔥 المستخدم غير مسجل الدخول
              <div className="d-flex align-items-center gap-2">
                {/* زر السلة - يظهر للجميع */}
                <Nav.Link 
                  as={Link} 
                  href="/cart" 
                  className="position-relative mx-2" 
                  onClick={closeNavbar}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  🛒
                  {totalItems > 0 && (
                    <Badge 
                      bg="danger" 
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.5rem', borderRadius: '100%' }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>

                {/* أزرار التسجيل */}
                <Button 
                  variant="outline-primary" 
                  as={Link}
                  href="/auth/signin" 
                  onClick={closeNavbar}
                  size="sm"
                  className="button fw-bolder fs-6 py-2"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t('sign_in')}
                </Button>

                <Button 
                  variant="primary" 
                  as={Link}
                  href="/registration" 
                  size="sm"
                  onClick={closeNavbar}
                  className="button fw-bolder fs-6 py-2"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {t('sign_up')}
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}



// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Navbar, Nav, Container, NavDropdown, Badge, Button } from "react-bootstrap";
// import Link from "next/link";
// import Image from "next/image";
// import { supabase } from "/lib/supabaseClient"; 
// import imgLogo from "components/img/logo.png"
// import useTranslate from '@/hooks/useTranslate';
// import LanguageButton from './LanguageButton';


// export default function NavigationBar() {
//   const [totalItems, setTotalItems] = useState(0);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//    const { t, lang } = useTranslate(null);
  



//   // 🔥 جلب بيانات المستخدم
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     getUser();

//     // الاستماع لتغييرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // 🔥 تحديث السلة
//   useEffect(() => {
//     const updateCart = () => {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//       const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setTotalItems(itemsCount);
//     };

//     updateCart();
//     const interval = setInterval(updateCart, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // إغلاق dropdown عند النقر خارج
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // 🔥 تسجيل الخروج
//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setExpanded(false);
//       setShowDropdown(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSignin = async () => {
//     try {
//       sessionStorage.setItem("prevPage", window.location.href);
//       await supabase.auth.signOut();
//       setUser(null);
//       setExpanded(false);
//       setShowDropdown(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // إغلاق القائمة عند النقر على رابط
//   const closeNavbar = () => {
//     setExpanded(false);
//     setShowDropdown(false);
//   };

//   // تبديل dropdown الأسعار
//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <Navbar 
//       bg="" 
//       expand="lg" 
//       className="shadow-sm fixed-top px-sm-2  px-md-4 main-color"
//       expanded={expanded}
     
//     >
      
    
    
//     <Navbar.Brand as={Link} href="/" onClick={closeNavbar}>
//             <Image src={imgLogo} alt="Logo" width={100} height={40} />
            
//         </Navbar.Brand>
//         {/* زر القائمة المخصص - بدون حدود وحجم صغير - يظهر فقط في الشاشات الصغيرة */}
//         <LanguageButton  onClick={closeNavbar} className=""/>
//         <button
//           className="navbar-toggler p-0 d-lg-none"  // d-lg-none = يختفي في الشاشات الكبيرة
//           type="button"
//           onClick={() => setExpanded(!expanded)}
//           aria-controls="basic-navbar-nav"
//           aria-expanded={expanded}
//           aria-label="Toggle navigation"
//           style={{
//             border: 'none',
//             background: 'transparent',
//             width: '36px',
//             height: '36px',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             cursor: 'pointer',
//             outline: 'none',
//             boxShadow: 'none'
//           }}
//         >
//           {expanded ? (
//             // أيقونة X عند فتح القائمة - حجم صغير
//             <div style={{
//               position: 'relative',
//               width: '20px',
//               height: '20px'
//             }}>
//               <span style={{
//                 position: 'absolute',
//                 top: '9px',
//                 left: '0',
//                 width: '20px',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transform: 'rotate(45deg)',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 position: 'absolute',
//                 top: '9px',
//                 left: '0',
//                 width: '20px',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transform: 'rotate(-45deg)',
//                 transition: 'all 0.3s ease'
//               }}></span>

//             </div>
//           ) : (
//             // أيقونة ثلاث خطوط ☰ عند إغلاق القائمة - حجم صغير
//             <div style={{
//               width: '20px',
//               height: '14px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between'
//             }}>
//               <span style={{
//                 width: '100%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 width: '75%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 width: '100%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//             </div>
//           )}
//         </button>

//         <Navbar.Collapse id="basic-navbar-nav" className="p-2" in={expanded}>
//           <Nav className="me-auto">
//              {/* <Nav.Link className="button fw-bolder fs-6" as={Link} href="/" onClick={closeNavbar}>الرئيسية</Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/about" onClick={closeNavbar}>من نحن</Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/contact" onClick={closeNavbar}>اتصل بنا</Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/articles" onClick={closeNavbar}>المقالات</Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/pdfs" onClick={closeNavbar}>كشفات</Nav.Link>  */}
//             {/* <LanguageButton  onClick={closeNavbar}/> */}
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/" onClick={closeNavbar}>{t('home')}</Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/about" onClick={closeNavbar}>{t('about')} </Nav.Link>
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/contact" onClick={closeNavbar}> {t('contact')}</Nav.Link>
//             {/* <Nav.Link className="button fw-bolder fs-6" as={Link} href="/articles" onClick={closeNavbar}>{t('Article')}</Nav.Link> */}
//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/pdfs" onClick={closeNavbar}>{t('Lists')}</Nav.Link> 
//             {/* dropdown الأسعار يظهر فقط لما ندوس عليه */}
//             <div className="nav-item" ref={dropdownRef} style={{ position: 'relative' }}>
//               {/* <button
//                 className="nav-link dropdown-toggle"
//                 onClick={toggleDropdown}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: expanded ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.55)',
//                   // padding: '0.5rem 1rem',
//                   cursor: 'pointer',
//                   textDecoration: 'none',
//                   display: 'block',
//                   width: '100%',
//                   textAlign: 'right'
//                 }}
//               >
//                 الأسعار
//               </button> */}
//               {/* قائمة dropdown */}
//               {/* <div 
//                 className={`dropdown-menu ${showDropdown ? 'show' : ''}`}
//                 style={{
//                   position: expanded ? 'static' : 'absolute',
//                   right: expanded ? 'auto' : '0',
//                   left: expanded ? 'auto' : 'auto',
//                   border: '1px solid rgba(0,0,0,.15)',
//                   borderRadius: '0.25rem',
//                   boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
//                   backgroundColor: '#fff',
//                   zIndex: 1000,
//                   minWidth: '160px',
//                   marginTop: expanded ? '0' : '0.125rem',
//                   display: showDropdown ? 'block' : 'none'
//                 }}
//               >
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/gold" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الذهب
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/currency" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الصرف
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/poultry" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   بورصة الدواجن
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/materials" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الخامات
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/feeds" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   اسعار الاعلاف
//                 </Link>
//               </div> */}
//             </div>

//             <Nav.Link className="button fw-bolder fs-6" as={Link} href="/store" onClick={closeNavbar}>{t('Store')}</Nav.Link>

//           </Nav>

//           {/* 🔥 أزرار المستخدم والسلة */}
//           {/* <Nav className="ms-3 d-flex align-items-center flex-wrap"> */}
//             {!loading && (
//               user ? (
//                 // 🔥 المستخدم مسجل الدخول - تظهر السلة وأزرار البروفايل
//                 <>
//                   {/* زر السلة */}
//                   <Nav.Link 
//                     as={Link} 
//                     href="/cart" 
//                     className="position-relative mx-2 py-3" 
//                     onClick={closeNavbar}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                      🛒
//                     {totalItems > 0 && (
//                       <Badge 
//                         bg="danger" 
//                         className="position-absolute top-0 start-100 translate-middle"
//                         style={{ fontSize: '0.5rem',  borderRadius: '100%'}}
//                       >
//                         {totalItems}
//                       </Badge>
//                     )}
                    
//                   </Nav.Link>

//                   {/* زر البروفايل وتسجيل الخروج */}
//                   {/* <Nav.Link 
//                     as={Link} 
//                     href="/profile" 
//                     className="text-dark mx-2" 
//                     onClick={closeNavbar}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     👤 {user.email?.split('@')[0]}
//                   </Nav.Link> */}
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={() => {
//                       handleSignOut();
//                       closeNavbar();
//                     }}
//                     size="sm"
//                     className="button fw-bolder fs-6"
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     {t('sign_out')}

//                   </Button>
//                 </>
//               ) : (
//                 // 🔥 المستخدم غير مسجل الدخول - تظهر فقط أزرار التسجيل
//                 <>
//                   <Button 
//                     // variant="success" 
//                     href="/auth/signin" 
//                     onClick={() => {
//                       handleSignin();
//                       closeNavbar();
//                     }}
//                     size="sm"
//                     className=" button fw-bolder fs-6 py-2"
//                     as={Link}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     {t('sign_in')}
//                   </Button>

//                   <Button 
//                     // variant="outline-primary" 
//                     href="/registration" 
//                     size="sm"
//                     as={Link}
//                     onClick={closeNavbar}
//                     className="button fw-bolder fs-6 py-2"
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                      {t('sign_up')}
//                   </Button>
//                 </>
//               )
//             )}
        

     
         
//         </Navbar.Collapse>
   
//     </Navbar>
//   );
// }





// very good

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Navbar, Nav, Container, NavDropdown, Badge, Button } from "react-bootstrap";
// import Link from "next/link";
// import Image from "next/image";
// import { supabase } from "/lib/supabaseClient"; 

// export default function NavigationBar() {
//   const [totalItems, setTotalItems] = useState(0);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   // 🔥 جلب بيانات المستخدم
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     getUser();

//     // الاستماع لتغييرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // 🔥 تحديث السلة
//   useEffect(() => {
//     const updateCart = () => {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//       const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setTotalItems(itemsCount);
//     };

//     updateCart();
//     const interval = setInterval(updateCart, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // إغلاق dropdown عند النقر خارج
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // 🔥 تسجيل الخروج
//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setExpanded(false);
//       setShowDropdown(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSignin = async () => {
//     try {
//       sessionStorage.setItem("prevPage", window.location.href);
//       await supabase.auth.signOut();
//       setUser(null);
//       setExpanded(false);
//       setShowDropdown(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   // إغلاق القائمة عند النقر على رابط
//   const closeNavbar = () => {
//     setExpanded(false);
//     setShowDropdown(false);
//   };

//   // تبديل dropdown الأسعار
//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <Navbar 
//       bg="light" 
//       expand="lg" 
//       className="shadow-sm fixed-top"
//       expanded={expanded}
//       style={{ zIndex: 1030 }}
//     >
        
//       <Container>
//       <Navbar.Brand as={Link} href="/" onClick={closeNavbar}>
//                     <Image src="/logo.png" alt="Logo" width={50} height={50} />
//         </Navbar.Brand>

//         {/* زر القائمة المخصص - بدون حدود وحجم صغير - يظهر فقط في الشاشات الصغيرة */}
//         <button
//           className="navbar-toggler p-0 d-lg-none"  // d-lg-none = يختفي في الشاشات الكبيرة
//           type="button"
//           onClick={() => setExpanded(!expanded)}
//           aria-controls="basic-navbar-nav"
//           aria-expanded={expanded}
//           aria-label="Toggle navigation"
//           style={{
//             border: 'none',
//             background: 'transparent',
//             width: '36px',
//             height: '36px',
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             alignItems: 'center',
//             cursor: 'pointer',
//             outline: 'none',
//             boxShadow: 'none'
//           }}
//         >
//           {expanded ? (
//             // أيقونة X عند فتح القائمة - حجم صغير
//             <div style={{
//               position: 'relative',
//               width: '20px',
//               height: '20px'
//             }}>
//               <span style={{
//                 position: 'absolute',
//                 top: '9px',
//                 left: '0',
//                 width: '20px',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transform: 'rotate(45deg)',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 position: 'absolute',
//                 top: '9px',
//                 left: '0',
//                 width: '20px',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transform: 'rotate(-45deg)',
//                 transition: 'all 0.3s ease'
//               }}></span>
//             </div>
//           ) : (
//             // أيقونة ثلاث خطوط ☰ عند إغلاق القائمة - حجم صغير
//             <div style={{
//               width: '20px',
//               height: '14px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between'
//             }}>
//               <span style={{
//                 width: '100%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 width: '75%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//               <span style={{
//                 width: '100%',
//                 height: '2px',
//                 backgroundColor: '#333',
//                 transition: 'all 0.3s ease'
//               }}></span>
//             </div>
//           )}
//         </button>

//         <Navbar.Collapse id="basic-navbar-nav" in={expanded}>
//           <Nav className="me-auto">
//             <Nav.Link as={Link} href="/" onClick={closeNavbar}>الرئيسية</Nav.Link>
//             <Nav.Link as={Link} href="/about" onClick={closeNavbar}>من نحن</Nav.Link>
//             <Nav.Link as={Link} href="/contact" onClick={closeNavbar}>اتصل بنا</Nav.Link>
//             <Nav.Link as={Link} href="/articles" onClick={closeNavbar}>المقالات</Nav.Link>

//             {/* dropdown الأسعار يظهر فقط لما ندوس عليه */}
//             <div className="nav-item" ref={dropdownRef} style={{ position: 'relative' }}>
//               <button
//                 className="nav-link dropdown-toggle"
//                 onClick={toggleDropdown}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: expanded ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.55)',
//                   // padding: '0.5rem 1rem',
//                   cursor: 'pointer',
//                   textDecoration: 'none',
//                   display: 'block',
//                   width: '100%',
//                   textAlign: 'right'
//                 }}
//               >
//                 الأسعار
//               </button>
              
//               {/* قائمة dropdown */}
//               <div 
//                 className={`dropdown-menu ${showDropdown ? 'show' : ''}`}
//                 style={{
//                   position: expanded ? 'static' : 'absolute',
//                   right: expanded ? 'auto' : '0',
//                   left: expanded ? 'auto' : 'auto',
//                   border: '1px solid rgba(0,0,0,.15)',
//                   borderRadius: '0.25rem',
//                   boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
//                   backgroundColor: '#fff',
//                   zIndex: 1000,
//                   minWidth: '160px',
//                   marginTop: expanded ? '0' : '0.125rem',
//                   display: showDropdown ? 'block' : 'none'
//                 }}
//               >
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/gold" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الذهب
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/currency" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الصرف
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/poultry" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   بورصة الدواجن
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/materials" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   أسعار الخامات
//                 </Link>
//                 <Link 
//                   className="dropdown-item" 
//                   href="/prices/feeds" 
//                   onClick={closeNavbar}
//                   style={{
//                     padding: '0.5rem 1.5rem',
//                     color: '#212529',
//                     textDecoration: 'none',
//                     display: 'block',
//                     textAlign: 'right'
//                   }}
//                 >
//                   اسعار الاعلاف
//                 </Link>
//               </div>
//             </div>

//             <Nav.Link as={Link} href="/store" onClick={closeNavbar}>المتجر</Nav.Link>
//           </Nav>

//           {/* 🔥 أزرار المستخدم والسلة */}
//           {/* <Nav className="ms-3 d-flex align-items-center flex-wrap"> */}
//             {!loading && (
//               user ? (
//                 // 🔥 المستخدم مسجل الدخول - تظهر السلة وأزرار البروفايل
//                 <>
//                   {/* زر السلة */}
//                   <Nav.Link 
//                     as={Link} 
//                     href="/cart" 
//                     className="position-relative mx-2" 
//                     onClick={closeNavbar}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     🛒 السلة
//                     {totalItems > 0 && (
//                       <Badge 
//                         bg="danger" 
//                         className="position-absolute top-0 start-100 translate-middle"
//                         style={{ fontSize: '0.5rem',  borderRadius: '100%'}}
//                       >
//                         {totalItems}
//                       </Badge>
//                     )}
//                   </Nav.Link>

//                   {/* زر البروفايل وتسجيل الخروج */}
//                   <Nav.Link 
//                     as={Link} 
//                     href="/profile" 
//                     className="text-dark mx-2" 
//                     onClick={closeNavbar}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     👤 {user.email?.split('@')[0]}
//                     {/* 👤 {user.full_name} */}
//                   </Nav.Link>
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={() => {
//                       handleSignOut();
//                       closeNavbar();
//                     }}
//                     size="sm"
//                     className="me-2 my-1"
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     🚪 تسجيل الخروج
//                   </Button>
//                 </>
//               ) : (
//                 // 🔥 المستخدم غير مسجل الدخول - تظهر فقط أزرار التسجيل
//                 <>
//                   <Button 
//                     variant="success" 
//                     href="/auth/signin" 
//                     onClick={() => {
//                       handleSignin();
//                       closeNavbar();
//                     }}
//                     size="sm"
//                     className="me-2 my-1"
//                     as={Link}
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     🔓 تسجيل الدخول
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     href="/registration" 
//                     size="sm"
//                     as={Link}
//                     onClick={closeNavbar}
//                     className="my-1"
//                     style={{ whiteSpace: 'nowrap' }}
//                   >
//                     📝 إنشاء حساب
//                   </Button>
//                 </>
//               )
//             )}
//           {/* </Nav> */}

//           {/* اللغة */}
//           <div className="me-3 mt-2 mt-lg-0" onClick={closeNavbar}>
//             <Image
//               src="/egypt-flag.png"
//               alt="AR"
//               width={32}
//               height={20}
//               style={{ 
//                 cursor: "pointer", 
//                 marginRight: "10px",
//                 borderRadius: '2px'
//               }}
//             />
//             <Image
//               src="/usa-flag.png"
//               alt="EN"
//               width={32}
//               height={20}
//               style={{ 
//                 cursor: "pointer",
//                 borderRadius: '2px'
//               }}
//             />
//           </div>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// ناف بار بتاع البوتستراب 
// "use client";
// import React, { useState, useEffect } from "react";
// import { Navbar, Nav, Container, NavDropdown, Badge, Button } from "react-bootstrap";
// import Link from "next/link";
// import Image from "next/image";
// import { supabase } from "/lib/supabaseClient"; 

// export default function NavigationBar() {
//   const [totalItems, setTotalItems] = useState(0);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 جلب بيانات المستخدم
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     getUser();

//     // الاستماع لتغييرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // 🔥 تحديث السلة
//   useEffect(() => {
//     const updateCart = () => {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//       const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setTotalItems(itemsCount);
//     };

//     updateCart();
//     const interval = setInterval(updateCart, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // 🔥 تسجيل الخروج
//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSignin = async () => {
//     try {
//         // حفظ الصفحة الحالية قبل تسجيل الخروج
//         sessionStorage.setItem("prevPage", window.location.href);
        
//         await supabase.auth.signOut();
//         setUser(null);
        
   
        
//     } catch (error) {
//         console.error('Error signing out:', error);
//     }
// };

//   return (
//     <Navbar bg="light" expand="lg" className="shadow-sm fixed-top">
//       <Container>
//         <Navbar.Brand as={Link} href="/">
//           <Image src="/logo.png" alt="Logo" width={50} height={50} />
//         </Navbar.Brand>

//         <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle"/>
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Nav.Link as={Link} href="/">الرئيسية</Nav.Link>
//             <Nav.Link as={Link} href="/about">من نحن</Nav.Link>
//             <Nav.Link as={Link} href="/contact">اتصل بنا</Nav.Link>
//             <Nav.Link as={Link} href="/articles">المقالات</Nav.Link>

//             <NavDropdown title="الأسعار" id="prices-dropdown">
//               <NavDropdown.Item as={Link} href="/prices/gold">أسعار الذهب</NavDropdown.Item>
//               <NavDropdown.Item as={Link} href="/prices/currency">أسعار الصرف</NavDropdown.Item>
//               <NavDropdown.Item as={Link} href="/prices/poultry">بورصة الدواجن</NavDropdown.Item>
//               <NavDropdown.Item as={Link} href="/prices/materials">أسعار الخامات</NavDropdown.Item>
//               <NavDropdown.Item as={Link} href="/prices/feeds">اسعار الاعلاف</NavDropdown.Item>
//             </NavDropdown>

//             <Nav.Link as={Link} href="/store">المتجر</Nav.Link>
//           </Nav>

//           {/* 🔥 أزرار المستخدم والسلة */}
//           <Nav className="ms-3 d-flex align-items-center">
//             {!loading && (
//               user ? (
//                 // 🔥 المستخدم مسجل الدخول - تظهر السلة وأزرار البروفايل
//                 <>
//                   {/* زر السلة */}
//                   <Nav.Link as={Link} href="/cart" className="position-relative mx-2">
//                     🛒 السلة
//                     {totalItems > 0 && (
//                       <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
//                         {totalItems}
//                       </Badge>
//                     )}
//                   </Nav.Link>

//                   {/* زر البروفايل وتسجيل الخروج */}
//                   <Nav.Link as={Link} href="/profile" className="text-dark mx-2">
//                     👤 {user.email?.split('@')[0]}
//                   </Nav.Link>
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={handleSignOut}
//                     size="sm"
//                     className="me-2"
//                   >
//                     🚪 تسجيل الخروج
//                   </Button>
//                 </>
//               ) : (
//                 // 🔥 المستخدم غير مسجل الدخول - تظهر فقط أزرار التسجيل
//                 <>
//                   <Button 
//                     variant="success" 
//                     href="/auth/signin" 
//                     onClick={handleSignin}
//                     size="sm"
//                     className="me-2"
//                     as={Link}
//                   >
//                     🔓 تسجيل الدخول
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     href="/registration" 
//                     size="sm"
//                     as={Link}
//                   >
//                     📝 إنشاء حساب
//                   </Button>
//                 </>
//               )
//             )}
//           </Nav>

//           {/* اللغة */}
//           <div className="me-3">
//             <Image
//               src="/egypt-flag.png"
//               alt="AR"
//               width={32}
//               height={20}
//               style={{ cursor: "pointer", marginRight: "10px" }}
//             />
//             <Image
//               src="/usa-flag.png"
//               alt="EN"
//               width={32}
//               height={20}
//               style={{ cursor: "pointer" }}
//             />
//           </div>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }


// توجلير من الجنب

// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   Navbar, 
//   Nav, 
//   Container, 
//   NavDropdown, 
//   Badge, 
//   Button,
//   Offcanvas 
// } from "react-bootstrap";
// import Link from "next/link";
// import Image from "next/image";
// import { supabase } from "/lib/supabaseClient"; 

// export default function NavigationBar() {
//   const [totalItems, setTotalItems] = useState(0);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showOffcanvas, setShowOffcanvas] = useState(false);

//   // 🔥 جلب بيانات المستخدم
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//       setLoading(false);
//     };

//     getUser();

//     // الاستماع لتغييرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // 🔥 تحديث السلة
//   useEffect(() => {
//     const updateCart = () => {
//       const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//       const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
//       setTotalItems(itemsCount);
//     };

//     updateCart();
//     const interval = setInterval(updateCart, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // 🔥 تسجيل الخروج
//   const handleSignOut = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setShowOffcanvas(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleSignin = async () => {
//     try {
//       sessionStorage.setItem("prevPage", window.location.href);
//       await supabase.auth.signOut();
//       setUser(null);
//       setShowOffcanvas(false);
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const handleCloseOffcanvas = () => setShowOffcanvas(false);
//   const handleShowOffcanvas = () => setShowOffcanvas(true);

//   return (
//     <>
//       <Navbar bg="light" expand="lg" className="shadow-sm" dir="rtl">
//         <Container>
//           <Navbar.Brand as={Link} href="/">
//             <Image src="/logo.png" alt="Logo" width={50} height={50} />
//           </Navbar.Brand>

//           {/* زر القائمة الجانبية للشاشات الصغيرة */}
//           <Navbar.Toggle 
//             aria-controls="offcanvas-navbar " 
//             onClick={handleShowOffcanvas}
//             className="d-lg-none border border-0"
//           />

//           {/* القائمة العادية للشاشات الكبيرة */}
//           <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
//             <Nav className="me-auto">
//               <Nav.Link as={Link} href="/">الرئيسية</Nav.Link>
//               <Nav.Link as={Link} href="/about">من نحن</Nav.Link>
//               <Nav.Link as={Link} href="/contact">اتصل بنا</Nav.Link>
//               <Nav.Link as={Link} href="/articles">المقالات</Nav.Link>

//               <NavDropdown title="الأسعار" id="prices-dropdown">
//                 <NavDropdown.Item as={Link} href="/prices/gold">أسعار الذهب</NavDropdown.Item>
//                 <NavDropdown.Item as={Link} href="/prices/currency">أسعار الصرف</NavDropdown.Item>
//                 <NavDropdown.Item as={Link} href="/prices/poultry">بورصة الدواجن</NavDropdown.Item>
//                 <NavDropdown.Item as={Link} href="/prices/materials">أسعار الخامات</NavDropdown.Item>
//                 <NavDropdown.Item as={Link} href="/prices/feeds">اسعار الاعلاف</NavDropdown.Item>
//               </NavDropdown>

//               <Nav.Link as={Link} href="/store">المتجر</Nav.Link>
//             </Nav>

//             {/* 🔥 أزرار المستخدم والسلة */}
//             <Nav className="ms-3 d-flex align-items-center">
//               {!loading && (
//                 user ? (
//                   <>
//                     <Nav.Link as={Link} href="/cart" className="position-relative mx-2">
//                       🛒 السلة
//                       {totalItems > 0 && (
//                         <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
//                           {totalItems}
//                         </Badge>
//                       )}
//                     </Nav.Link>

//                     <Nav.Link as={Link} href="/profile" className="text-dark mx-2">
//                       👤 {user.email?.split('@')[0]}
//                     </Nav.Link>
//                     <Button 
//                       variant="outline-secondary" 
//                       onClick={handleSignOut}
//                       size="sm"
//                       className="me-2"
//                     >
//                       🚪 تسجيل الخروج
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button 
//                       variant="success" 
//                       href="/auth/signin" 
//                       onClick={handleSignin}
//                       size="sm"
//                       className="me-2"
//                       as={Link}
//                     >
//                       🔓 تسجيل الدخول
//                     </Button>
//                     <Button 
//                       variant="outline-primary" 
//                       href="/registration" 
//                       size="sm"
//                       as={Link}
//                     >
//                       📝 إنشاء حساب
//                     </Button>
//                   </>
//                 )
//               )}
//             </Nav>

//             {/* اللغة */}
//             <div className="me-3">
//               <Image
//                 src="/egypt-flag.png"
//                 alt="AR"
//                 width={32}
//                 height={20}
//                 style={{ cursor: "pointer", marginRight: "10px" }}
//               />
//               <Image
//                 src="/usa-flag.png"
//                 alt="EN"
//                 width={32}
//                 height={20}
//                 style={{ cursor: "pointer" }}
//               />
//             </div>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* القائمة الجانبية للشاشات الصغيرة */}
//       <Offcanvas
//         show={showOffcanvas}
//         onHide={handleCloseOffcanvas}
//         placement="end"
//         dir="rtl"
//         className="w-75"
//       >
//         <Offcanvas.Header className="bg-primary text-white p-3">
//           <Offcanvas.Title className="w-100">
//             <div className="d-flex justify-content-between align-items-center w-100">
//               <div className="d-flex align-items-center">
//                 <Image src="/logo.png" alt="Logo" width={40} height={40} className="me-2" />
//                 <span>القائمة</span>
//               </div>
//               <Button 
//                 variant="link" 
//                 onClick={handleCloseOffcanvas} 
//                 className="text-white p-0"
//                 style={{ fontSize: '1.8rem', lineHeight: '1' }}
//               >
//                 ×
//               </Button>
//             </div>
//           </Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body className="p-0">
//           <Nav className="flex-column">
//             <Nav.Link as={Link} href="/" onClick={handleCloseOffcanvas} className="py-3 px-3 border-bottom">
//               🏠 الرئيسية
//             </Nav.Link>
//             <Nav.Link as={Link} href="/about" onClick={handleCloseOffcanvas} className="py-3 px-3 border-bottom">
//               ℹ️ من نحن
//             </Nav.Link>
//             <Nav.Link as={Link} href="/contact" onClick={handleCloseOffcanvas} className="py-3 px-3 border-bottom">
//               📞 اتصل بنا
//             </Nav.Link>
//             <Nav.Link as={Link} href="/articles" onClick={handleCloseOffcanvas} className="py-3 px-3 border-bottom">
//               📰 المقالات
//             </Nav.Link>
            
//             <div className="py-3 px-3 border-bottom bg-light">
//               <h6 className="text-muted mb-2">📊 الأسعار</h6>
//               <Nav className="flex-column">
//                 <Nav.Link as={Link} href="/prices/gold" onClick={handleCloseOffcanvas} className="py-2 px-3">
//                   🟡 أسعار الذهب
//                 </Nav.Link>
//                 <Nav.Link as={Link} href="/prices/currency" onClick={handleCloseOffcanvas} className="py-2 px-3">
//                   💵 أسعار الصرف
//                 </Nav.Link>
//                 <Nav.Link as={Link} href="/prices/poultry" onClick={handleCloseOffcanvas} className="py-2 px-3">
//                   🐔 بورصة الدواجن
//                 </Nav.Link>
//                 <Nav.Link as={Link} href="/prices/materials" onClick={handleCloseOffcanvas} className="py-2 px-3">
//                   🏗️ أسعار الخامات
//                 </Nav.Link>
//                 <Nav.Link as={Link} href="/prices/feeds" onClick={handleCloseOffcanvas} className="py-2 px-3">
//                   🌾 اسعار الاعلاف
//                 </Nav.Link>
//               </Nav>
//             </div>
            
//             <Nav.Link as={Link} href="/store" onClick={handleCloseOffcanvas} className="py-3 px-3 border-bottom">
//               🛍️ المتجر
//             </Nav.Link>

//             {/* 🔥 أزرار المستخدم والسلة في القائمة الجانبية */}
//             <div className="py-3 px-3 border-bottom">
//               {!loading && (
//                 user ? (
//                   <>
//                     <Nav.Link as={Link} href="/cart" onClick={handleCloseOffcanvas} className="d-flex justify-content-between align-items-center py-2">
//                       <span>🛒 السلة</span>
//                       {totalItems > 0 && (
//                         <Badge bg="danger" pill>{totalItems}</Badge>
//                       )}
//                     </Nav.Link>

//                     <Nav.Link as={Link} href="/profile" onClick={handleCloseOffcanvas} className="py-2">
//                       👤 {user.email?.split('@')[0]}
//                     </Nav.Link>
                    
//                     <div className="mt-2">
//                       <Button 
//                         variant="outline-danger" 
//                         onClick={() => {
//                           handleSignOut();
//                           handleCloseOffcanvas();
//                         }}
//                         className="w-100"
//                       >
//                         🚪 تسجيل الخروج
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="mb-2">
//                       <Button 
//                         variant="success" 
//                         href="/auth/signin" 
//                         onClick={() => {
//                           handleSignin();
//                           handleCloseOffcanvas();
//                         }}
//                         className="w-100 mb-2"
//                         as={Link}
//                       >
//                         🔓 تسجيل الدخول
//                       </Button>
//                     </div>
//                     <div>
//                       <Button 
//                         variant="outline-primary" 
//                         href="/registration" 
//                         onClick={handleCloseOffcanvas}
//                         className="w-100"
//                         as={Link}
//                       >
//                         📝 إنشاء حساب
//                       </Button>
//                     </div>
//                   </>
//                 )
//               )}
//             </div>

//             {/* اللغة في القائمة الجانبية */}
//             <div className="py-3 px-3">
//               <h6 className="text-muted mb-3">🌐 اللغة</h6>
//               <div className="d-flex">
//                 <Image
//                   src="/egypt-flag.png"
//                   alt="AR"
//                   width={40}
//                   height={25}
//                   style={{ cursor: "pointer", marginLeft: "10px" }}
//                   className="border rounded"
//                 />
//                 <Image
//                   src="/usa-flag.png"
//                   alt="EN"
//                   width={40}
//                   height={25}
//                   style={{ cursor: "pointer" }}
//                   className="border rounded"
//                 />
//               </div>
//             </div>
//           </Nav>
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }

// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { Navbar, Nav, Container, NavDropdown, Badge, Button } from "react-bootstrap";
// import Link from "next/link";
// import Image from "next/image";
// import { supabase } from "/lib/supabaseClient";

// export default function NavigationBar() {
//   const [totalItems, setTotalItems] = useState(0);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expanded, setExpanded] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false); // حالة جديدة للتحكم في الـ dropdown
//   const dropdownRef = useRef(null);
//   const navbarRef = useRef(null);

//   // إغلاق النافبار عند النقر خارجها
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (navbarRef.current && !navbarRef.current.contains(event.target)) {
//         setExpanded(false);
//       }
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // ... باقي الـ useEffect كما هي ...

//   const toggleNavbar = () => {
//     setExpanded(!expanded);
//   };

//   const closeNavbar = () => {
//     setExpanded(false);
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const closeDropdown = () => {
//     setShowDropdown(false);
//   };

//   return (
//     <Navbar 
//       bg="light" 
//       expand="lg" 
//       className="shadow-sm fixed-top"
//       style={{ zIndex: 1030 }}
//       expanded={expanded}
//       ref={navbarRef}
//     >
//       <Container>
//         <Navbar.Brand as={Link} href="/" onClick={closeNavbar}>
//           <Image src="/logo.png" alt="Logo" width={50} height={50} />
//         </Navbar.Brand>

//         {/* زر القائمة المخصص */}
//         <button
//           className="navbar-toggler"
//           type="button"
//           onClick={toggleNavbar}
//           aria-expanded={expanded}
//           aria-label="Toggle navigation"
//           style={{
//             border: 'none',
//             background: 'transparent',
//             padding: '0.25rem 0.75rem',
//             fontSize: '1.25rem',
//             lineHeight: '1',
//             color: 'rgba(0, 0, 0, 0.55)',
//             cursor: 'pointer'
//           }}
//         >
//           {expanded ? (
//             <span style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'block', width: '30px', height: '30px' }}>
//               ✕
//             </span>
//           ) : (
//             <span style={{ fontSize: '1.8rem', display: 'block', width: '30px', height: '30px' }}>
//               ☰
//             </span>
//           )}
//         </button>

//         <Navbar.Collapse id="basic-navbar-nav" in={expanded}>
//           <Nav className="me-auto">
//             <Nav.Link as={Link} href="/" onClick={closeNavbar}>الرئيسية</Nav.Link>
//             <Nav.Link as={Link} href="/about" onClick={closeNavbar}>من نحن</Nav.Link>
//             <Nav.Link as={Link} href="/contact" onClick={closeNavbar}>اتصل بنا</Nav.Link>
//             <Nav.Link as={Link} href="/articles" onClick={closeNavbar}>المقالات</Nav.Link>

//             {/* حل بديل للـ Dropdown */}
//             <div className="nav-item dropdown" ref={dropdownRef}>
//               <button
//                 className={`nav-link dropdown-toggle ${showDropdown ? 'show' : ''}`}
//                 onClick={toggleDropdown}
//                 style={{
//                   background: 'none',
//                   border: 'none',
//                   color: '#6c757d',
//                   // padding: '0.5rem 1rem',
//                   cursor: 'pointer'
//                 }}
//               >
//                 الأسعار
//               </button>
              
//               <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} 
//                    style={{
//                      position: expanded ? 'static' : 'absolute',
//                      marginTop: expanded ? '0' : '0.125rem'
//                    }}>
//                 <Link className="dropdown-item" href="/prices/gold" onClick={() => { closeNavbar(); closeDropdown(); }}>أسعار الذهب</Link>
//                 <Link className="dropdown-item" href="/prices/currency" onClick={() => { closeNavbar(); closeDropdown(); }}>أسعار الصرف</Link>
//                 <Link className="dropdown-item" href="/prices/poultry" onClick={() => { closeNavbar(); closeDropdown(); }}>بورصة الدواجن</Link>
//                 <Link className="dropdown-item" href="/prices/materials" onClick={() => { closeNavbar(); closeDropdown(); }}>أسعار الخامات</Link>
//                 <Link className="dropdown-item" href="/prices/feeds" onClick={() => { closeNavbar(); closeDropdown(); }}>اسعار الاعلاف</Link>
//               </div>
//             </div>

//             <Nav.Link as={Link} href="/store" onClick={closeNavbar}>المتجر</Nav.Link>
//           </Nav>

//           {/* ... باقي الكود كما هو ... */}
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }
