 




// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Alert, 
//   Spinner,
//   Modal,
//   Form,
//   InputGroup
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function CustomerOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const [customerName, setCustomerName] = useState("");
//   const [showVerification, setShowVerification] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [customerOrders, setCustomerOrders] = useState([]);
//   const [verifying, setVerifying] = useState(false); // state جديد للتحقق فقط
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم مسجل بالفعل
//     const savedPhone = localStorage.getItem("customerPhone");
//     const savedName = localStorage.getItem("customerName");
    
//     if (savedPhone && savedName) {
//       setPhoneNumber(savedPhone);
//       setCustomerName(savedName);
//       setIsVerified(true);
//       setShowVerification(false);
//       fetchCustomerOrders(savedPhone);
//     } else {
//       setLoading(false); // إعادة تعيين loading إذا لم يكن مسجل
//     }
//   }, []);

//   const handleVerification = async () => {
//     if (!phoneNumber.trim()) {
//       setError("الرجاء إدخال رقم الهاتف");
//       return;
//     }

//     // تحقق من صيغة رقم الهاتف
//     const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       setError("⚠️ رقم الهاتف غير صحيح. يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015");
//       return;
//     }

//     try {
//       setVerifying(true);
//       setError(null);

//       // البحث عن الطلبات بهذا الرقم
//       const { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phoneNumber}%`)
//         .order('created_at', { ascending: false });

//       if (fetchError) throw fetchError;

//       if (data && data.length > 0) {
//         // الحصول على اسم العميل من أول طلب
//         const customerNameFromOrder = data[0].customer_name || "عميل";
//         setCustomerName(customerNameFromOrder);
//         setCustomerOrders(data);
//         setIsVerified(true);
//         setShowVerification(false);
        
//         // حفظ في localStorage
//         localStorage.setItem("customerPhone", phoneNumber);
//         localStorage.setItem("customerName", customerNameFromOrder);
        
//         // لا نستخدم alert هنا، نعرض رسالة في الواجهة
//         setError(`✅ مرحباً ${customerNameFromOrder}! تم العثور على ${data.length} طلب`);
//         setTimeout(() => setError(null), 3000);
//       } else {
//         setError("❌ لا توجد طلبات مسجلة بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error verifying customer:", error);
//       setError("⚠️ حدث خطأ في التحقق. حاول مرة أخرى.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const fetchCustomerOrders = async (phone) => {
//     try {
//       setLoading(true);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phone}%`)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       setCustomerOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("customerPhone");
//     localStorage.removeItem("customerName");
//     setIsVerified(false);
//     setShowVerification(true);
//     setCustomerOrders([]);
//     setPhoneNumber("");
//     setCustomerName("");
//     setError(null);
//   };

//   const searchOrderById = async () => {
//     if (!searchOrderId.trim()) {
//       setError("الرجاء إدخال رقم الطلب");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('id', `%${searchOrderId}%`)
//         .maybeSingle();

//       if (error) throw error;
      
//       if (data) {
//         // التحقق من أن الطلب يخص هذا العميل
//         if (data.customer_phone === phoneNumber || 
//             data.customer_phone?.includes(phoneNumber)) {
//           setSelectedOrder(data);
//           setShowOrderModal(true);
//           setSearchOrderId("");
//         } else {
//           setError("❌ هذا الطلب لا يخص حسابك");
//         }
//       } else {
//         setError("❌ لا يوجد طلب بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error searching order:", error);
//       setError("⚠️ حدث خطأ في البحث");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'غير محدد';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (!isVerified) {
//     return (
//       <Container className="py-5">
//         <Row className="justify-content-center">
//           <Col md={6} lg={5}>
//             <Card className="shadow">
//               <Card.Header className="text-center bg-primary text-white">
//                 <h4 className="mb-0">🔐 متابعة الطلبات</h4>
//               </Card.Header>
//               <Card.Body className="p-4">
//                 <div className="text-center mb-4">
//                   <div className="mb-3">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#0d6efd" className="bi bi-box-seam" viewBox="0 0 16 16">
//                       <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
//                     </svg>
//                   </div>
//                   <h5>مرحباً بك في خدمة متابعة الطلبات</h5>
//                   <p className="text-muted">أدخل رقم هاتفك لمشاهدة جميع طلباتك</p>
//                 </div>

//                 {error && (
//                   <Alert 
//                     variant={error.includes("✅") ? "success" : "danger"} 
//                     className="text-center"
//                     onClose={() => setError(null)}
//                     dismissible
//                   >
//                     {error}
//                   </Alert>
//                 )}

//                 <Form.Group className="mb-4">
//                   <Form.Label>رقم الهاتف</Form.Label>
//                   <InputGroup>
//                     <InputGroup.Text>📱</InputGroup.Text>
//                     <Form.Control
//                       type="tel"
//                       placeholder="أدخل رقم الهاتف (11 رقماً)"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                       dir="ltr"
//                       maxLength="11"
//                     />
//                   </InputGroup>
//                   <Form.Text className="text-muted">
//                     مثال: 01012345678
//                   </Form.Text>
//                 </Form.Group>

//                 <Button 
//                   variant="primary" 
//                   className="w-100 py-2"
//                   onClick={handleVerification}
//                   disabled={verifying || !phoneNumber.trim()}
//                 >
//                   {verifying ? (
//                     <>
//                       <Spinner size="sm" animation="border" className="me-2" />
//                       جاري التحقق...
//                     </>
//                   ) : (
//                     '🔍 عرض طلباتي'
//                   )}
//                 </Button>

//                 <div className="mt-3 text-center">
//                   <Button 
//                     variant="outline-secondary" 
//                     size="sm"
//                     onClick={() => {
//                       // أرقام تجريبية للاختبار
//                       const testNumbers = ['01012345678', '01198765432', '01234567890'];
//                       const randomPhone = testNumbers[Math.floor(Math.random() * testNumbers.length)];
//                       setPhoneNumber(randomPhone);
//                       setError("📱 رقم تجريبي مضاف. اضغط 'عرض طلباتي' للاختبار.");
//                     }}
//                   >
//                     🧪 استخدام رقم تجريبي
//                   </Button>
//                 </div>

//                 <div className="text-center mt-4">
//                   <small className="text-muted">
//                     لا توجد طلبات؟{" "}
//                     <a href="/" className="text-decoration-none">
//                       تفضل بزيارة متجرنا
//                     </a>
//                   </small>
//                 </div>
//               </Card.Body>
//               <Card.Footer className="text-center bg-light">
//                 <small className="text-muted">
//                   خدمة العملاء: 01234567890
//                 </small>
//               </Card.Footer>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   if (loading && customerOrders.length === 0) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل طلباتك...</p>
//         <Button 
//           variant="outline-secondary" 
//           size="sm"
//           className="mt-3"
//           onClick={() => setLoading(false)}
//         >
//           إلغاء التحميل
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-4">
//       {/* Header */}
//       <Row className="mb-4 align-items-center">
//         <Col md={8}>
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-primary rounded-circle p-3">
//               <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
//                 <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
//                 <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
//               </svg>
//             </div>
//             <div>
//               <h2 className="mb-1">مرحباً، {customerName}</h2>
//               <p className="text-muted mb-0">
//                 📱 {phoneNumber} | 📦 {customerOrders.length} طلب
//               </p>
//             </div>
//           </div>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button 
//             variant="outline-danger" 
//             onClick={handleLogout}
//             size="sm"
//           >
//             🚪 تسجيل الخروج
//           </Button>
//         </Col>
//       </Row>

//       {/* Search Order */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
//           <Row>
//             <Col md={8}>
//               <InputGroup>
//                 <InputGroup.Text>#</InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="أدخل رقم الطلب المكون من 8 أحرف..."
//                   value={searchOrderId}
//                   onChange={(e) => setSearchOrderId(e.target.value)}
//                   dir="ltr"
//                 />
//                 <Button 
//                   variant="primary"
//                   onClick={searchOrderById}
//                   disabled={!searchOrderId.trim() || loading}
//                 >
//                   {loading ? 'جاري البحث...' : 'بحث'}
//                 </Button>
//               </InputGroup>
//               <Form.Text className="text-muted">
//                 رقم الطلب موجود في رسالة التأكيد أو الفاتورة
//               </Form.Text>
//             </Col>
//             <Col md={4} className="text-end">
//               <Button 
//                 variant="outline-primary"
//                 onClick={() => fetchCustomerOrders(phoneNumber)}
//                 disabled={loading}
//               >
//                 {loading ? 'جاري التحديث...' : '🔄 تحديث الطلبات'}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Alert 
//           variant={error.includes("✅") ? "success" : "danger"} 
//           className="mb-4"
//           onClose={() => setError(null)}
//           dismissible
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Loading Indicator when fetching */}
//       {loading && customerOrders.length > 0 && (
//         <Alert variant="info" className="mb-4 text-center">
//           <Spinner size="sm" animation="border" className="me-2" />
//           جاري تحديث البيانات...
//         </Alert>
//       )}

//       {/* بقية الكود كما هو... */}

//             {/* Stats */}
//       <Row className="mb-4">
//         <Col md={3} sm={6}>
//           <Card className="text-center border-primary">
//             <Card.Body>
//               <Card.Title className="text-primary">📦 الكل</Card.Title>
//               <h3>{customerOrders.length}</h3>
//               <small className="text-muted">إجمالي الطلبات</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-warning">
//             <Card.Body>
//               <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
//               <small className="text-muted">طلبات تحت المراجعة</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-info">
//             <Card.Body>
//               <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
//               <small className="text-muted">طلبات قيد التحضير</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-success">
//             <Card.Body>
//               <Card.Title className="text-success">✅ مكتملة</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
//               <small className="text-muted">طلبات تم تسليمها</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Orders List */}
//       {customerOrders.length > 0 ? (
//         <Card className="shadow-sm">
//           <Card.Header className="bg-light">
//             <h5 className="mb-0">📋 جميع طلباتك</h5>
//           </Card.Header>
//           <Card.Body className="p-0">
//             <div className="table-responsive">
//               <Table hover className="mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>رقم الطلب</th>
//                     <th>التاريخ</th>
//                     <th>المنتجات</th>
//                     <th>المبلغ</th>
//                     <th>الحالة</th>
//                     <th>الإجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customerOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>
//                         <strong className="text-primary">
//                           #{order.id?.slice(0, 8).toUpperCase()}
//                         </strong>
//                       </td>
//                       <td>
//                         {formatDate(order.created_at)}
//                       </td>
//                       <td>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(order.items || '[]');
//                             return (
//                               <div>
//                                 <span className="badge bg-secondary me-1">
//                                   {items.length} منتج
//                                 </span>
//                                 <small className="text-muted">
//                                   {items.slice(0, 2).map(item => item.name).join('، ')}
//                                   {items.length > 2 && '...'}
//                                 </small>
//                               </div>
//                             );
//                           } catch {
//                             return <span className="text-muted">لا توجد تفاصيل</span>;
//                           }
//                         })()}
//                       </td>
//                       <td>
//                         <strong className="text-success">
//                           {order.total_price || 0} ج.م
//                         </strong>
//                       </td>
//                       <td>
//                         {getStatusBadge(order.status || 'pending')}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant="outline-primary"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowOrderModal(true);
//                           }}
//                         >
//                           👁️ التفاصيل
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card className="text-center py-5 shadow-sm">
//           <Card.Body>
//             <div className="mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6c757d" className="bi bi-cart-x" viewBox="0 0 16 16">
//                 <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
//                 <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
//               </svg>
//             </div>
//             <h5>لا توجد طلبات</h5>
//             <p className="text-muted mb-4">لم يتم العثور على أي طلبات مسجلة برقم هاتفك</p>
//             <Button 
//               variant="primary"
//               onClick={handleLogout}
//             >
//               🔄 المحاولة برقم هاتف آخر
//             </Button>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Order Details Modal */}
//       <Modal 
//         show={showOrderModal} 
//         onHide={() => setShowOrderModal(false)} 
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             📄 تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8).toUpperCase() || ''}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>👤 معلومات العميل:</h6>
//                   <div className="mb-3">
//                     <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
//                   </div>
//                   <div className="mb-3">
//                     <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <h6>📋 معلومات الطلب:</h6>
//                   <div className="mb-3">
//                     <strong>رقم الطلب:</strong> {selectedOrder.id?.slice(0, 8).toUpperCase()}
//                   </div>
//                   <div className="mb-3">
//                     <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
//                   </div>
//                   <div>
//                     <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
//                   </div>
//                 </Col>
//               </Row>

//               <hr />

//               <h6 className="mb-3">🛒 المنتجات:</h6>
//               {selectedOrder.items ? (
//                 <>
//                   <div className="table-responsive mb-4">
//                     <Table bordered size="sm">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td className="text-success fw-bold">
//                                   {(item.price || 0) * (item.quantity || 0)} ج.م
//                                 </td>
//                               </tr>
//                             ));
//                           } catch {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-muted">
//                                   لا توجد تفاصيل المنتجات
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </div>

//                   <Row className="border-top pt-3">
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>عدد المنتجات:</span>
//                         <strong>
//                           {(() => {
//                             try {
//                               const items = JSON.parse(selectedOrder.items);
//                               return items.length;
//                             } catch {
//                               return 0;
//                             }
//                           })()}
//                         </strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>عدد القطع:</span>
//                         <strong>{selectedOrder.total_items || 0}</strong>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between">
//                         <span>الإجمالي:</span>
//                         <strong className="fs-5 text-success">
//                           {selectedOrder.total_price || 0} ج.م
//                         </strong>
//                       </div>
//                     </Col>
//                   </Row>
//                 </>
//               ) : (
//                 <Alert variant="warning" className="text-center">
//                   لا توجد معلومات عن المنتجات
//                 </Alert>
//               )}

