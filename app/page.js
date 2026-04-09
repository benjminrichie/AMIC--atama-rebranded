import Image from "next/image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Health from "./components/Health";
import Agriculture from "./components/Agriculture";
import Marketing from "./components/Marketing";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="pt- flex flex-col flex-1 items-center justify-center bg-white font-sans">
        <Hero />
        <Health />
        <Agriculture />
        <Marketing />
        <Footer />
      </div>
    </div>
  );
}
