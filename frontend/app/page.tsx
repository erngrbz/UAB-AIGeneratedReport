"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const router = useRouter();

  const [url, setUrl] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8082/api/haber-analiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      if (!response.ok) {
        throw new Error("Sunucuya bağlanılamadı.");
      }

      const data = await response.json();
      
      const busPlates = data.busPlates || [];
      const busCount = data.busCount || 0;
      const newsDate = data.newsDate || ""; 

      if (busCount === 0) {
        setError("*Kazada otobüs tespit edilememiştir.");
      } else {
        sessionStorage.setItem("analizVerisi", JSON.stringify(busPlates));
        sessionStorage.setItem("otobusSayisi", busCount.toString());
        sessionStorage.setItem("kazaTarihi", newsDate);
        
        router.push("/raporlar");
      }

    } catch (err) {
      console.error(err);
      setError("*Sistemde bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white text-black">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Haber Linki Girin</h1>
          <p className="text-sm text-slate-500">
            Lütfen işlem yapmak istediğiniz haberin tam URL'sini aşağıya yapıştırın.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input 
              type="url" 
              placeholder="https://ornek-haber-sitesi.com/..." 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
              className="w-full bg-white text-black border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="text-sm font-semibold text-red-500 text-center animate-in fade-in zoom-in duration-300">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              "Sonraki Adıma Geç"
            )}
          </Button>
        </form>

      </div>
    </main>
  );
}