//               {selectedOrder.notes && (
//                 <>
//                   <hr />
//                   <h6>📝 ملاحظات:</h6>
//                   <div className="alert alert-info">
//                     {selectedOrder.notes}
//                   </div>
//                 </>
//               )}

//               {/* Status Timeline */}
            //   <hr />
            //   <h6 className="mb-3">📊 مسار الطلب:</h6>
            //   <div className="timeline">
            //     <div className={`timeline-step ${selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">📝</div>
            //       <div className="timeline-content">
            //         <h6>تم الطلب</h6>
            //         <small>{formatDate(selectedOrder.created_at)}</small>
            //       </div>
            //     </div>
                
              
                
            //     <div className={`timeline-step ${selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🔄</div>
            //       <div className="timeline-content">
            //         <h6>قيد التجهيز</h6>
            //         <small>يتم تحضير الطلب</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🚚</div>
            //       <div className="timeline-content">
            //         <h6>تم الشحن</h6>
            //         <small>الطلب في الطريق إليك</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🎉</div>
            //       <div className="timeline-content">
            //         <h6>تم التسليم</h6>
            //         <small>تم استلام الطلب</small>
            //       </div>
            //     </div>

            //       <div className={`timeline-step ${selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">✅</div>
            //       <div className="timeline-content">
            //         <h6>تم التأكيد</h6>
            //         <small>من قبل الإدارة</small>
            //       </div>
            //     </div>

            //   </div>

            //   <style jsx>{`
            //     .timeline {
            //       display: flex;
            //       justify-content: space-between;
            //       position: relative;
            //       margin: 20px 0;
            //     }
            //     .timeline::before {
            //       content: '';
            //       position: absolute;
            //       top: 25px;
            //       left: 0;
            //       right: 0;
            //       height: 2px;
            //       background: #e9ecef;
            //       z-index: 1;
            //     }
            //     .timeline-step {
            //       position: relative;
            //       z-index: 2;
            //       text-align: center;
            //       flex: 1;
            //       opacity: 0.5;
            //     }
            //     .timeline-step.active {
            //       opacity: 1;
            //     }
            //     .timeline-icon {
            //       width: 50px;
            //       height: 50px;
            //       background: #fff;
            //       border: 2px solid #e9ecef;
            //       border-radius: 50%;
            //       display: flex;
            //       align-items: center;
            //       justify-content: center;
            //       font-size: 20px;
            //       margin: 0 auto 10px;
            //     }
            //     .timeline-step.active .timeline-icon {
            //       border-color: #0d6efd;
            //       background: #0d6efd;
            //       color: white;
            //     }
            //     .timeline-content h6 {
            //       margin: 0;
            //       font-size: 14px;
            //     }
            //     .timeline-content small {
            //       color: #6c757d;
            //       font-size: 12px;
            //     }
            //   `}</style>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             إغلاق
//           </Button>
//           {selectedOrder && (
//             <Button 
//               variant="outline-primary"
//               onClick={() => {
//                 // يمكن إضافة وظيفة الطباعة هنا
//                 alert(`رقم الطلب: ${selectedOrder.id?.slice(0, 8).toUpperCase()}\nيمكنك طباعة هذه الصفحة`);
//               }}
//             >
//               🖨️ طباعة الفاتورة
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Footer Info */}
//       <Card className="mt-4 bg-light border-0">
//         <Card.Body className="text-center">
//           <h6>📞 للاستفسارات:</h6>
//           <p className="mb-2">
//             <strong>خدمة العملاء:</strong> 01234567890
//           </p>
//           <p className="mb-0 text-muted">
//             أوقات العمل: من السبت إلى الخميس، 9 صباحاً - 5 مساءً
//           </p>
//         </Card.Body>
//       </Card>
//     </Container>
         
//   );
// }
 
//very Good//////////////////////////////////////////////////////////
// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Alert, 
//   Spinner,
//   Modal,
//   Form,
//   InputGroup
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function CustomerOrdersPage() {
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true); // تحميل التحقق من المصادقة
//   const [error, setError] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const [customerName, setCustomerName] = useState("");
//   const [showVerification, setShowVerification] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [customerOrders, setCustomerOrders] = useState([]);
//   const [verifying, setVerifying] = useState(false);
//   const router = useRouter();

//   // تعريف الدوال أولاً قبل استخدامها
//   // ========== الدوال الأساسية ==========
//   const fetchCustomerOrders = async (phone) => {
//     try {
//       setLoading(true);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phone}%`)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       setCustomerOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerification = async () => {
//     if (!phoneNumber.trim()) {
//       setError("الرجاء إدخال رقم الهاتف");
//       return;
//     }

//     // تحقق من صيغة رقم الهاتف
//     const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       setError("⚠️ رقم الهاتف غير صحيح. يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015");
//       return;
//     }

//     try {
//       setVerifying(true);
//       setError(null);

//       // البحث عن الطلبات بهذا الرقم
//       const { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phoneNumber}%`)
//         .order('created_at', { ascending: false });

//       if (fetchError) throw fetchError;

//       if (data && data.length > 0) {
//         // الحصول على اسم العميل من أول طلب
//         const customerNameFromOrder = data[0].customer_name || "عميل";
//         setCustomerName(customerNameFromOrder);
//         setCustomerOrders(data);
//         setIsVerified(true);
//         setShowVerification(false);
        
//         // حفظ في localStorage (مثل تسجيل الدخول)
//         localStorage.setItem("customerPhone", phoneNumber);
//         localStorage.setItem("customerName", customerNameFromOrder);
        
//         setError(`✅ مرحباً ${customerNameFromOrder}! تم العثور على ${data.length} طلب`);
//         setTimeout(() => setError(null), 3000);
//       } else {
//         setError("❌ لا توجد طلبات مسجلة بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error verifying customer:", error);
//       setError("⚠️ حدث خطأ في التحقق. حاول مرة أخرى.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   // التحقق من إذا كان العميل مسجل بالفعل (مثل صفحة PDFs)
//   useEffect(() => {
//     const checkCustomerAuth = async () => {
//       try {
//         setAuthLoading(true);
        
//         // التحقق من localStorage أولاً
//         const savedPhone = localStorage.getItem("customerPhone");
//         const savedName = localStorage.getItem("customerName");
        
//         if (!savedPhone || !savedName) {
//           // إذا لم يكن مسجلاً، نعرض شاشة التحقق
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           return;
//         }
        
//         // التحقق من صحة البيانات في قاعدة البيانات
//         const { data, error: fetchError } = await supabase
//           .from('orders')
//           .select('customer_name')
//           .ilike('customer_phone', `%${savedPhone}%`)
//           .limit(1)
//           .maybeSingle();
        
//         if (fetchError) {
//           console.error("Auth error:", fetchError);
//           // إذا حدث خطأ، نمسح البيانات ونعرض شاشة التحقق
//           localStorage.removeItem("customerPhone");
//           localStorage.removeItem("customerName");
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           return;
//         }
        
//         if (!data) {
//           // إذا لم توجد طلبات بهذا الرقم
//           localStorage.removeItem("customerPhone");
//           localStorage.removeItem("customerName");
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           setError("❌ لم يتم العثور على طلبات سابقة بهذا الرقم");
//           return;
//         }
        
//         // العميل مسجل وناجح
//         setPhoneNumber(savedPhone);
//         setCustomerName(savedName);
//         setIsVerified(true);
//         setShowVerification(false);
//         setAuthLoading(false);
        
//         // جلب طلبات العميل
//         fetchCustomerOrders(savedPhone);
        
//       } catch (error) {
//         console.error("Error in customer auth:", error);
//         setIsVerified(false);
//         setShowVerification(true);
//         setAuthLoading(false);
//       }
//     };

//     checkCustomerAuth();
//   }, []);

//   // شاشة يجب التحقق أولاً (مثل صفحة PDFs)
//   if (!isVerified && !authLoading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center py-5">
//           <div className="mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#0d6efd" viewBox="0 0 16 16">
//               <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
//             </svg>
//           </div>
          
//           <h1 className="text-primary mb-3">🔒 متابعة الطلبات</h1>
          
//           <Alert variant="info" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
//             <h4 className="alert-heading">مرحباً بك في خدمة متابعة الطلبات</h4>
//             <p className="mb-0">
//               يجب التحقق من رقم هاتفك أولاً لمشاهدة جميع طلباتك وتفاصيلها
//             </p>
//           </Alert>
          
//           <div className="row justify-content-center mt-4">
//             <div className="col-md-6">
//               <Card className="shadow">
//                 <Card.Body className="p-4">
//                   <div className="text-center mb-4">
//                     <h5>🔐 التحقق برقم الهاتف</h5>
//                     <p className="text-muted">أدخل رقم الهاتف الذي استخدمته في الطلبات السابقة</p>
//                   </div>

//                   {error && (
//                     <Alert 
//                       variant={error.includes("✅") ? "success" : "danger"} 
//                       className="text-center"
//                       onClose={() => setError(null)}
//                       dismissible
//                     >
//                       {error}
//                     </Alert>
//                   )}

//                   <Form.Group className="mb-4">
//                     <Form.Label>رقم الهاتف</Form.Label>
//                     <InputGroup>
//                       <InputGroup.Text>📱</InputGroup.Text>
//                       <Form.Control
//                         type="tel"
//                         placeholder="مثال: 01012345678"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         dir="ltr"
//                         maxLength="11"
//                       />
//                     </InputGroup>
//                     <Form.Text className="text-muted">
//                       يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015
//                     </Form.Text>
//                   </Form.Group>

//                   <Button 
//                     variant="primary" 
//                     className="w-100 py-2"
//                     onClick={handleVerification}
//                     disabled={verifying || !phoneNumber.trim()}
//                   >
//                     {verifying ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحقق...
//                       </>
//                     ) : (
//                       '🔍 التحقق وعرض الطلبات'
//                     )}
//                   </Button>

//                   <div className="text-center mt-4">
//                     <small className="text-muted">
//                       لا توجد طلبات سابقة؟{" "}
//                       <Button 
//                         variant="link" 
//                         className="p-0"
//                         onClick={() => router.push('/')}
//                       >
//                         تفضل بزيارة متجرنا
//                       </Button>
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </div>
//           </div>
          
//           <div className="mt-5 p-4 bg-light rounded">
//             <h5>📦 ماذا يمكنك أن تفعل هنا؟</h5>
//             <Row className="mt-3">
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="primary" className="mb-2">👁️</Badge>
//                   <p>عرض جميع طلباتك السابقة</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="success" className="mb-2">📊</Badge>
//                   <p>متابعة حالة كل طلب</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="info" className="mb-2">🛒</Badge>
//                   <p>معاينة تفاصيل المنتجات</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="warning" className="mb-2">🕒</Badge>
//                   <p>تتبع مسار الطلب خطوة بخطوة</p>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   // شاشة التحميل أثناء التحقق
//   if (authLoading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ التحقق من بياناتك...</p>
//       </Container>
//     );
//   }

//   // دالة تسجيل الخروج (مثل صفحة PDFs)
//   const handleLogout = () => {
//     // مسح بيانات الجلسة
//     localStorage.removeItem("customerPhone");
//     localStorage.removeItem("customerName");
    
//     // إعادة تعيين جميع الحالات
//     setIsVerified(false);
//     setShowVerification(true);
//     setCustomerOrders([]);
//     setPhoneNumber("");
//     setCustomerName("");
//     setError(null);
    
//     // يمكن إضافة رسالة تأكيد
//     alert("✅ تم تسجيل الخروج بنجاح");
//   };

//   // دالة البحث عن طلب محدد
//   const searchOrderById = async () => {
//     if (!searchOrderId.trim()) {
//       setError("الرجاء إدخال رقم الطلب");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('id', `%${searchOrderId}%`)
//         .maybeSingle();

//       if (error) throw error;
      
//       if (data) {
//         // التحقق من أن الطلب يخص هذا العميل
//         if (data.customer_phone === phoneNumber || 
//             data.customer_phone?.includes(phoneNumber)) {
//           setSelectedOrder(data);
//           setShowOrderModal(true);
//           setSearchOrderId("");
//         } else {
//           setError("❌ هذا الطلب لا يخص حسابك");
//         }
//       } else {
//         setError("❌ لا يوجد طلب بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error searching order:", error);
//       setError("⚠️ حدث خطأ في البحث");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // الدوال المساعدة
//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'غير محدد';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // إذا كان العميل مسجلاً ويعمل التحميل
//   if (loading && customerOrders.length === 0) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل طلباتك...</p>
//       </Container>
//     );
//   }

//   // ========== الواجهة الرئيسية بعد التحقق ==========
//   return (
//     <Container className="py-4">
//       {/* Header */}
//       <Row className="mb-4 align-items-center">
//         <Col md={8}>
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-primary rounded-circle p-3">
//               <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
//                 <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
//                 <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
//               </svg>
//             </div>
//             <div>
//               <h2 className="mb-1">مرحباً، {customerName}</h2>
//               <p className="text-muted mb-0">
//                 📱 {phoneNumber} | 📦 {customerOrders.length} طلب
//               </p>
//             </div>
//           </div>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button 
//             variant="outline-danger" 
//             onClick={handleLogout}
//             size="sm"
//           >
//             🚪 تسجيل الخروج
//           </Button>
//         </Col>
//       </Row>

