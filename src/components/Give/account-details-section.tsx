"use client"

import { useState } from "react"
import { Globe2, Banknote, Copy, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function AccountDetailsSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const accounts = {
    domiciliary: [
      { currency: "USD", code: "5071864023" },
      { currency: "EUR", code: "50810468359" },
      { currency: "GBP", code: "5060474567" },
    ],
    naira: {
      accountName: "RCVG Salvation Centre",
      accountNumber: "1010593681",
    },
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border-2 border-black">
              <Globe2 className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">International Giving</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              Give From
              <br />
              <span className="italic">Anywhere</span>
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-700">
              Your seed knows no borders. God multiplies every gift.
            </p>
          </div>

          {/* Domiciliary Accounts Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {accounts.domiciliary.map((acc, idx) => (
              <Card
                key={acc.currency}
                className={cn(
                  "group relative overflow-hidden border-4 border-black bg-white",
                  "transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
                  "hover:-translate-x-1 hover:-translate-y-1"
                )}
              >
                <div className="p-8">
                  {/* Currency Badge */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-black">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black">{acc.currency}</div>
                      <div className="text-xs uppercase tracking-widest mt-1">Domiciliary</div>
                    </div>
                  </div>

                  {/* Bank Info */}
                  <div className="mb-6 pb-6 border-b-2 border-black">
                    <div className="text-lg font-bold mb-1">RCCG Salvation Centre</div>
                    <div className="text-sm uppercase tracking-wide">Zenith Bank PLC</div>
                  </div>

                  {/* Account Number */}
                  <div className="mb-6">
                    <div className="text-xs uppercase tracking-widest mb-2 font-bold">Account Number</div>
                    <div className="font-mono text-3xl font-black tracking-tight bg-black text-white p-4 text-center">
                      {acc.code}
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(acc.code, acc.currency)}
                    className={cn(
                      "w-full py-4 font-bold uppercase tracking-wider transition-all duration-200",
                      "flex items-center justify-center gap-2",
                      copied === acc.currency
                        ? "bg-black text-white"
                        : "border-2 border-black hover:bg-black hover:text-white"
                    )}
                  >
                    {copied === acc.currency ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copy Account</span>
                      </>
                    )}
                  </button>

                  {copied === acc.currency && (
                    <p className="text-center mt-4 text-sm font-bold animate-pulse">
                      God bless you abundantly! 
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-32">
            <div className="flex-1 h-0.5 bg-black"></div>
            <div className="w-3 h-3 bg-black rotate-45"></div>
            <div className="flex-1 h-0.5 bg-black"></div>
          </div>

          {/* Naira Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border-2 border-black bg-black text-white">
              <Banknote className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Local Giving</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Sow Your Seed
              <br />
              <span className="italic">in Naira</span>
            </h2>
            <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-700">
              Every naira given is a seed planted in good soil.
            </p>
          </div>

          {/* Naira Account Card */}
          <Card className="max-w-4xl mx-auto border-4 border-black bg-black text-white overflow-hidden">
            <div className="p-12 md:p-16">
              {/* Bank Name */}
              <div className="text-center mb-12">
                <div className="inline-block px-6 py-3 bg-white text-black mb-6">
                  <div className="text-2xl font-black uppercase tracking-wider">Zenith Bank PLC</div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-10">
                {/* Account Name */}
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest mb-3 opacity-70">Account Name</div>
                  <div className="text-3xl md:text-4xl font-black">
                    {accounts.naira.accountName}
                  </div>
                </div>

                {/* Account Number */}
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest mb-4 opacity-70">Account Number</div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="font-mono text-5xl md:text-6xl font-black tracking-wider bg-white text-black px-8 py-6 border-4 border-white">
                      {accounts.naira.accountNumber}
                    </div>
                    <button
                      onClick={() => copyToClipboard(accounts.naira.accountNumber, "naira")}
                      className={cn(
                        "p-5 transition-all duration-200 border-4",
                        copied === "naira"
                          ? "bg-white text-black border-white"
                          : "border-white hover:bg-white hover:text-black"
                      )}
                    >
                      {copied === "naira" ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                    </button>
                  </div>
                  {copied === "naira" && (
                    <p className="mt-6 text-xl font-bold animate-pulse">
                      Copied! Your harvest is coming! 
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Scripture Quote */}
          <div className="text-center mt-32 px-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl mb-6">&rdquo;</div>
              <p className="text-2xl md:text-3xl font-bold mb-6 italic">
                Give, and it shall be given unto you...
              </p>
              <div className="w-16 h-0.5 bg-black mx-auto mb-6"></div>
              <p className="text-lg uppercase tracking-widest font-bold">Luke 6:38</p>
              <p className="mt-8 text-lg text-gray-700 max-w-xl mx-auto">
                Thank you for partnering with God&rsquo;s work at RCCG Salvation Centre.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}