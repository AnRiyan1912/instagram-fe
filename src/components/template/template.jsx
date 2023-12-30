import { useState } from 'react';
import { Footer } from '../navigation/footer';
import { Navbar } from '../navigation/navbar';
import { ProfileBar } from '../navigation/profile';
import { SearchBar } from '../navigation/search';
import { ModalPost } from '../post/post-modal';

export const NavTemplate = ({ children }) => {
 return (
  <>
   <Navbar />
   <div className="flex justify-center pb-10 ">
    <div className="mobile">{children}</div>
   </div>
   <Footer />
  </>
 );
};

export const Template = ({ children }) => {
 return (
  <>
   <div className="flex justify-center h-screen bg-white">
    <div className="mobile">{children}</div>
   </div>
  </>
 );
};

export const SearchTemplate = ({ children, doSearch }) => {
 return (
  <>
   <SearchBar doSearch={doSearch} />
   <div className="flex justify-center pb-10">
    <div className="mobile">{children}</div>
   </div>
   <Footer />
  </>
 );
};

export const ProfileTemplate = ({ children }) => {
 const [isOpen, setIsOpen] = useState(false);

 return (
  <>
   <ProfileBar setIsOpen={setIsOpen} />
   <div className="flex justify-center pb-10">
    <div className="mobile">{children}</div>
   </div>
   <Footer />
   <ModalPost isOpen={isOpen} onClose={() => setIsOpen(false)} />
  </>
 );
};

export const ModalTemplate = ({ children, isOpen }) => {
 return (
  <div
   className={` ${
    isOpen ? 'modal-edit-profile fixed w-screen left-0 top-0 z-20' : 'hidden'
   }`}
  >
   {children}
  </div>
 );
};