//       {/* Search Order */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
//           <Row>
//             <Col md={8}>
//               <InputGroup>
//                 <InputGroup.Text>#</InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="أدخل رقم الطلب المكون من 8 أحرف..."
//                   value={searchOrderId}
//                   onChange={(e) => setSearchOrderId(e.target.value)}
//                   dir="ltr"
//                 />
//                 <Button 
//                   variant="primary"
//                   onClick={searchOrderById}
//                   disabled={!searchOrderId.trim() || loading}
//                 >
//                   {loading ? 'جاري البحث...' : 'بحث'}
//                 </Button>
//               </InputGroup>
//               <Form.Text className="text-muted">
//                 رقم الطلب موجود في رسالة التأكيد أو الفاتورة
//               </Form.Text>
//             </Col>
//             <Col md={4} className="text-end">
//               <Button 
//                 variant="outline-primary"
//                 onClick={() => fetchCustomerOrders(phoneNumber)}
//                 disabled={loading}
//               >
//                 {loading ? 'جاري التحديث...' : '🔄 تحديث الطلبات'}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Alert 
//           variant={error.includes("✅") ? "success" : "danger"} 
//           className="mb-4"
//           onClose={() => setError(null)}
//           dismissible
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Loading Indicator */}
//       {loading && customerOrders.length > 0 && (
//         <Alert variant="info" className="mb-4 text-center">
//           <Spinner size="sm" animation="border" className="me-2" />
//           جاري تحديث البيانات...
//         </Alert>
//       )}

//       {/* Stats */}
//       <Row className="mb-4">
//         <Col md={3} sm={6}>
//           <Card className="text-center border-primary">
//             <Card.Body>
//               <Card.Title className="text-primary">📦 الكل</Card.Title>
//               <h3>{customerOrders.length}</h3>
//               <small className="text-muted">إجمالي الطلبات</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-warning">
//             <Card.Body>
//               <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
//               <small className="text-muted">طلبات تحت المراجعة</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-info">
//             <Card.Body>
//               <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
//               <small className="text-muted">طلبات قيد التحضير</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-success">
//             <Card.Body>
//               <Card.Title className="text-success">✅ مكتملة</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
//               <small className="text-muted">طلبات تم تسليمها</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Orders List */}
//       {customerOrders.length > 0 ? (
//         <Card className="shadow-sm">
//           <Card.Header className="bg-light">
//             <h5 className="mb-0">📋 جميع طلباتك</h5>
//           </Card.Header>
//           <Card.Body className="p-0">
//             <div className="table-responsive">
//               <Table hover className="mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>رقم الطلب</th>
//                     <th>التاريخ</th>
//                     <th>المنتجات</th>
//                     <th>المبلغ</th>
//                     <th>الحالة</th>
//                     <th>الإجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customerOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>
//                         <strong className="text-primary">
//                           #{order.id?.slice(0, 8).toUpperCase()}
//                         </strong>
//                       </td>
//                       <td>
//                         {formatDate(order.created_at)}
//                       </td>
//                       <td>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(order.items || '[]');
//                             return (
//                               <div>
//                                 <span className="badge bg-secondary me-1">
//                                   {items.length} منتج
//                                 </span>
//                                 <small className="text-muted">
//                                   {items.slice(0, 2).map(item => item.name).join('، ')}
//                                   {items.length > 2 && '...'}
//                                 </small>
//                               </div>
//                             );
//                           } catch {
//                             return <span className="text-muted">لا توجد تفاصيل</span>;
//                           }
//                         })()}
//                       </td>
//                       <td>
//                         <strong className="text-success">
//                           {order.total_price || 0} ج.م
//                         </strong>
//                       </td>
//                       <td>
//                         {getStatusBadge(order.status || 'pending')}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant="outline-primary"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowOrderModal(true);
//                           }}
//                         >
//                           👁️ التفاصيل
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card className="text-center py-5 shadow-sm">
//           <Card.Body>
//             <div className="mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6c757d" viewBox="0 0 16 16">
//                 <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
//                 <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
//               </svg>
//             </div>
//             <h5>لا توجد طلبات</h5>
//             <p className="text-muted mb-4">لم يتم العثور على أي طلبات مسجلة برقم هاتفك</p>
//             <Button 
//               variant="primary"
//               onClick={handleLogout}
//             >
//               🔄 المحاولة برقم هاتف آخر
//             </Button>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Order Details Modal */}
//       <Modal 
//         show={showOrderModal} 
//         onHide={() => setShowOrderModal(false)} 
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             📄 تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8).toUpperCase() || ''}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>👤 معلومات العميل:</h6>
//                   <div className="mb-3">
//                     <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
//                   </div>
//                   <div className="mb-3">
//                     <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <h6>📋 معلومات الطلب:</h6>
//                   <div className="mb-3">
//                     <strong>رقم الطلب:</strong> {selectedOrder.id?.slice(0, 8).toUpperCase()}
//                   </div>
//                   <div className="mb-3">
//                     <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
//                   </div>
//                   <div>
//                     <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
//                   </div>
//                 </Col>
//               </Row>

//               <hr />

//               <h6 className="mb-3">🛒 المنتجات:</h6>
//               {selectedOrder.items ? (
//                 <>
//                   <div className="table-responsive mb-4">
//                     <Table bordered size="sm">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td className="text-success fw-bold">
//                                   {(item.price || 0) * (item.quantity || 0)} ج.م
//                                 </td>
//                               </tr>
//                             ));
//                           } catch {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-muted">
//                                   لا توجد تفاصيل المنتجات
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </div>

//                   <Row className="border-top pt-3">
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>عدد المنتجات:</span>
//                         <strong>
//                           {(() => {
//                             try {
//                               const items = JSON.parse(selectedOrder.items);
//                               return items.length;
//                             } catch {
//                               return 0;
//                             }
//                           })()}
//                         </strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>عدد القطع:</span>
//                         <strong>{selectedOrder.total_items || 0}</strong>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between">
//                         <span>الإجمالي:</span>
//                         <strong className="fs-5 text-success">
//                           {selectedOrder.total_price || 0} ج.م
//                         </strong>
//                       </div>
//                     </Col>
//                   </Row>
//                 </>
//               ) : (
//                 <Alert variant="warning" className="text-center">
//                   لا توجد معلومات عن المنتجات
//                 </Alert>
//               )}

//               {/* Status Timeline */}
//               <hr />
//               <h6 className="mb-3">📊 مسار الطلب:</h6>
            //   <div className="timeline">
            //     <div className={`timeline-step ${selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">📝</div>
            //       <div className="timeline-content">
            //         <h6>تم الطلب</h6>
            //         <small>{formatDate(selectedOrder.created_at)}</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">✅</div>
            //       <div className="timeline-content">
            //         <h6>تم التأكيد</h6>
            //         <small>من قبل الإدارة</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🔄</div>
            //       <div className="timeline-content">
            //         <h6>قيد التجهيز</h6>
            //         <small>يتم تحضير الطلب</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🚚</div>
            //       <div className="timeline-content">
            //         <h6>تم الشحن</h6>
            //         <small>الطلب في الطريق إليك</small>
            //       </div>
            //     </div>
                
            //     <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'active' : ''}`}>
            //       <div className="timeline-icon">🎉</div>
            //       <div className="timeline-content">
            //         <h6>تم التسليم</h6>
            //         <small>تم استلام الطلب</small>
            //       </div>
            //     </div>
            //   </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             إغلاق
//           </Button>
//           {selectedOrder && (
//             <Button 
//               variant="outline-primary"
//               onClick={() => {
//                 alert(`رقم الطلب: ${selectedOrder.id?.slice(0, 8).toUpperCase()}\nيمكنك طباعة هذه الصفحة`);
//               }}
//             >
//               🖨️ طباعة الفاتورة
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Footer Info */}
//       <Card className="mt-4 bg-light border-0">
//         <Card.Body className="text-center">
//           <h6>📞 للاستفسارات:</h6>
//           <p className="mb-2">
//             <strong>خدمة العملاء:</strong> 01234567890
//           </p>
//           <p className="mb-0 text-muted">
//             أوقات العمل: من السبت إلى الخميس، 9 صباحاً - 5 مساءً
//           </p>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// }
//////////////////////////////////




// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Alert, 
//   Spinner,
//   Modal,
//   Form,
//   InputGroup
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function CustomerOrdersPage() {
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isVerified, setIsVerified] = useState(false);
//   const [customerName, setCustomerName] = useState("");
//   const [showVerification, setShowVerification] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [customerOrders, setCustomerOrders] = useState([]);
//   const [verifying, setVerifying] = useState(false);
//   const router = useRouter();

//   // تعريف الدوال أولاً قبل استخدامها
//   const fetchCustomerOrders = async (phone) => {
//     try {
//       setLoading(true);
      
