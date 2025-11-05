import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";



const poppins = localFont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});

export default function Home() {
  return (
    <main>
      <section className="flex flex-col">
        <div className=" flex justify-start relative">
          <Image  alt="an Image of a vector" src={"/vector.svg"} width={500} height={500} className="mx-auto mt-20 mb-15" priority  />
        </div>
        <div className="flex flex-col gap-5 items-center justify-center">
          <p className={`text-3xl font-bold ${poppins.className}`}>
            The best URL Shortner
          </p>
          <p className=" text-center lg:w-[40%] md:w-[60%]  sm:w-[70%]">
          We are the world&apos;s most straightforward URL shortener. Unlike many other services that track users or require account registration, our platform prioritizes simplicity and privacy. We understand your needs, which is why we&apos;ve designed a hassle-free URL shortener that respects your privacy while delivering a seamless experience.
          </p>
          <div>
            <Link href="/shorten"><button className='bg-purple-500 rounded-lg shadow-lg p-3 py-1 font-bold text-white'>Try Now</button></Link>
          </div>
        </div>

      </section>
    </main>
  );
}