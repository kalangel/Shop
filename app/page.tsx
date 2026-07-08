import Nav from '@/components/ui/Nav';
import Preloader from '@/components/ui/Preloader';
import Experience from '@/components/sections/Experience';
import Collection from '@/components/sections/Collection';
import Story from '@/components/sections/Story';
import Lookbook from '@/components/sections/Lookbook';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main>
        <Experience />
        <Collection />
        <Story />
        <Lookbook />
        <Footer />
      </main>
    </>
  );
}