//       // البحث عن الطلبات برقم الهاتف فقط
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phone}%`)
//         .order('created_at', { ascending: false });

//       if (error) {
//         console.error("Supabase error:", error);
//         throw error;
//       }
      
//       console.log("Fetched orders:", data);
//       setCustomerOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerification = async () => {
//     if (!phoneNumber.trim()) {
//       setError("الرجاء إدخال رقم الهاتف");
//       return;
//     }

//     // تحقق من صيغة رقم الهاتف
//     const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       setError("⚠️ رقم الهاتف غير صحيح. يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015");
//       return;
//     }

//     try {
//       setVerifying(true);
//       setError(null);

//       // البحث عن الطلبات بهذا الرقم
//       const { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('customer_phone', `%${phoneNumber}%`)
//         .order('created_at', { ascending: false });

//       if (fetchError) {
//         console.error("Fetch error:", fetchError);
//         throw fetchError;
//       }

//       console.log("Verification data:", data);

//       if (data && data.length > 0) {
//         // الحصول على اسم العميل من أول طلب
//         const customerNameFromOrder = data[0].customer_name || "عميل";
//         setCustomerName(customerNameFromOrder);
//         setCustomerOrders(data);
//         setIsVerified(true);
//         setShowVerification(false);
        
//         // حفظ في localStorage
//         localStorage.setItem("customerPhone", phoneNumber);
//         localStorage.setItem("customerName", customerNameFromOrder);
        
//         setError(`✅ مرحباً ${customerNameFromOrder}! تم العثور على ${data.length} طلب`);
//         setTimeout(() => setError(null), 3000);
//       } else {
//         setError("❌ لا توجد طلبات مسجلة بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error verifying customer:", error);
//       setError("⚠️ حدث خطأ في التحقق. حاول مرة أخرى.");
//     } finally {
//       setVerifying(false);
//     }
//   };

//   // التحقق من إذا كان العميل مسجل بالفعل
//   useEffect(() => {
//     const checkCustomerAuth = async () => {
//       try {
//         setAuthLoading(true);
        
//         // التحقق من localStorage أولاً
//         const savedPhone = localStorage.getItem("customerPhone");
//         const savedName = localStorage.getItem("customerName");
        
//         if (!savedPhone || !savedName) {
//           // إذا لم يكن مسجلاً، نعرض شاشة التحقق
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           return;
//         }
        
//         // التحقق من صحة البيانات في قاعدة البيانات
//         const { data, error: fetchError } = await supabase
//           .from('orders')
//           .select('customer_name')
//           .ilike('customer_phone', `%${savedPhone}%`)
//           .limit(1)
//           .maybeSingle();
        
//         if (fetchError) {
//           console.error("Auth error:", fetchError);
//           // إذا حدث خطأ، نمسح البيانات ونعرض شاشة التحقق
//           localStorage.removeItem("customerPhone");
//           localStorage.removeItem("customerName");
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           return;
//         }
        
//         if (!data) {
//           // إذا لم توجد طلبات بهذا الرقم
//           localStorage.removeItem("customerPhone");
//           localStorage.removeItem("customerName");
//           setIsVerified(false);
//           setShowVerification(true);
//           setAuthLoading(false);
//           setError("❌ لم يتم العثور على طلبات سابقة بهذا الرقم");
//           return;
//         }
        
//         // العميل مسجل وناجح
//         setPhoneNumber(savedPhone);
//         setCustomerName(savedName);
//         setIsVerified(true);
//         setShowVerification(false);
//         setAuthLoading(false);
        
//         // جلب طلبات العميل
//         fetchCustomerOrders(savedPhone);
        
//       } catch (error) {
//         console.error("Error in customer auth:", error);
//         setIsVerified(false);
//         setShowVerification(true);
//         setAuthLoading(false);
//       }
//     };

//     checkCustomerAuth();
//   }, []);

//   // شاشة يجب التحقق أولاً
//   if (!isVerified && !authLoading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center py-5">
//           <div className="mb-4">
//             <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="#0d6efd" viewBox="0 0 16 16">
//               <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
//             </svg>
//           </div>
          
//           <h1 className="text-primary mb-3">🔒 متابعة الطلبات</h1>
          
//           <Alert variant="info" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
//             <h4 className="alert-heading">مرحباً بك في خدمة متابعة الطلبات</h4>
//             <p className="mb-0">
//               يجب التحقق من رقم هاتفك أولاً لمشاهدة جميع طلباتك وتفاصيلها
//             </p>
//           </Alert>
          
//           <div className="row justify-content-center mt-4">
//             <div className="col-md-6">
//               <Card className="shadow">
//                 <Card.Body className="p-4">
//                   <div className="text-center mb-4">
//                     <h5>🔐 التحقق برقم الهاتف</h5>
//                     <p className="text-muted">أدخل رقم الهاتف الذي استخدمته في الطلبات السابقة</p>
//                   </div>

//                   {error && (
//                     <Alert 
//                       variant={error.includes("✅") ? "success" : "danger"} 
//                       className="text-center"
//                       onClose={() => setError(null)}
//                       dismissible
//                     >
//                       {error}
//                     </Alert>
//                   )}

//                   <Form.Group className="mb-4">
//                     <Form.Label>رقم الهاتف</Form.Label>
//                     <InputGroup>
//                       <InputGroup.Text>📱</InputGroup.Text>
//                       <Form.Control
//                         type="tel"
//                         placeholder="مثال: 01012345678"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         dir="ltr"
//                         maxLength="11"
//                       />
//                     </InputGroup>
//                     <Form.Text className="text-muted">
//                       يجب أن يكون 11 رقماً ويبدأ بـ 010 أو 011 أو 012 أو 015
//                     </Form.Text>
//                   </Form.Group>

//                   <Button 
//                     variant="primary" 
//                     className="w-100 py-2"
//                     onClick={handleVerification}
//                     disabled={verifying || !phoneNumber.trim()}
//                   >
//                     {verifying ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحقق...
//                       </>
//                     ) : (
//                       '🔍 التحقق وعرض الطلبات'
//                     )}
//                   </Button>

//                   <div className="text-center mt-4">
//                     <small className="text-muted">
//                       لا توجد طلبات سابقة؟{" "}
//                       <Button 
//                         variant="link" 
//                         className="p-0"
//                         onClick={() => router.push('/')}
//                       >
//                         تفضل بزيارة متجرنا
//                       </Button>
//                     </small>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </div>
//           </div>
          
//           <div className="mt-5 p-4 bg-light rounded">
//             <h5>📦 ماذا يمكنك أن تفعل هنا؟</h5>
//             <Row className="mt-3">
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="primary" className="mb-2">👁️</Badge>
//                   <p>عرض جميع طلباتك السابقة</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="success" className="mb-2">📊</Badge>
//                   <p>متابعة حالة كل طلب</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="info" className="mb-2">🛒</Badge>
//                   <p>معاينة تفاصيل المنتجات</p>
//                 </div>
//               </Col>
//               <Col md={3}>
//                 <div className="text-center p-3">
//                   <Badge bg="warning" className="mb-2">🕒</Badge>
//                   <p>تتبع مسار الطلب خطوة بخطوة</p>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   // شاشة التحميل أثناء التحقق
//   if (authLoading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ التحقق من بياناتك...</p>
//       </Container>
//     );
//   }

//   // دالة تسجيل الخروج
//   const handleLogout = () => {
//     // مسح بيانات الجلسة
//     localStorage.removeItem("customerPhone");
//     localStorage.removeItem("customerName");
    
//     // إعادة تعيين جميع الحالات
//     setIsVerified(false);
//     setShowVerification(true);
//     setCustomerOrders([]);
//     setPhoneNumber("");
//     setCustomerName("");
//     setError(null);
    
//     // يمكن إضافة رسالة تأكيد
//     alert("✅ تم تسجيل الخروج بنجاح");
//   };

//   // دالة البحث عن طلب محدد
//   const searchOrderById = async () => {
//     if (!searchOrderId.trim()) {
//       setError("الرجاء إدخال رقم الطلب");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .ilike('id', `%${searchOrderId}%`)
//         .maybeSingle();

//       if (error) throw error;
      
//       if (data) {
//         // التحقق من أن الطلب يخص هذا العميل
//         if (data.customer_phone === phoneNumber || 
//             data.customer_phone?.includes(phoneNumber)) {
//           setSelectedOrder(data);
//           setShowOrderModal(true);
//           setSearchOrderId("");
//         } else {
//           setError("❌ هذا الطلب لا يخص حسابك");
//         }
//       } else {
//         setError("❌ لا يوجد طلب بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error searching order:", error);
//       setError("⚠️ حدث خطأ في البحث");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // الدوال المساعدة
//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'غير محدد';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // إذا كان العميل مسجلاً ويعمل التحميل
//   if (loading && customerOrders.length === 0) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل طلباتك...</p>
//       </Container>
//     );
//   }

//   // ========== الواجهة الرئيسية بعد التحقق ==========
//   return (
//     <Container className="py-4">
//       {/* Header */}
//       <Row className="mb-4 align-items-center">
//         <Col md={8}>
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-primary rounded-circle p-3">
//               <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
//                 <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
//                 <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
//               </svg>
//             </div>
//             <div>
//               <h2 className="mb-1">مرحباً، {customerName}</h2>
//               <p className="text-muted mb-0">
//                 📱 {phoneNumber} | 📦 {customerOrders.length} طلب
//               </p>
//             </div>
//           </div>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button 
//             variant="outline-danger" 
//             onClick={handleLogout}
//             size="sm"
//           >
//             🚪 تسجيل الخروج
//           </Button>
//         </Col>
//       </Row>

//       {/* Search Order */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
//           <Row>
//             <Col md={8}>
//               <InputGroup>
//                 <InputGroup.Text>#</InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="أدخل رقم الطلب المكون من 8 أحرف..."
//                   value={searchOrderId}
//                   onChange={(e) => setSearchOrderId(e.target.value)}
//                   dir="ltr"
//                 />
//                 <Button 
//                   variant="primary"
//                   onClick={searchOrderById}
//                   disabled={!searchOrderId.trim() || loading}
//                 >
//                   {loading ? 'جاري البحث...' : 'بحث'}
//                 </Button>
//               </InputGroup>
//               <Form.Text className="text-muted">
//                 رقم الطلب موجود في رسالة التأكيد أو الفاتورة
//               </Form.Text>
//             </Col>
//             <Col md={4} className="text-end">
//               <Button 
//                 variant="outline-primary"
//                 onClick={() => fetchCustomerOrders(phoneNumber)}
//                 disabled={loading}
//               >
//                 {loading ? 'جاري التحديث...' : '🔄 تحديث الطلبات'}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Alert 
//           variant={error.includes("✅") ? "success" : "danger"} 
//           className="mb-4"
//           onClose={() => setError(null)}
//           dismissible
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Loading Indicator */}
//       {loading && customerOrders.length > 0 && (
//         <Alert variant="info" className="mb-4 text-center">
//           <Spinner size="sm" animation="border" className="me-2" />
//           جاري تحديث البيانات...
//         </Alert>
//       )}

//       {/* Stats */}
//       <Row className="mb-4">
//         <Col md={3} sm={6}>
//           <Card className="text-center border-primary">
//             <Card.Body>
//               <Card.Title className="text-primary">📦 الكل</Card.Title>
//               <h3>{customerOrders.length}</h3>
//               <small className="text-muted">إجمالي الطلبات</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-warning">
//             <Card.Body>
//               <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
//               <small className="text-muted">طلبات تحت المراجعة</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-info">
//             <Card.Body>
//               <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
//               <small className="text-muted">طلبات قيد التحضير</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3} sm={6}>
//           <Card className="text-center border-success">
//             <Card.Body>
//               <Card.Title className="text-success">✅ مكتملة</Card.Title>
//               <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
//               <small className="text-muted">طلبات تم تسليمها</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Orders List */}
//       {customerOrders.length > 0 ? (
//         <Card className="shadow-sm">
//           <Card.Header className="bg-light">
//             <h5 className="mb-0">📋 جميع طلباتك</h5>
//           </Card.Header>
//           <Card.Body className="p-0">
//             <div className="table-responsive">
//               <Table hover className="mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>رقم الطلب</th>
//                     <th>التاريخ</th>
//                     <th>المنتجات</th>
//                     <th>المبلغ</th>
//                     <th>الحالة</th>
//                     <th>الإجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customerOrders.map((order) => (
//                     <tr key={order.id}>
//                       <td>
//                         <strong className="text-primary">
//                           #{order.id?.slice(0, 8).toUpperCase()}
//                         </strong>
//                       </td>
//                       <td>
//                         {formatDate(order.created_at)}
//                       </td>
//                       <td>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(order.items || '[]');
//                             return (
//                               <div>
//                                 <span className="badge bg-secondary me-1">
//                                   {items.length} منتج
//                                 </span>
//                                 <small className="text-muted">
//                                   {items.slice(0, 2).map(item => item.name).join('، ')}
//                                   {items.length > 2 && '...'}
//                                 </small>
//                               </div>
//                             );
//                           } catch {
//                             return <span className="text-muted">لا توجد تفاصيل</span>;
//                           }
//                         })()}
//                       </td>
//                       <td>
//                         <strong className="text-success">
//                           {order.total_price || 0} ج.م
//                         </strong>
//                       </td>
//                       <td>
//                         {getStatusBadge(order.status || 'pending')}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           variant="outline-primary"
//                           onClick={() => {
//                             setSelectedOrder(order);
//                             setShowOrderModal(true);
//                           }}
//                         >
//                           👁️ التفاصيل
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Card className="text-center py-5 shadow-sm">
//           <Card.Body>
//             <div className="mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#6c757d" viewBox="0 0 16 16">
//                 <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"/>
//                 <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
//               </svg>
//             </div>
//             <h5>لا توجد طلبات</h5>
//             <p className="text-muted mb-4">لم يتم العثور على أي طلبات مسجلة برقم هاتفك</p>
//             <Button 
//               variant="primary"
//               onClick={handleLogout}
//             >
//               🔄 المحاولة برقم هاتف آخر
//             </Button>
//           </Card.Body>
//         </Card>
//       )}

//       {/* Order Details Modal */}
//       <Modal 
//         show={showOrderModal} 
//         onHide={() => setShowOrderModal(false)} 
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             📄 تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8).toUpperCase() || ''}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>👤 معلومات العميل:</h6>
//                   <div className="mb-3">
//                     <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
//                   </div>
//                   <div className="mb-3">
//                     <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <h6>📋 معلومات الطلب:</h6>
//                   <div className="mb-3">
//                     <strong>رقم الطلب:</strong> {selectedOrder.id?.slice(0, 8).toUpperCase()}
//                   </div>
//                   <div className="mb-3">
//                     <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
//                   </div>
//                   <div>
//                     <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
//                   </div>
//                 </Col>
//               </Row>

//               <hr />

//               <h6 className="mb-3">🛒 المنتجات:</h6>
//               {selectedOrder.items ? (
//                 <>
//                   <div className="table-responsive mb-4">
//                     <Table bordered size="sm">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td className="text-success fw-bold">
//                                   {(item.price || 0) * (item.quantity || 0)} ج.م
//                                 </td>
//                               </tr>
//                             ));
//                           } catch {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-muted">
//                                   لا توجد تفاصيل المنتجات
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </div>

//                   <Row className="border-top pt-3">
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>عدد المنتجات:</span>
//                         <strong>
//                           {(() => {
//                             try {
//                               const items = JSON.parse(selectedOrder.items);
//                               return items.length;
//                             } catch {
//                               return 0;
//                             }
//                           })()}
//                         </strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>عدد القطع:</span>
//                         <strong>{selectedOrder.total_items || 0}</strong>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between">
//                         <span>الإجمالي:</span>
//                         <strong className="fs-5 text-success">
//                           {selectedOrder.total_price || 0} ج.م
//                         </strong>
//                       </div>
//                     </Col>
//                   </Row>
//                 </>
//               ) : (
//                 <Alert variant="warning" className="text-center">
//                   لا توجد معلومات عن المنتجات
//                 </Alert>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             إغلاق
//           </Button>
//           {selectedOrder && (
//             <Button 
//               variant="outline-primary"
//               onClick={() => {
//                 alert(`رقم الطلب: ${selectedOrder.id?.slice(0, 8).toUpperCase()}\nيمكنك طباعة هذه الصفحة`);
//               }}
//             >
//               🖨️ طباعة الفاتورة
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }


//// with out editing///////////////////////////////

// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Alert, 
//   Spinner,
//   Modal,
//   Form,
//   InputGroup
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";
// import { FaSignInAlt, FaUserPlus, FaLock, FaUserCircle, FaShoppingBag } from "react-icons/fa";

// export default function CustomerOrdersPage() {
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [customerOrders, setCustomerOrders] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userEmail, setUserEmail] = useState("");
//   const router = useRouter();

//   // التحقق من تسجيل دخول المستخدم
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setAuthLoading(true);
        
//         // جلب جلسة المستخدم الحالية
//         const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
//         if (sessionError) {
//           console.error("Session error:", sessionError);
//           setAuthLoading(false);
//           return;
//         }
        
//         if (!session) {
//           // المستخدم غير مسجل
//           setUser(null);
//           setAuthLoading(false);
//           return;
//         }
        
//         // المستخدم مسجل
//         setUser(session.user);
//         setUserEmail(session.user.email);
        
//         // جلب طلبات المستخدم
//         await fetchCustomerOrders(session.user.id, session.user.email);
        
//       } catch (error) {
//         console.error("Auth error:", error);
//         setError("حدث خطأ في التحقق من المصادقة");
//         setAuthLoading(false);
//       }
//     };

//     checkAuth();
    
//     // الاستماع لتغيرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_IN' && session) {
//           setUser(session.user);
//           setUserEmail(session.user.email);
//           await fetchCustomerOrders(session.user.id, session.user.email);
//         } else if (event === 'SIGNED_OUT') {
//           setUser(null);
//           setCustomerOrders([]);
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // دالة محسنة لجلب طلبات العميل
//   const fetchCustomerOrders = async (userId, email) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("Fetching orders for:", { userId, email });
      
//       // الطريقة 1: البحث بـ user_id أولاً
//       let { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false });

//       // إذا لم نجد طلبات بـ user_id، نبحث بـ email
//       if (!fetchError && (!data || data.length === 0)) {
//         console.log("No orders found with user_id, trying email...");
//         const { data: emailData, error: emailError } = await supabase
//           .from('orders')
//           .select('*')
//           .eq('customer_email', email)
//           .order('created_at', { ascending: false });
          
//         if (emailError) {
//           console.error("Email search error:", emailError);
//         } else if (emailData && emailData.length > 0) {
//           data = emailData;
//         }
//       }

//       if (fetchError) {
//         console.error("Fetch error:", fetchError);
//         throw fetchError;
//       }
      
//       console.log("Fetched orders:", data);
//       setCustomerOrders(data || []);
      
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات. قد لا توجد طلبات مرتبطة بحسابك.");
//     } finally {
//       setLoading(false);
//       setAuthLoading(false);
//     }
//   };

//   // بديل: دالة لجلب الطلبات بكل الطرق الممكنة
//   const fetchCustomerOrdersAlternative = async (userId, email) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("Alternative fetch for:", { userId, email });
      
//       // جلب جميع الطلبات ثم فلترتها يدوياً
//       const { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (fetchError) {
//         console.error("Fetch all error:", fetchError);
//         throw fetchError;
//       }
      
//       if (!data || data.length === 0) {
//         setCustomerOrders([]);
//         return;
//       }
      
//       // فلترة البيانات يدوياً
//       const filteredOrders = data.filter(order => 
//         order.user_id === userId || 
//         order.customer_email === email ||
//         (order.customer_phone && user?.user_metadata?.phone === order.customer_phone)
//       );
      
//       console.log("Filtered orders:", filteredOrders);
//       setCustomerOrders(filteredOrders);
      
//     } catch (error) {
//       console.error("Alternative fetch error:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات");
//     } finally {
//       setLoading(false);
//       setAuthLoading(false);
//     }
//   };

//   // دالة تسجيل الخروج
//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setCustomerOrders([]);
//       setUserEmail("");
//       router.push('/auth/signin?redirect=/customer-orders');
//     } catch (error) {
//       console.error("Logout error:", error);
//       setError("حدث خطأ أثناء تسجيل الخروج");
//     }
//   };

//   // دالة البحث عن طلب محدد - معدلة
//   const searchOrderById = async () => {
//     if (!searchOrderId.trim()) {
//       setError("الرجاء إدخال رقم الطلب");
//       return;
//     }

//     if (!user) {
//       setError("يجب تسجيل الدخول أولاً");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       // البحث بالرقم الدقيق للطلب
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .eq('id', searchOrderId.trim())
//         .maybeSingle();

//       if (error) {
//         console.error("Search error:", error);
//         throw error;
//       }
      
//       if (data) {
//         // التحقق من ملكية الطلب
//         const isUserOrder = 
//           data.user_id === user.id || 
//           data.customer_email === user.email ||
//           (data.customer_phone && user.user_metadata?.phone === data.customer_phone);
        
//         if (isUserOrder) {
//           setSelectedOrder(data);
//           setShowOrderModal(true);
//           setSearchOrderId("");
//         } else {
//           setError("❌ هذا الطلب لا يخص حسابك");
//         }
//       } else {
//         setError("❌ لا يوجد طلب بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error searching order:", error);
//       setError("⚠️ حدث خطأ في البحث. تحقق من صحة رقم الطلب.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ========== شاشة "يجب تسجيل الدخول أولاً" ==========
//   if (!user && !authLoading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center py-5">
//           <div className="mb-4">
//             <FaShoppingBag className="text-primary" style={{ fontSize: "5rem" }} />
//           </div>
          
//           <h1 className="text-primary mb-3">📦 متابعة الطلبات</h1>
          
//           <Alert variant="info" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
//             <h4 className="alert-heading">هذه الصفحة محمية</h4>
//             <p className="mb-0">
//               يجب عليك تسجيل الدخول أولاً لمتابعة طلباتك وتفاصيلها
//             </p>
//           </Alert>
          
//           <div className="row justify-content-center mt-5">
//             <Col md={4} className="mb-3">
//               <Button 
//                 variant="success" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={() => router.push('/auth/signin?redirect=/customer-orders')}
//               >
//                 <FaSignInAlt className="me-2" />
//                 تسجيل الدخول
//               </Button>
//               <p className="text-muted mt-2">لديك حساب بالفعل؟</p>
//             </Col>
            
//             <Col md={4} className="mb-3">
//               <Button 
//                 variant="primary" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={() => router.push('/auth/signup?redirect=/customer-orders')}
//               >
//                 <FaUserPlus className="me-2" />
//               إنشاء حساب     
//          </Button>
//               <p className="text-muted mt-2">ليس لديك حساب؟ سجل الآن</p>
//             </Col>
//           </div>
          
//           {/* <div className="mt-5 p-4 bg-light rounded">
//             <h5>📦 ماذا يمكنك أن تفعل هنا؟</h5>
//             <Row className="mt-3">
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="primary" className="mb-2">👁️</Badge>
//                   <p>عرض جميع طلباتك السابقة</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="success" className="mb-2">📊</Badge>
//                   <p>متابعة حالة كل طلب</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="info" className="mb-2">🛒</Badge>
//                   <p>معاينة تفاصيل المنتجات</p>
//                 </div>
//               </Col>
//             </Row>
//           </div> */}
//         </div>
//       </Container>
//     );
//   }

//   // شاشة التحميل أثناء التحقق
//   if (authLoading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ التحقق من بياناتك...</p>
//       </Container>
//     );
//   }

//   // الدوال المساعدة
//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'غير محدد';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // إذا كان المستخدم مسجلاً ويعمل التحميل
//   if (loading && customerOrders.length === 0) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل طلباتك...</p>
//       </Container>
//     );
//   }

//   // ========== الواجهة الرئيسية بعد تسجيل الدخول ==========
//   return (
//     <Container className="py-4">
//       {/* Header */}
//       <Row className="mb-4 align-items-center">
//         <Col md={8}>
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-primary rounded-circle p-3">
//               <FaUserCircle size={30} color="white" />
//             </div>
//             <div>
//               <h2 className="mb-1">
//                 مرحباً، {user?.user_metadata?.full_name || userEmail?.split('@')[0] || "عزيزي العميل"}
//               </h2>
//               <p className="text-muted mb-0">
//                 📧 {userEmail} | 📦 {customerOrders.length} طلب
//               </p>
//             </div>
//           </div>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button 
//             variant="outline-danger" 
//             onClick={handleLogout}
//             size="sm"
//           >
//             🚪 تسجيل الخروج
//           </Button>
//         </Col>
//       </Row>

//       {/* Search Order */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
//           <Row>
//             <Col md={8}>
//               <InputGroup>
//                 <InputGroup.Text>#</InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="أدخل رقم الطلب (مثال: ord_123...)"
//                   value={searchOrderId}
//                   onChange={(e) => setSearchOrderId(e.target.value)}
//                   dir="ltr"
//                 />
//                 <Button 
//                   variant="primary"
//                   onClick={searchOrderById}
//                   disabled={!searchOrderId.trim() || loading}
//                 >
//                   {loading ? 'جاري البحث...' : 'بحث'}
//                 </Button>
//               </InputGroup>
//               <Form.Text className="text-muted">
//                 رقم الطلب موجود في رسالة التأكيد أو الفاتورة
//               </Form.Text>
//             </Col>
//             <Col md={4} className="text-end">
//               <Button 
//                 variant="outline-primary"
//                 onClick={() => fetchCustomerOrders(user.id, user.email)}
//                 disabled={loading}
//               >
//                 {loading ? 'جاري التحديث...' : '🔄 تحديث الطلبات'}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Alert 
//           variant={error.includes("✅") ? "success" : "danger"} 
//           className="mb-4"
//           onClose={() => setError(null)}
//           dismissible
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Debug Info (يمكن إزالته في الإنتاج) */}
//       {process.env.NODE_ENV === 'development' && user && (
//         <Alert variant="secondary" className="mb-3">
//           <small>
//             <strong>Debug Info:</strong><br />
//             User ID: {user.id}<br />
//             Email: {user.email}<br />
//             Orders Found: {customerOrders.length}
//           </small>
//         </Alert>
//       )}

//       {/* Loading Indicator */}
//       {loading && customerOrders.length > 0 && (
//         <Alert variant="info" className="mb-4 text-center">
//           <Spinner size="sm" animation="border" className="me-2" />
//           جاري تحديث البيانات...
//         </Alert>
//       )}

//       {/* Orders List */}
//       {customerOrders.length > 0 ? (
//         <>
//           {/* Stats */}
//           <Row className="mb-4">
//             <Col md={3} sm={6}>
//               <Card className="text-center border-primary">
//                 <Card.Body>
//                   <Card.Title className="text-primary">📦 الكل</Card.Title>
//                   <h3>{customerOrders.length}</h3>
//                   <small className="text-muted">إجمالي الطلبات</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-warning">
//                 <Card.Body>
//                   <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
//                   <small className="text-muted">طلبات تحت المراجعة</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-info">
//                 <Card.Body>
//                   <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
//                   <small className="text-muted">طلبات قيد التحضير</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-success">
//                 <Card.Body>
//                   <Card.Title className="text-success">✅ مكتملة</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
//                   <small className="text-muted">طلبات تم تسليمها</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Orders Table */}
//           <Card className="shadow-sm">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">📋 جميع طلباتك</h5>
//             </Card.Header>
//             <Card.Body className="p-0">
//               <div className="table-responsive">
//                 <Table hover className="mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>رقم الطلب</th>
//                       <th>التاريخ</th>
//                       <th>المنتجات</th>
//                       <th>المبلغ</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {customerOrders.map((order) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong className="text-primary">
//                             {order.order_number || `#${order.id?.slice(-8)}`}
//                           </strong>
//                         </td>
//                         <td>{formatDate(order.created_at)}</td>
//                         <td>
//                           {(() => {
//                             try {
//                               if (!order.items) return <span className="text-muted">لا توجد تفاصيل</span>;
                              
