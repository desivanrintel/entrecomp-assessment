import { Titillium_Web } from 'next/font/google';
import './globals.css';
import Navbar from "@/components/Navbar"; // Double-check this path matches your project

const titillium = Titillium_Web({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-titillium',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={titillium.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[#fcfcfd]">
        {/* RESTORE NAVBAR HERE */}
        <Navbar /> 
        
        <main className="flex-grow">
          {children}
          {/* 4. Global Footer acknowledging EntreComp */}
        <footer className="mt-auto py-12 border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-2xl">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight mb-3">
                  Acknowledgement
                </h4>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  This platform and its assessment tools are based on the <strong>EntreComp: The Entrepreneurship Competence Framework</strong>. 
                  EntreComp was developed by the Joint Research Centre (JRC) of the European Commission on behalf of the Directorate-General for Employment, Social Affairs and Inclusion.
                  More specically on the handbook published by EntreComp Europe, "EntreComp: a practical guide".
                  That publication is a partial adaptation of the following document:
McCallum E., Weicht R., McMullan L., Price A., EntreComp into Action: get inspired, make it happen (M. Bacigalupo
& W. O’Keeffe Eds.) , EUR 29105 EN, Publications Office of the European Union, Luxembourg, 2018. ISBN 978-92-
79-79360- 8, doi:10.2760/574864, JRC109128
The original document is reused for this partial translation using authorisation under the Creative Commons
Attribution 4.0 International (CC BY 4.0) licence (https://creativecommons.org/licenses/by/4.0/). The copyright
for this work remains with the copyright holders.
Additionally, the EntreComp framework was originally published in the following document:
Bacigalupo, M., Kampylis, P., Punie, Y., Van den Brande, G. (2016). EntreComp: The Entrepreneurship Competence
Framework. Luxembourg: Publication Office of the European Union; EUR 27939 EN; doi:10.2791/593884
                </p>
              </div>
              
              <div className="flex items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all border-l border-slate-200 pl-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">
                  European <br /> Commission
                </span>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[10px] text-slate-400">
                © European Union, 2016. The EntreComp framework is licensed under CC BY 4.0.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[10px] text-slate-400 hover:text-slate-600 transition">Privacy Policy</a>
                <a href="#" className="text-[10px] text-slate-400 hover:text-slate-600 transition">Terms of Use</a>
              </div>
            </div>
          </div>
        </footer>
        </main>
      </body>
    </html>
  );
}