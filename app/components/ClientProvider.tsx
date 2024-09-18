"use client"; 
import { Provider } from "react-redux";
import store from "../../store/store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchModal from "./SearchModal";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Header />
      <SearchModal />
      <main>
        {children}
        
    </main>
      <Footer />
    </Provider>
  );
}