//                               const items = typeof order.items === 'string' 
//                                 ? JSON.parse(order.items) 
//                                 : order.items;
                              
//                               return (
//                                 <div>
//                                   <Badge bg="secondary" className="me-1">
//                                     {items.length} منتج
//                                   </Badge>
//                                   <small className="text-muted">
//                                     {items.slice(0, 2).map(item => item.name).join('، ')}
//                                     {items.length > 2 && '...'}
//                                   </small>
//                                 </div>
//                               );
//                             } catch {
//                               return <span className="text-muted">لا توجد تفاصيل</span>;
//                             }
//                           })()}
//                         </td>
//                         <td>
//                           <strong className="text-success">
//                             {order.total_price ? `${order.total_price} ج.م` : '0 ج.م'}
//                           </strong>
//                         </td>
//                         <td>{getStatusBadge(order.status || 'pending')}</td>
//                         <td>
//                           <Button
//                             size="sm"
//                             variant="outline-primary"
//                             onClick={() => {
//                               setSelectedOrder(order);
//                               setShowOrderModal(true);
//                             }}
//                           >
//                             👁️ التفاصيل
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </>
//       ) : !loading ? (
//         <Card className="text-center py-5 shadow-sm">
//           <Card.Body>
//             <div className="mb-4">
//               <FaShoppingBag size={80} color="#6c757d" />
//             </div>
//             <h5>لا توجد طلبات</h5>
//             <p className="text-muted mb-4">
//               {user ? "لم يتم العثور على أي طلبات في حسابك" : "يجب تسجيل الدخول أولاً"}
//             </p>
//             {user ? (
//               <>
//                 <Button 
//                   variant="primary"
//                   onClick={() => router.push('/')}
//                   className="me-2"
//                 >
//                   🛒 تسوق الآن
//                 </Button>
//                 <Button 
//                   variant="outline-primary"
//                   onClick={() => fetchCustomerOrders(user.id, user.email)}
//                 >
//                   🔄 تحديث
//                 </Button>
//               </>
//             ) : (
//               <Button 
//                 variant="success"
//                 onClick={() => router.push('/auth/signin?redirect=/customer-orders')}
//               >
//                 تسجيل الدخول
//               </Button>
//             )}
//           </Card.Body>
//         </Card>
//       ) : null}

//       {/* Order Details Modal */}
//       <Modal 
//         show={showOrderModal} 
//         onHide={() => setShowOrderModal(false)} 
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             📄 تفاصيل الطلب {selectedOrder?.order_number || `#${selectedOrder?.id?.slice(-8)}`}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>👤 معلومات العميل:</h6>
//                   <div className="mb-2">
//                     <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>البريد:</strong> {selectedOrder.customer_email || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <h6>📋 معلومات الطلب:</h6>
//                   <div className="mb-2">
//                     <strong>رقم الطلب:</strong> {selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}
//                   </div>
//                   <div className="mb-2">
//                     <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
//                   </div>
//                   <div className="mb-2">
//                     <strong>طريقة الدفع:</strong> {selectedOrder.payment_method || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
//                   </div>
//                 </Col>
//               </Row>

//               <hr />

