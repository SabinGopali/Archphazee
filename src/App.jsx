  import React, { lazy, Suspense } from 'react';
  import Navbar from './components/Navbar';
  import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
  // import Index from './components/Index';
  import Services from './components/Services';
  import Whyus from './components/Whyus';
  import Testimonial from './components/Testimonial';
  // import Aboutus from './components/Aboutus';
  import Contactus from './components/Contactus';
  import Footer from './components/Footer';
  import SecondaryFooter from './components/SecondaryFooter';
  import Career from './components/Career';
  import ScrollToTop from './components/Scrolltotop';
  import Modal from './components/Modal';
  import Productmodal from './components/Productmodal';
  import Support from './components/Support';
  import Privacynotice from './components/Privacynotice';
  import Termsofuse from './components/Termsofuse';
  import Developmentcenter from './components/Developmentcenter';
  import Privacyrights from './components/privacyrights';
  import Preloader from './components/Preloader';



  const Index = lazy(() => import('./components/Index'));
  const Aboutus = lazy(() => import('./components/Aboutus'));

  export default function App() {
    return (
      <div>
        <Router>
          <ScrollToTop/>
          <Navbar />
          <Suspense fallback={<Preloader/>}>
          <Routes>
            <Route path="/" element={<Index/>}/>
            <Route path="/Aboutus" element={<Aboutus/>}/>
            <Route path="/Contactus" element={<Contactus/>}/>
            <Route path="/Testimonial" element={<Testimonial/>}/>
            <Route path="/Services" element={<Services/>}/>
            <Route path="/Whyus" element={<Whyus/>}/>
            <Route path="/career" element={<Career/>}/>
            <Route path="/modal" element={<Modal/>}/>
            <Route path="/productmodal" element={<Productmodal/>}/>
            <Route path="/support" element={<Support/>}/>
            <Route path="/privacynotice" element={<Privacynotice/>}/>
            <Route path="/termsofuse" element={<Termsofuse/>}/>
            <Route path="/developmentcenter" element={<Developmentcenter/>}/>
            <Route path="/privacyrights" element={<Privacyrights/>}/>
          </Routes>
          
          <SecondaryFooter/>
          <Footer/>
          </Suspense>
        </Router>
      </div>
    )
  }
