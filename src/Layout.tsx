import SideNav from "./Components/SideNav";
import Header from "./Components/Header";
import ViewInquiries from "./Pages/Inquiry/View";
import InquiryPayment from "./Pages/InquiryPayment";
import ViewUsers from "./Pages/User/View";
import Profile from "./Pages/Profile/Profile";
import CreateInquiryView from "./Pages/Inquiry/CreateView";
import { Route, Routes } from "react-router-dom";
import EditInquiry from "./Pages/Inquiry/EditInquiry";
// import QuoteForm from "./Components/QuoteFormStepOne";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Invoice from "./Components/Invoice";
import { ReferenceDataProvider } from "./Service/ReferenceDataContext";

function Layout() {
  return (
    <>
      <Header />
      <ToastContainer
        transition={Slide}
      />
      <div className="main overflow-x-hidden">
        <div className="w-full items-center flex justify-center font-satoshi">
          <div className="flex flex-row w-5/6 gap-5">
            <SideNav />
            <Routes>
              <Route path="inquiries" element={<ViewInquiries />} />
              <Route path="inquiry/:id" element={<ReferenceDataProvider><EditInquiry /></ReferenceDataProvider>} />
              <Route path="payments" element={<InquiryPayment />} />
              {/* <Route path="inquiry/:id/create-quote" element={<ReferenceDataProvider><QuoteForm/></ReferenceDataProvider>} /> */}
              <Route path="users" element={<ViewUsers />} />
              <Route path="inquiry/:id/invoice" element={<Invoice />} />
              <Route path="profile" element={<Profile />} />
              <Route path="create-inquiry" element={<ReferenceDataProvider><CreateInquiryView /></ReferenceDataProvider>}/>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