//               <h6 className="mb-3">🛒 المنتجات:</h6>
//               {selectedOrder.items ? (
//                 <>
//                   <div className="table-responsive mb-4">
//                     <Table bordered size="sm">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = typeof selectedOrder.items === 'string'
//                               ? JSON.parse(selectedOrder.items)
//                               : selectedOrder.items;
                            
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || item.product_name || 'منتج'}</td>
//                                 <td>{item.price || item.unit_price || 0} ج.م</td>
//                                 <td>{item.quantity || 1}</td>
//                                 <td className="text-success fw-bold">
//                                   {((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} ج.م
//                                 </td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             console.error("Error parsing items:", error);
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-muted">
//                                   لا توجد تفاصيل المنتجات
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </div>

//                   <Row className="border-top pt-3">
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>عدد المنتجات:</span>
//                         <strong>
//                           {(() => {
//                             try {
//                               const items = typeof selectedOrder.items === 'string'
//                                 ? JSON.parse(selectedOrder.items)
//                                 : selectedOrder.items;
//                               return items.length;
//                             } catch {
//                               return selectedOrder.total_items || 0;
//                             }
//                           })()}
//                         </strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>عدد القطع:</span>
//                         <strong>{selectedOrder.total_items || 0}</strong>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between">
//                         <span>الإجمالي:</span>
//                         <strong className="fs-5 text-success">
//                           {selectedOrder.total_price ? `${selectedOrder.total_price} ج.م` : '0 ج.م'}
//                         </strong>
//                       </div>
//                     </Col>
//                   </Row>
//                 </>
//               ) : (
//                 <Alert variant="warning" className="text-center">
//                   لا توجد معلومات عن المنتجات
//                 </Alert>
//               )}
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             إغلاق
//           </Button>
//           {selectedOrder && (
//             <Button 
//               variant="outline-primary"
//               onClick={() => {
//                 const printContent = `
//                   <h2>فاتورة الطلب ${selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}</h2>
//                   <p><strong>التاريخ:</strong> ${formatDate(selectedOrder.created_at)}</p>
//                   <p><strong>العميل:</strong> ${selectedOrder.customer_name}</p>
//                   <p><strong>المبلغ:</strong> ${selectedOrder.total_price} ج.م</p>
//                   <p><strong>الحالة:</strong> ${selectedOrder.status}</p>
//                 `;
//                 const printWindow = window.open('', '_blank');
//                 printWindow.document.write(printContent);
//                 printWindow.document.close();
//                 printWindow.print();
//               }}
//             >
//               🖨️ طباعة الفاتورة
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }


///////////



// "use client";
// import { useState, useEffect, useCallback } from "react"; // أضيف useCallback
// import { 
//   Container, 
//   Row, 
//   Col, 
//   Card, 
//   Table, 
//   Badge, 
//   Button, 
//   Alert, 
//   Spinner,
//   Modal,
//   Form,
//   InputGroup
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";
// import { FaSignInAlt, FaUserPlus, FaUserCircle, FaShoppingBag } from "react-icons/fa";

// export default function CustomerOrdersPage() {
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderModal, setShowOrderModal] = useState(false);
//   const [searchOrderId, setSearchOrderId] = useState("");
//   const [customerOrders, setCustomerOrders] = useState([]);
//   const [user, setUser] = useState(null);
//   const [userEmail, setUserEmail] = useState("");
//   const router = useRouter();

//   // ✅ دالة handleSignin المطلوبة - محسنة
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
//       setError("حدث خطأ أثناء التحضير لتسجيل الدخول");
//     }
//   }, [router]); // أضيف router كتبعية

//   // التحقق من تسجيل دخول المستخدم
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         setAuthLoading(true);
        
//         // جلب جلسة المستخدم الحالية
//         const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
//         if (sessionError) {
//           console.error("Session error:", sessionError);
//           setAuthLoading(false);
//           return;
//         }
        
//         if (!session) {
//           // المستخدم غير مسجل
//           setUser(null);
//           setAuthLoading(false);
//           return;
//         }
        
//         // المستخدم مسجل
//         setUser(session.user);
//         setUserEmail(session.user.email);
        
//         // جلب طلبات المستخدم
//         await fetchCustomerOrders(session.user.id, session.user.email);
        
//       } catch (error) {
//         console.error("Auth error:", error);
//         setError("حدث خطأ في التحقق من المصادقة");
//         setAuthLoading(false);
//       }
//     };

//     checkAuth();
    
