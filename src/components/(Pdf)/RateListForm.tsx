"use client";
import React, { useState } from 'react';

const districts = [
  "सहारनपुर (Saharanpur)", 
 
]; 
const offices = [
  {
    value: "sadar-1",
    label: "सदर प्रथम",
    pdf: "https://drive.google.com/file/d/1twQ_jRjtuF_crYZbJnT1ghZe_2lXns2M/view?usp=drive_link",
  },
  {
    value: "sadar-2",
    label: "सदर द्वितीय",
    pdf: "https://drive.google.com/file/d/1FCcSY_vRRr1Gv27yVxWhuDVc3RVhaTF2/view?usp=drive_link",
  },
  {
    value: "sadar-3",
    label: "सदर तृतीय",
    pdf: "https://drive.google.com/file/d/1E54e3S18JZydNWDbY-aZuinfxQcoLfF6/view?usp=sharing",
  },
  {
    value: "Nakud",
    label: "नकुड़",
    pdf: "https://drive.google.com/file/d/18oQNME6Z_N6BSGnbpgFBr0KUoALaR0mf/view?usp=sharing",
  },
  {
    value: "Deoband",
    label: "देवबंद",
    pdf: "https://drive.google.com/file/d/1x7v5L7PeX1oz5mFmfzrxMJAl2OTkRGQd/view?usp=sharing",
  },
  {
    value: "Behat",
    label: "बेहट",
    pdf: "https://drive.google.com/file/d/1ghrDDa7-h2DmLpMaC5AkoBa4g7MtFRPl/view?usp=sharing",
  },
  {
    value: "Rampur Maniharan",
    label: "रामपुर मनिहारान",
    pdf: "https://drive.google.com/file/d/1rcyDiXAUrsrqb5vi1aJPLMzmYgIY4P9v/view?usp=sharing",
  },
];

export default function RateListForm() {
  const [district, setDistrict] = useState("सहारनपुर");
  const [office, setOffice] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic validation
    if (captchaInput !== "R8K2P") {
      alert("कृपया सही कैप्चा दर्ज करें। (Invalid Captcha)");
      return;
    }

    if (!office) {
      alert("कृपया उप निबंधक कार्यालय चुनें। (Select an office)");
      return;
    }

    // 2. Find the selected office object from the array
    const selectedOffice = offices.find((item) => item.value === office);

    if (!selectedOffice) return;

    alert(`Downloading Rate List for ${district} - ${selectedOffice.label}`);

    // 3. Trigger the PDF link
    const a = document.createElement('a');
    a.href = selectedOffice.pdf;
    a.target = "_blank"; // Opens the PDF in a new tab
    a.rel = "noopener noreferrer"; // Security best practice for target="_blank"
    
    // Appending to body is required for the click to register in some browsers (like Firefox)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <form onSubmit={handleDownload} className="space-y-6">
        
        {/* District Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            जनपद (District):
          </label>
          <select 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Office Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            उप निबंधक कार्यालय (Sub-Registrar Office):
          </label>
          <select 
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">-- चयन करें --</option>
            {/* Dynamically rendering options based on the offices array */}
            {offices.map((sro) => (
              <option key={sro.value} value={sro.value}>
                {sro.value}
              </option>
            ))}
          </select>
        </div>

        {/* Captcha Display */}
        <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold text-slate-400 mb-1">Captcha</span>
            <div className="text-2xl font-mono tracking-widest select-none bg-white px-4 py-2 border rounded shadow-inner line-through decoration-slate-400">
              R8K2P
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setCaptchaInput("")} // Simple clear function for the refresh button
            className="text-blue-600 text-sm hover:underline"
          >
            पुनश्चर्या (Refresh)
          </button>
        </div>

        {/* Captcha Input */}
        <div>
          <input 
            type="text" 
            placeholder="कैप्चा अंकित करें *"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Download Rate List PDF
        </button>
      </form>
    </div>
  );
}