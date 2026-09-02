"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Pencil, Calendar as CalendarIcon, FileText, FileDown, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Bus {
    id: number;
    plate: string;
    date: Date | undefined;
}

interface GeneratedReport {
    pdfUrl: string;
    docxUrl: string;
    fileName: string;
}

export default function DetailsPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showReports, setShowReports] = useState(false);
    const [error, setError] = useState("");

    const [buses, setBuses] = useState<Bus[]>([]);
    const [reports, setReports] = useState<GeneratedReport[]>([]);

    useEffect(() => {
        try {
            const storedPlatesStr = sessionStorage.getItem("analizVerisi");
            const storedDateStr = sessionStorage.getItem("kazaTarihi");
            const storedBusCountStr = sessionStorage.getItem("otobusSayisi");

            const busCount = storedBusCountStr ? parseInt(storedBusCountStr, 10) : 0;

            if (!storedBusCountStr || isNaN(busCount) || busCount === 0) {
                router.push("/");
                return;
            }

            let commonDate: Date | undefined = undefined;
            if (storedDateStr && storedDateStr.trim() !== "") {
                commonDate = parseISO(storedDateStr);
            }

            const parsedPlates: string[] = storedPlatesStr ? JSON.parse(storedPlatesStr) : [];

            const initialBuses: Bus[] = Array.from({ length: busCount }, (_, index) => ({
                id: Date.now() + index,
                plate: parsedPlates[index] || "",
                date: commonDate
            }));

            setBuses(initialBuses);
        } catch (error) {
            console.error("Veriler okunurken hata oluştu:", error);
            router.push("/");
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleUpdateBus = (id: number, field: "plate" | "date", value: any) => {
        if (field === "date") {
            setBuses(prevBuses => prevBuses.map(bus => ({ ...bus, date: value })));
        } else {
            const cleanedPlate = typeof value === "string" ? value.replace(/\s+/g, "").toUpperCase() : value;

            setBuses(prevBuses => prevBuses.map(bus =>
                bus.id === id ? { ...bus, plate: cleanedPlate } : bus
            ));
        }
    };

    const isFormValid = buses.every(bus => bus.plate.trim() !== "" && bus.date !== undefined);

    const validatePlateFormat = (plate: string) => {
        const cleanPlate = plate.replace(/\s+/g, "");
        const plateRegex = /^\d{2}[A-Z]+\d+$/;
        return plateRegex.test(cleanPlate);
    };

    const handleGenerateReports = async () => {
        setError("");

        const invalidPlate = buses.find(bus => !validatePlateFormat(bus.plate));
        if (invalidPlate) {
            setError("Geçersiz plaka formatı! Örnek format: 06ABC123 (İki rakam, harfler ve rakamlar)");
            return;
        }

        setIsGenerating(true);

        try {
            const payload = {
                buses: buses.map(bus => ({
                    plate: bus.plate.replace(/\s+/g, ""),
                    accident_date: bus.date ? format(bus.date, "yyyy-MM-dd") : null
                }))
            };

            const response = await fetch("http://localhost:8000/api/rapor-olustur", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Raporlar oluşturulamadı");
            }

            const data = await response.json();

            const mappedReports: GeneratedReport[] = (data.raporlar || []).map((rep: any) => ({
                pdfUrl: rep.pdfUrl,
                docxUrl: rep.docxUrl,
                fileName: rep.fileName
            }));

            setReports(mappedReports);
            setShowReports(true);

        } catch (error) {
            console.error("Rapor oluşturma hatası:", error);
            setError("Raporlar oluşturulamadı, lütfen sunucu bağlantısını kontrol edin.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center pt-4 px-8 pb-8 bg-white text-black">

            <div className="w-full max-w-4xl space-y-10 bg-white p-10 rounded-xl shadow-sm border border-slate-200 relative">

                <div className="relative mb-6">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="absolute left-0 top-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 px-3 py-2 -ml-2 -mt-1"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium text-base">Geri</span>
                    </Button>

                    <div className="space-y-2 text-center pt-2">
                        <h1 className="text-3xl font-bold tracking-tight">Otobüs Bilgileri</h1>
                        {!showReports && (
                            <p className="text-base text-slate-500">
                                Haberde <strong>{buses.length} adet</strong> otobüs tespit edildi. Gerekirse aşağıdaki bilgileri düzenleyebilirsiniz.
                            </p>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-slate-500 py-12 animate-pulse text-lg flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                        Araç bilgileri hafızadan okunuyor...
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                        <div className="grid grid-cols-3 gap-6 items-end font-semibold text-slate-600 border-b border-slate-200 pb-2">
                            <div className="text-lg">Araç</div>
                            <div className="text-lg">Otobüs Plakası</div>
                            <div className="text-lg">Kaza Tarihi</div>
                        </div>

                        {buses.map((bus, index) => (
                            <div key={bus.id} className="grid grid-cols-3 gap-6 items-center">
                                <div className="font-medium text-slate-700 text-lg">{index + 1}. Otobüs</div>

                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="Plaka bulunamadı"
                                        value={bus.plate}
                                        onChange={(e) => handleUpdateBus(bus.id, "plate", e.target.value.toUpperCase())}
                                        onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                                        required
                                        disabled={showReports || isGenerating}
                                        className="bg-white text-black border-slate-300 h-12 text-base pr-10 focus:ring-slate-400 disabled:opacity-70 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    />
                                    {!showReports && !isGenerating && (
                                        <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    )}
                                </div>

                                <Popover>
                                    <PopoverTrigger className="w-full focus:outline-none" disabled={showReports || isGenerating}>
                                        <div
                                            className={cn(
                                                "flex items-center w-full h-12 justify-start text-left font-normal text-base border border-slate-300 rounded-md px-3 relative text-black",
                                                !bus.date && "text-red-500 font-medium",
                                                (showReports || isGenerating) ? "bg-slate-50 cursor-not-allowed opacity-70" : "bg-white hover:bg-slate-50 cursor-pointer"
                                            )}
                                        >
                                            <CalendarIcon className="mr-3 h-5 w-5 text-slate-500" />
                                            {bus.date ? format(bus.date, "d MMMM yyyy", { locale: tr }) : <span>Tarih bulunamadı</span>}
                                            {!showReports && !isGenerating && (
                                                <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            )}
                                        </div>
                                    </PopoverTrigger>

                                    {!showReports && !isGenerating && (
                                        <PopoverContent className="w-auto p-2 bg-white text-black border-slate-200 shadow-lg" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={bus.date}
                                                onSelect={(date) => handleUpdateBus(bus.id, "date", date)}
                                                captionLayout="dropdown"
                                                className="scale-110 p-4 bg-white text-black"
                                            />
                                        </PopoverContent>
                                    )}
                                </Popover>
                            </div>
                        ))}

                        {!showReports && (
                            <div className="flex flex-col items-center gap-4 pt-6 pb-2">
                                <div className="w-full max-w-sm flex flex-col items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleGenerateReports}
                                        disabled={!isFormValid || isGenerating}
                                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 text-lg w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? (
                                             <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Dosyalar Hazırlanıyor...
                                            </>
                                        ) : (
                                            "Raporları Oluştur"
                                        )}
                                    </Button>

                                    {error && (
                                        <p className="text-xs font-bold text-red-500 text-center animate-in fade-in zoom-in duration-300">
                                            {error}
                                        </p>
                                    )}

                                    {!isFormValid && (
                                        <p className="text-xs text-red-500 text-center font-medium">
                                            *Raporları oluşturabilmek için tüm plaka ve tarih bilgilerini eksiksiz doldurunuz.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {showReports && (
                            <div className="mt-4 pt-6 w-full border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-2xl font-bold text-black text-left mb-6">
                                    Kaza Raporu
                                </h2>

                                <div className="grid grid-cols-3 gap-6 items-end font-semibold text-slate-600 border-b border-slate-200 pb-2">
                                    <div className="text-lg">Otobüs Plakası</div>
                                    <div className="text-lg">PDF</div>
                                    <div className="text-lg">WORD</div>
                                </div>

                                {reports.map((report, index) => (
                                    <div key={`report-${index}`} className="grid grid-cols-3 gap-6 items-center py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors px-2 rounded-md">

                                        <div className="font-medium text-slate-700 text-lg min-w-0 truncate" title={buses[index]?.plate}>
                                            {buses[index]?.plate || "Plaka bulunamadı"}
                                        </div>

                                        <div className="min-w-0">
                                            <a href={report.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium" title={`${report.fileName}.pdf`}>
                                                <FileText className="w-4 h-4 shrink-0" />
                                                <span className="break-all">{report.fileName}.pdf</span>
                                            </a>
                                        </div>

                                        <div className="min-w-0">
                                            <a href={report.docxUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium" title={`${report.fileName}.docx`}>
                                                <FileDown className="w-4 h-4 shrink-0" />
                                                <span className="break-all">{report.fileName}.docx</span>
                                            </a>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}

                    </form>
                )}

            </div>
        </main>
    );
}