//     // الاستماع لتغيرات حالة المصادقة
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (event === 'SIGNED_IN' && session) {
//           setUser(session.user);
//           setUserEmail(session.user.email);
//           await fetchCustomerOrders(session.user.id, session.user.email);
//         } else if (event === 'SIGNED_OUT') {
//           setUser(null);
//           setCustomerOrders([]);
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   // دالة محسنة لجلب طلبات العميل
//   const fetchCustomerOrders = async (userId, email) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log("Fetching orders for:", { userId, email });
      
//       // الطريقة 1: البحث بـ user_id أولاً
//       let { data, error: fetchError } = await supabase
//         .from('orders')
//         .select('*')
//         .eq('user_id', userId)
//         .order('created_at', { ascending: false });

//       // إذا لم نجد طلبات بـ user_id، نبحث بـ email
//       if (!fetchError && (!data || data.length === 0)) {
//         console.log("No orders found with user_id, trying email...");
//         const { data: emailData, error: emailError } = await supabase
//           .from('orders')
//           .select('*')
//           .eq('customer_email', email)
//           .order('created_at', { ascending: false });
          
//         if (emailError) {
//           console.error("Email search error:", emailError);
//         } else if (emailData && emailData.length > 0) {
//           data = emailData;
//         }
//       }

//       if (fetchError) {
//         console.error("Fetch error:", fetchError);
//         throw fetchError;
//       }
      
//       console.log("Fetched orders:", data);
//       setCustomerOrders(data || []);
      
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("⚠️ حدث خطأ في جلب الطلبات. قد لا توجد طلبات مرتبطة بحسابك.");
//     } finally {
//       setLoading(false);
//       setAuthLoading(false);
//     }
//   };

//   // دالة تسجيل الخروج
//   const handleLogout = async () => {
//     try {
//       await supabase.auth.signOut();
//       setUser(null);
//       setCustomerOrders([]);
//       setUserEmail("");
      
//       // استخدام handleSignin للعودة إلى تسجيل الدخول
//       handleSignin();
//     } catch (error) {
//       console.error("Logout error:", error);
//       setError("حدث خطأ أثناء تسجيل الخروج");
//     }
//   };

//   // دالة البحث عن طلب محدد - معدلة
//   const searchOrderById = async () => {
//     if (!searchOrderId.trim()) {
//       setError("الرجاء إدخال رقم الطلب");
//       return;
//     }

//     if (!user) {
//       setError("يجب تسجيل الدخول أولاً");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
      
//       // البحث بالرقم الدقيق للطلب
//       const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .eq('id', searchOrderId.trim())
//         .maybeSingle();

//       if (error) {
//         console.error("Search error:", error);
//         throw error;
//       }
      
//       if (data) {
//         // التحقق من ملكية الطلب
//         const isUserOrder = 
//           data.user_id === user.id || 
//           data.customer_email === user.email ||
//           (data.customer_phone && user.user_metadata?.phone === data.customer_phone);
        
//         if (isUserOrder) {
//           setSelectedOrder(data);
//           setShowOrderModal(true);
//           setSearchOrderId("");
//         } else {
//           setError("❌ هذا الطلب لا يخص حسابك");
//         }
//       } else {
//         setError("❌ لا يوجد طلب بهذا الرقم");
//       }
//     } catch (error) {
//       console.error("Error searching order:", error);
//       setError("⚠️ حدث خطأ في البحث. تحقق من صحة رقم الطلب.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ========== شاشة "يجب تسجيل الدخول أولاً" ==========
//   if (!user && !authLoading) {
//     return (
//       <Container className="py-5">
//         <div className="text-center py-5">
//           <div className="mb-4">
//             <FaShoppingBag className="text-primary" style={{ fontSize: "5rem" }} />
//           </div>
          
//           <h1 className="text-primary mb-3">📦 متابعة الطلبات</h1>
          
//           <Alert variant="info" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
//             <h4 className="alert-heading">هذه الصفحة محمية</h4>
//             <p className="mb-0">
//               يجب عليك تسجيل الدخول أولاً لمتابعة طلباتك وتفاصيلها
//             </p>
//           </Alert>
          
//           <div className="row justify-content-center mt-5">
//             <Col md={4} className="mb-3">
//               <Button 
//                 variant="success" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={handleSignin} // ✅ استخدم handleSignin هنا
//               >
//                 <FaSignInAlt className="me-2" />
//                 تسجيل الدخول
//               </Button>
//               <p className="text-muted mt-2">لديك حساب بالفعل؟</p>
//             </Col>
            
//             <Col md={4} className="mb-3">
//               <Button 
//                 variant="primary" 
//                 size="lg" 
//                 className="w-100 py-3"
//                 onClick={() => {
//                   sessionStorage.setItem("prevPage", window.location.pathname + window.location.search);
//                   router.pushpush("auth/signin");
//                 }}
//               >
//                 <FaUserPlus className="me-2" />
//                 إنشاء حساب
//               </Button>
//               <p className="text-muted mt-2">ليس لديك حساب؟ سجل الآن</p>
//             </Col>
//           </div>
          
//           <div className="mt-5 p-4 bg-light rounded">
//             <h5>📦 ماذا يمكنك أن تفعل هنا؟</h5>
//             <Row className="mt-3">
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="primary" className="mb-2">👁️</Badge>
//                   <p>عرض جميع طلباتك السابقة</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="success" className="mb-2">📊</Badge>
//                   <p>متابعة حالة كل طلب</p>
//                 </div>
//               </Col>
//               <Col md={4}>
//                 <div className="text-center p-3">
//                   <Badge bg="info" className="mb-2">🛒</Badge>
//                   <p>معاينة تفاصيل المنتجات</p>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </div>
//       </Container>
//     );
//   }

//   // شاشة التحميل أثناء التحقق
//   if (authLoading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ التحقق من بياناتك...</p>
//       </Container>
//     );
//   }

//   // الدوال المساعدة
//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'غير محدد';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('ar-EG', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // إذا كان المستخدم مسجلاً ويعمل التحميل
//   if (loading && customerOrders.length === 0) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل طلباتك...</p>
//       </Container>
//     );
//   }

//   // ========== الواجهة الرئيسية بعد تسجيل الدخول ==========
//   return (
//     <Container className="py-4">
//       {/* Header */}
//       <Row className="mb-4 align-items-center">
//         <Col md={8}>
//           <div className="d-flex align-items-center gap-3">
//             <div className="bg-primary rounded-circle p-3">
//               <FaUserCircle size={30} color="white" />
//             </div>
//             <div>
//               <h2 className="mb-1">
//                 مرحباً، {user?.user_metadata?.full_name || userEmail?.split('@')[0] || "عزيزي العميل"}
//               </h2>
//               <p className="text-muted mb-0">
//                 📧 {userEmail} | 📦 {customerOrders.length} طلب
//               </p>
//             </div>
//           </div>
//         </Col>
//         <Col md={4} className="text-end">
//           <Button 
//             variant="outline-danger" 
//             onClick={handleLogout} // ✅ تستخدم handleSignin تلقائياً
//             size="sm"
//           >
//             🚪 تسجيل الخروج
//           </Button>
//         </Col>
//       </Row>

//       {/* Search Order */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Body>
//           <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
//           <Row>
//             <Col md={8}>
//               <InputGroup>
//                 <InputGroup.Text>#</InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="أدخل رقم الطلب (مثال: ord_123...)"
//                   value={searchOrderId}
//                   onChange={(e) => setSearchOrderId(e.target.value)}
//                   dir="ltr"
//                 />
//                 <Button 
//                   variant="primary"
//                   onClick={searchOrderById}
//                   disabled={!searchOrderId.trim() || loading}
//                 >
//                   {loading ? 'جاري البحث...' : 'بحث'}
//                 </Button>
//               </InputGroup>
//               <Form.Text className="text-muted">
//                 رقم الطلب موجود في رسالة التأكيد أو الفاتورة
//               </Form.Text>
//             </Col>
//             <Col md={4} className="text-end">
//               <Button 
//                 variant="outline-primary"
//                 onClick={() => fetchCustomerOrders(user.id, user.email)}
//                 disabled={loading}
//               >
//                 {loading ? 'جاري التحديث...' : '🔄 تحديث الطلبات'}
//               </Button>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* Error Display */}
//       {error && (
//         <Alert 
//           variant={error.includes("✅") ? "success" : "danger"} 
//           className="mb-4"
//           onClose={() => setError(null)}
//           dismissible
//         >
//           {error}
//         </Alert>
//       )}

//       {/* Debug Info (يمكن إزالته في الإنتاج) */}
//       {process.env.NODE_ENV === 'development' && user && (
//         <Alert variant="secondary" className="mb-3">
//           <small>
//             <strong>Debug Info:</strong><br />
//             User ID: {user.id}<br />
//             Email: {user.email}<br />
//             Orders Found: {customerOrders.length}
//           </small>
//         </Alert>
//       )}

//       {/* Loading Indicator */}
//       {loading && customerOrders.length > 0 && (
//         <Alert variant="info" className="mb-4 text-center">
//           <Spinner size="sm" animation="border" className="me-2" />
//           جاري تحديث البيانات...
//         </Alert>
//       )}

//       {/* Orders List */}
//       {customerOrders.length > 0 ? (
//         <>
//           {/* Stats */}
//           <Row className="mb-4">
//             <Col md={3} sm={6}>
//               <Card className="text-center border-primary">
//                 <Card.Body>
//                   <Card.Title className="text-primary">📦 الكل</Card.Title>
//                   <h3>{customerOrders.length}</h3>
//                   <small className="text-muted">إجمالي الطلبات</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-warning">
//                 <Card.Body>
//                   <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
//                   <small className="text-muted">طلبات تحت المراجعة</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-info">
//                 <Card.Body>
//                   <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
//                   <small className="text-muted">طلبات قيد التحضير</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3} sm={6}>
//               <Card className="text-center border-success">
//                 <Card.Body>
//                   <Card.Title className="text-success">✅ مكتملة</Card.Title>
//                   <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
//                   <small className="text-muted">طلبات تم تسليمها</small>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Orders Table */}
//           <Card className="shadow-sm">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">📋 جميع طلباتك</h5>
//             </Card.Header>
//             <Card.Body className="p-0">
//               <div className="table-responsive">
//                 <Table hover className="mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>رقم الطلب</th>
//                       <th>التاريخ</th>
//                       <th>المنتجات</th>
//                       <th>المبلغ</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {customerOrders.map((order) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong className="text-primary">
//                             {order.order_number || `#${order.id?.slice(-8)}`}
//                           </strong>
//                         </td>
//                         <td>{formatDate(order.created_at)}</td>
//                         <td>
//                           {(() => {
//                             try {
//                               if (!order.items) return <span className="text-muted">لا توجد تفاصيل</span>;
                              
//                               const items = typeof order.items === 'string' 
//                                 ? JSON.parse(order.items) 
//                                 : order.items;
                              
//                               return (
//                                 <div>
//                                   <Badge bg="secondary" className="me-1">
//                                     {items.length} منتج
//                                   </Badge>
//                                   <small className="text-muted">
//                                     {items.slice(0, 2).map(item => item.name).join('، ')}
//                                     {items.length > 2 && '...'}
//                                   </small>
//                                 </div>
//                               );
//                             } catch {
//                               return <span className="text-muted">لا توجد تفاصيل</span>;
//                             }
//                           })()}
//                         </td>
//                         <td>
//                           <strong className="text-success">
//                             {order.total_price ? `${order.total_price} ج.م` : '0 ج.م'}
//                           </strong>
//                         </td>
//                         <td>{getStatusBadge(order.status || 'pending')}</td>
//                         <td>
//                           <Button
//                             size="sm"
//                             variant="outline-primary"
//                             onClick={() => {
//                               setSelectedOrder(order);
//                               setShowOrderModal(true);
//                             }}
//                           >
//                             👁️ التفاصيل
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </>
//       ) : !loading ? (
//         <Card className="text-center py-5 shadow-sm">
//           <Card.Body>
//             <div className="mb-4">
//               <FaShoppingBag size={80} color="#6c757d" />
//             </div>
//             <h5>لا توجد طلبات</h5>
//             <p className="text-muted mb-4">
//               لم يتم العثور على أي طلبات في حسابك
//             </p>
//             <Button 
//               variant="primary"
//               onClick={() => router.push('/')}
//               className="me-2"
//             >
//               🛒 تسوق الآن
//             </Button>
//             <Button 
//               variant="outline-primary"
//               onClick={() => fetchCustomerOrders(user.id, user.email)}
//             >
//               🔄 تحديث
//             </Button>
//           </Card.Body>
//         </Card>
//       ) : null}

//       {/* Order Details Modal */}
//       <Modal 
//         show={showOrderModal} 
//         onHide={() => setShowOrderModal(false)} 
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             📄 تفاصيل الطلب {selectedOrder?.order_number || `#${selectedOrder?.id?.slice(-8)}`}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedOrder && (
//             <>
//               <Row className="mb-4">
//                 <Col md={6}>
//                   <h6>👤 معلومات العميل:</h6>
//                   <div className="mb-2">
//                     <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
//                   </div>
//                   <div className="mb-2">
//                     <strong>البريد:</strong> {selectedOrder.customer_email || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <h6>📋 معلومات الطلب:</h6>
//                   <div className="mb-2">
//                     <strong>رقم الطلب:</strong> {selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}
//                   </div>
//                   <div className="mb-2">
//                     <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
//                   </div>
//                   <div className="mb-2">
//                     <strong>طريقة الدفع:</strong> {selectedOrder.payment_method || 'غير محدد'}
//                   </div>
//                   <div>
//                     <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
//                   </div>
//                 </Col>
//               </Row>

//               <hr />

//               <h6 className="mb-3">🛒 المنتجات:</h6>
//               {selectedOrder.items ? (
//                 <>
//                   <div className="table-responsive mb-4">
//                     <Table bordered size="sm">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = typeof selectedOrder.items === 'string'
//                               ? JSON.parse(selectedOrder.items)
//                               : selectedOrder.items;
                            
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || item.product_name || 'منتج'}</td>
//                                 <td>{item.price || item.unit_price || 0} ج.م</td>
//                                 <td>{item.quantity || 1}</td>
//                                 <td className="text-success fw-bold">
//                                   {((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} ج.م
//                                 </td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             console.error("Error parsing items:", error);
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-muted">
//                                   لا توجد تفاصيل المنتجات
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </div>

//                   <Row className="border-top pt-3">
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between mb-2">
//                         <span>عدد المنتجات:</span>
//                         <strong>
//                           {(() => {
//                             try {
//                               const items = typeof selectedOrder.items === 'string'
//                                 ? JSON.parse(selectedOrder.items)
//                                 : selectedOrder.items;
//                               return items.length;
//                             } catch {
//                               return selectedOrder.total_items || 0;
//                             }
//                           })()}
//                         </strong>
//                       </div>
//                       <div className="d-flex justify-content-between">
//                         <span>عدد القطع:</span>
//                         <strong>{selectedOrder.total_items || 0}</strong>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="d-flex justify-content-between">
//                         <span>الإجمالي:</span>
//                         <strong className="fs-5 text-success">
//                           {selectedOrder.total_price ? `${selectedOrder.total_price} ج.م` : '0 ج.م'}
//                         </strong>
//                       </div>
//                     </Col>
                 
//                   </Row>

//                 </>
//               ) : (
//                 <Alert variant="warning" className="text-center">
//                   لا توجد معلومات عن المنتجات
//                 </Alert>
//               )}
              //       {/* Status Timeline */}
              //             <hr />
              // <h6 className="mb-3">📊 مسار الطلب:</h6>
              // <div className="timeline">
              //   <div className={`timeline-step ${selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
              //     <div className="timeline-icon">📝</div>
              //     <div className="timeline-content">
              //       <h6>تم الطلب</h6>
              //       <small>{formatDate(selectedOrder.created_at)}</small>
              //     </div>
              //   </div>
                
              
                
              //   <div className={`timeline-step ${selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
              //     <div className="timeline-icon">🔄</div>
              //     <div className="timeline-content">
              //       <h6>قيد التجهيز</h6>
              //       <small>يتم تحضير الطلب</small>
              //     </div>
              //   </div>
                
              //   <div className={`timeline-step ${selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
              //     <div className="timeline-icon">🚚</div>
              //     <div className="timeline-content">
              //       <h6>تم الشحن</h6>
              //       <small>الطلب في الطريق إليك</small>
              //     </div>
              //   </div>
                
              //   <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'active' : ''}`}>
              //     <div className="timeline-icon">🎉</div>
              //     <div className="timeline-content">
              //       <h6>تم التسليم</h6>
              //       <small>تم استلام الطلب</small>
              //     </div>
              //   </div>

              //     <div className={`timeline-step ${selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
              //     <div className="timeline-icon">✅</div>
              //     <div className="timeline-content">
              //       <h6>تم التأكيد</h6>
              //       <small>من قبل الإدارة</small>
              //     </div>
              //   </div>

              // </div>

              // <style jsx>{`
              //   .timeline {
              //     display: flex;
              //     justify-content: space-between;
              //     position: relative;
              //     margin: 20px 0;
              //   }
              //   .timeline::before {
              //     content: '';
              //     position: absolute;
              //     top: 25px;
              //     left: 0;
              //     right: 0;
              //     height: 2px;
              //     background: #e9ecef;
              //     z-index: 1;
              //   }
              //   .timeline-step {
              //     position: relative;
              //     z-index: 2;
              //     text-align: center;
              //     flex: 1;
              //     opacity: 0.5;
              //   }
              //   .timeline-step.active {
              //     opacity: 1;
              //   }
              //   .timeline-icon {
              //     width: 50px;
              //     height: 50px;
              //     background: #fff;
              //     border: 2px solid #e9ecef;
              //     border-radius: 50%;
              //     display: flex;
              //     align-items: center;
              //     justify-content: center;
              //     font-size: 20px;
              //     margin: 0 auto 10px;
              //   }
              //   .timeline-step.active .timeline-icon {
              //     border-color: #0d6efd;
              //     background: #0d6efd;
              //     color: white;
              //   }
              //   .timeline-content h6 {
              //     margin: 0;
              //     font-size: 14px;
              //   }
              //   .timeline-content small {
              //     color: #6c757d;
              //     font-size: 12px;
              //   }
              // `}</style>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
//             إغلاق
//           </Button>
//           {selectedOrder && (
//             <Button 
//               variant="outline-primary"
//               onClick={() => {
//                 const printContent = `
//                   <h2>فاتورة الطلب ${selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}</h2>
//                   <p><strong>التاريخ:</strong> ${formatDate(selectedOrder.created_at)}</p>
//                   <p><strong>العميل:</strong> ${selectedOrder.customer_name}</p>
//                   <p><strong>المبلغ:</strong> ${selectedOrder.total_price} ج.م</p>
//                   <p><strong>الحالة:</strong> ${selectedOrder.status}</p>
//                 `;
//                 const printWindow = window.open('', '_blank');
//                 printWindow.document.write(printContent);
//                 printWindow.document.close();
//                 printWindow.print();
//               }}
//             >
//               🖨️ طباعة الفاتورة
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }




// /app/orders/page.js
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Alert, 
  Spinner,
  Modal,
  Form,
  InputGroup
} from "react-bootstrap";
import { supabase } from '/lib/supabaseClient';
import { useRouter } from "next/navigation";
import { 
  FaSignInAlt, 
  FaUserPlus, 
  FaUserCircle, 
  FaShoppingBag, 
  FaSearch,
  FaSync,
  FaEye,
  FaPrint,
  FaShoppingCart,
  FaHome
} from "react-icons/fa";

export default function CustomerOrdersPage() {
  const { user, loading: authLoading, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [customerOrders, setCustomerOrders] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  // دالة تسجيل الدخول
  const handleSignin = useCallback(() => {
    localStorage.setItem("prevPage", window.location.pathname + window.location.search);
    router.push("/auth/signin");
  }, [router]);

  // جلب طلبات المستخدم
  const fetchCustomerOrders = useCallback(async (userId, email) => {
    if (!userId || !email) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching orders for:", { userId, email });
      
      // البحث بـ user_id
      let { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // إذا لم نجد، نبحث بـ email
      if (!fetchError && (!data || data.length === 0)) {
        console.log("No orders found with user_id, trying email...");
        const { data: emailData, error: emailError } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_email', email)
          .order('created_at', { ascending: false });
          
        if (!emailError && emailData && emailData.length > 0) {
          data = emailData;
        }
      }

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }
      
      console.log("Fetched orders:", data?.length || 0);
      setCustomerOrders(data || []);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("⚠️ حدث خطأ في جلب الطلبات. قد لا توجد طلبات مرتبطة بحسابك.");
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث الطلبات عند تغيير المستخدم
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserEmail(user.email);
      fetchCustomerOrders(user.id, user.email);
    } else {
      setCustomerOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchCustomerOrders]);

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setError("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  // دالة البحث عن طلب
  const searchOrderById = async () => {
    if (!searchOrderId.trim()) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    if (!isAuthenticated) {
      setError("يجب تسجيل الدخول أولاً");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', searchOrderId.trim())
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // التحقق من ملكية الطلب
        const isUserOrder = 
          data.user_id === user.id || 
          data.customer_email === user.email;
        
        if (isUserOrder) {
          setSelectedOrder(data);
          setShowOrderModal(true);
          setSearchOrderId("");
        } else {
          setError("❌ هذا الطلب لا يخص حسابك");
        }
      } else {
        setError("❌ لا يوجد طلب بهذا الرقم");
      }
    } catch (error) {
      console.error("Error searching order:", error);
      setError("⚠️ حدث خطأ في البحث. تحقق من صحة رقم الطلب.");
    } finally {
      setLoading(false);
    }
  };

  // ========== شاشة "يجب تسجيل الدخول أولاً" ==========
  if (!isAuthenticated && !authLoading) {
    return (
      <Container className="py-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <FaShoppingBag className="text-primary" style={{ fontSize: "5rem" }} />
          </div>
          
          <h1 className="text-primary mb-3">📦 متابعة الطلبات</h1>
          
          <Alert variant="info" className="text-center mb-4 mx-auto" style={{ maxWidth: '600px' }}>
            <h4 className="alert-heading">هذه الصفحة محمية</h4>
            <p className="mb-0">
              يجب عليك تسجيل الدخول أولاً لمتابعة طلباتك وتفاصيلها
            </p>
          </Alert>
          
          <div className="row justify-content-center mt-5">
            <Col md={4} className="mb-3">
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
            </Col>
            
            <Col md={4} className="mb-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 py-3"
                onClick={() => {
                  localStorage.setItem("prevPage", window.location.pathname);
                  router.push("/auth/registration");
                }}
              >
                <FaUserPlus className="me-2" />
                إنشاء حساب
              </Button>
              <p className="text-muted mt-2">ليس لديك حساب؟ سجل الآن</p>
            </Col>
          </div>
          
          <div className="mt-5 p-4 bg-light rounded">
            <h5>📦 ماذا يمكنك أن تفعل هنا؟</h5>
            <Row className="mt-3">
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="primary" className="mb-2 p-2" style={{ fontSize: '1.2rem' }}>👁️</Badge>
                  <p>عرض جميع طلباتك السابقة</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="success" className="mb-2 p-2" style={{ fontSize: '1.2rem' }}>📊</Badge>
                  <p>متابعة حالة كل طلب</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3">
                  <Badge bg="info" className="mb-2 p-2" style={{ fontSize: '1.2rem' }}>🛒</Badge>
                  <p>معاينة تفاصيل المنتجات</p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    );
  }

  // شاشة التحميل أثناء التحقق
  if (authLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">جارٍ التحقق من بياناتك...</p>
      </Container>
    );
  }

  // الدوال المساعدة
  const getStatusBadge = (status) => {
    const statuses = {
      pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
      confirmed: { variant: 'success', text: '✅ تم التأكيد' },
      processing: { variant: 'info', text: '🔄 قيد التجهيز' },
      shipped: { variant: 'primary', text: '🚚 تم الشحن' },
      delivered: { variant: 'success', text: '🎉 تم التسليم' },
      cancelled: { variant: 'danger', text: '❌ ملغي' }
    };
    
    const statusInfo = statuses[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // إذا كان المستخدم مسجلاً ويعمل التحميل
  if (loading && customerOrders.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
        <p className="mt-2">جاري تحميل طلباتك...</p>
      </Container>
    );
  }

  // ========== الواجهة الرئيسية بعد تسجيل الدخول ==========
  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col md={8}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary rounded-circle p-3">
              <FaUserCircle size={30} color="white" />
            </div>
            <div>
              <h2 className="mb-1">
                مرحباً، {user?.user_metadata?.full_name || userEmail?.split('@')[0] || "عزيزي العميل"}
              </h2>
              <p className="text-muted mb-0">
                📧 {userEmail} | 📦 {customerOrders.length} طلب
              </p>
            </div>
          </div>
        </Col>
        <Col md={4} className="text-end">
          <div className="d-flex gap-2 justify-content-end">
            <Button 
              variant="outline-primary"
              onClick={() => router.push("/")}
              size="sm"
            >
              <FaHome className="me-1" /> الرئيسية
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
              size="sm"
            >
              🚪 تسجيل الخروج
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search Order */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">🔍 بحث عن طلب محدد</h5>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>#</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم الطلب (مثال: ord_123...)"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  dir="ltr"
                  onKeyPress={(e) => e.key === 'Enter' && searchOrderById()}
                />
                <Button 
                  variant="primary"
                  onClick={searchOrderById}
                  disabled={!searchOrderId.trim() || loading}
                >
                  <FaSearch className="me-2" />
                  {loading ? 'جاري البحث...' : 'بحث'}
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                رقم الطلب موجود في رسالة التأكيد أو الفاتورة
              </Form.Text>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                variant="outline-primary"
                onClick={() => fetchCustomerOrders(user.id, user.email)}
                disabled={loading}
              >
                <FaSync className="me-2" />
                {loading ? 'جاري التحديث...' : 'تحديث الطلبات'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert 
          variant={error.includes("✅") ? "success" : error.includes("❌") ? "danger" : "warning"} 
          className="mb-4"
          onClose={() => setError(null)}
          dismissible
        >
          {error}
        </Alert>
      )}

      {/* Orders List */}
      {customerOrders.length > 0 ? (
        <>
          {/* Stats */}
          <Row className="mb-4">
            <Col md={3} sm={6}>
              <Card className="text-center border-primary">
                <Card.Body>
                  <Card.Title className="text-primary">📦 الكل</Card.Title>
                  <h3>{customerOrders.length}</h3>
                  <small className="text-muted">إجمالي الطلبات</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <Card.Title className="text-warning">🕒 قيد الانتظار</Card.Title>
                  <h3>{customerOrders.filter(o => o.status === 'pending').length}</h3>
                  <small className="text-muted">طلبات تحت المراجعة</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-info">
                <Card.Body>
                  <Card.Title className="text-info">🔄 قيد التجهيز</Card.Title>
                  <h3>{customerOrders.filter(o => o.status === 'processing').length}</h3>
                  <small className="text-muted">طلبات قيد التحضير</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center border-success">
                <Card.Body>
                  <Card.Title className="text-success">✅ مكتملة</Card.Title>
                  <h3>{customerOrders.filter(o => o.status === 'delivered').length}</h3>
                  <small className="text-muted">طلبات تم تسليمها</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Orders Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📋 جميع طلباتك</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>رقم الطلب</th>
                      <th>التاريخ</th>
                      <th>المنتجات</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong className="text-primary">
                            {order.order_number || `#${order.id?.slice(-8)}`}
                          </strong>
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          {(() => {
                            try {
                              if (!order.items) return <span className="text-muted">لا توجد تفاصيل</span>;
                              
                              const items = typeof order.items === 'string' 
                                ? JSON.parse(order.items) 
                                : order.items;
                              
                              return (
                                <div>
                                  <Badge bg="secondary" className="me-1">
                                    {items.length} منتج
                                  </Badge>
                                  <small className="text-muted">
                                    {items.slice(0, 2).map(item => item.name).join('، ')}
                                    {items.length > 2 && '...'}
                                  </small>
                                </div>
                              );
                            } catch {
                              return <span className="text-muted">لا توجد تفاصيل</span>;
                            }
                          })()}
                        </td>
                        <td>
                          <strong className="text-success">
                            {order.total_price ? `${order.total_price} ج.م` : '0 ج.م'}
                          </strong>
                        </td>
                        <td>{getStatusBadge(order.status || 'pending')}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                          >
                            <FaEye className="me-1" />
                            التفاصيل
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      ) : !loading ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <div className="mb-4">
              <FaShoppingBag size={80} color="#6c757d" />
            </div>
            <h5>لا توجد طلبات</h5>
            <p className="text-muted mb-4">
              لم يتم العثور على أي طلبات في حسابك
            </p>
            <Button 
              variant="primary"
              onClick={() => router.push('/')}
              className="me-2"
            >
              <FaShoppingCart className="me-2" />
              تسوق الآن
            </Button>
            <Button 
              variant="outline-primary"
              onClick={() => fetchCustomerOrders(user.id, user.email)}
            >
              <FaSync className="me-2" />
              تحديث
            </Button>
          </Card.Body>
        </Card>
      ) : null}

      {/* Order Details Modal */}
      <Modal 
        show={showOrderModal} 
        onHide={() => setShowOrderModal(false)} 
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            📄 تفاصيل الطلب {selectedOrder?.order_number || `#${selectedOrder?.id?.slice(-8)}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>👤 معلومات العميل:</h6>
                  <div className="mb-2">
                    <strong>الاسم:</strong> {selectedOrder.customer_name || 'غير محدد'}
                  </div>
                  <div className="mb-2">
                    <strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}
                  </div>
                  <div className="mb-2">
                    <strong>البريد:</strong> {selectedOrder.customer_email || 'غير محدد'}
                  </div>
                  <div>
                    <strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}
                  </div>
                </Col>
                <Col md={6}>
                  <h6>📋 معلومات الطلب:</h6>
                  <div className="mb-2">
                    <strong>رقم الطلب:</strong> {selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}
                  </div>
                  <div className="mb-2">
                    <strong>التاريخ:</strong> {formatDate(selectedOrder.created_at)}
                  </div>
                  <div className="mb-2">
                    <strong>طريقة الدفع:</strong> {selectedOrder.payment_method || 'غير محدد'}
                  </div>
                  <div>
                    <strong>الحالة:</strong> {getStatusBadge(selectedOrder.status)}
                  </div>
                </Col>
              </Row>

              <hr />

              <h6 className="mb-3">🛒 المنتجات:</h6>
              {selectedOrder.items ? (
                <>
                  <div className="table-responsive mb-4">
                    <Table bordered size="sm">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>المنتج</th>
                          <th>السعر</th>
                          <th>الكمية</th>
                          <th>المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          try {
                            const items = typeof selectedOrder.items === 'string'
                              ? JSON.parse(selectedOrder.items)
                              : selectedOrder.items;
                            
                            return items.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name || item.product_name || 'منتج'}</td>
                                <td>{item.price || item.unit_price || 0} ج.م</td>
                                <td>{item.quantity || 1}</td>
                                <td className="text-success fw-bold">
                                  {((item.price || item.unit_price || 0) * (item.quantity || 1)).toFixed(2)} ج.م
                                </td>
                              </tr>
                            ));
                          } catch (error) {
                            console.error("Error parsing items:", error);
                            return (
                              <tr>
                                <td colSpan="5" className="text-center text-muted">
                                  لا توجد تفاصيل المنتجات
                                </td>
                              </tr>
                            );
                          }
                        })()}
                      </tbody>
                    </Table>
                  </div>

                  <Row className="border-top pt-3">
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-2">
                        <span>عدد المنتجات:</span>
                        <strong>
                          {(() => {
                            try {
                              const items = typeof selectedOrder.items === 'string'
                                ? JSON.parse(selectedOrder.items)
                                : selectedOrder.items;
                              return items.length;
                            } catch {
                              return selectedOrder.total_items || 0;
                            }
                          })()}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>عدد القطع:</span>
                        <strong>{selectedOrder.total_items || 0}</strong>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex justify-content-between">
                        <span>الإجمالي:</span>
                        <strong className="fs-5 text-success">
                          {selectedOrder.total_price ? `${selectedOrder.total_price} ج.م` : '0 ج.م'}
                        </strong>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <Alert variant="warning" className="text-center">
                  لا توجد معلومات عن المنتجات
                </Alert>
              )}
                 {/* Status Timeline */}
                          <hr />
              <h6 className="mb-3">📊 مسار الطلب:</h6>
              <div className="timeline">
                <div className={`timeline-step ${selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                  <div className="timeline-icon">📝</div>
                  <div className="timeline-content">
                    <h6>تم الطلب</h6>
                    <small>{formatDate(selectedOrder.created_at)}</small>
                  </div>
                </div>
                
              
                
                <div className={`timeline-step ${selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                  <div className="timeline-icon">🔄</div>
                  <div className="timeline-content">
                    <h6>قيد التجهيز</h6>
                    <small>يتم تحضير الطلب</small>
                  </div>
                </div>
                
                <div className={`timeline-step ${selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                  <div className="timeline-icon">🚚</div>
                  <div className="timeline-content">
                    <h6>تم الشحن</h6>
                    <small>الطلب في الطريق إليك</small>
                  </div>
                </div>
                
                <div className={`timeline-step ${selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                  <div className="timeline-icon">🎉</div>
                  <div className="timeline-content">
                    <h6>تم التسليم</h6>
                    <small>تم استلام الطلب</small>
                  </div>
                </div>

                  <div className={`timeline-step ${selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? 'active' : ''}`}>
                  <div className="timeline-icon">✅</div>
                  <div className="timeline-content">
                    <h6>تم التأكيد</h6>
                    <small>من قبل الإدارة</small>
                  </div>
                </div>

              </div>

              <style jsx>{`
                .timeline {
                  display: flex;
                  justify-content: space-between;
                  position: relative;
                  margin: 20px 0;
                }
                .timeline::before {
                  content: '';
                  position: absolute;
                  top: 25px;
                  left: 0;
                  right: 0;
                  height: 2px;
                  background: #e9ecef;
                  z-index: 1;
                }
                .timeline-step {
                  position: relative;
                  z-index: 2;
                  text-align: center;
                  flex: 1;
                  opacity: 0.5;
                }
                .timeline-step.active {
                  opacity: 1;
                }
                .timeline-icon {
                  width: 50px;
                  height: 50px;
                  background: #fff;
                  border: 2px solid #e9ecef;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 20px;
                  margin: 0 auto 10px;
                }
                .timeline-step.active .timeline-icon {
                  border-color: #0d6efd;
                  background: #0d6efd;
                  color: white;
                }
                .timeline-content h6 {
                  margin: 0;
                  font-size: 14px;
                }
                .timeline-content small {
                  color: #6c757d;
                  font-size: 12px;
                }
              `}</style>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            إغلاق
          </Button>
          {selectedOrder && (
            <Button 
              variant="outline-primary"
              onClick={() => {
                const printContent = `
                  <h2>فاتورة الطلب ${selectedOrder.order_number || `#${selectedOrder.id?.slice(-8)}`}</h2>
                  <p><strong>التاريخ:</strong> ${formatDate(selectedOrder.created_at)}</p>
                  <p><strong>العميل:</strong> ${selectedOrder.customer_name}</p>
                  <p><strong>المبلغ:</strong> ${selectedOrder.total_price} ج.م</p>
                  <p><strong>الحالة:</strong> ${selectedOrder.status}</p>
                `;
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printContent);
                printWindow.document.close();
                printWindow.print();
              }}
            >
              <FaPrint className="me-2" />
              طباعة الفاتورة
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}