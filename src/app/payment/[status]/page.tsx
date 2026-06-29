"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header"; 
import Footer from "@/components/footer";

export default function PaymentResultPage({ params }: { params: Promise<{ status: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const status = resolvedParams.status;

    let content = {
        icon: <CheckCircle2 className="w-20 h-20 text-green-500" />,
        title: "Thanh toán thành công!",
        desc: "Tuyệt vời! Tiền cọc của bạn đã được ghi nhận. Hệ thống đang tiến hành chốt lịch với chuyên viên trang điểm.",
        color: "text-green-600",
        bg: "bg-green-50",
    };

    if (status === "error") {
        content = {
            icon: <XCircle className="w-20 h-20 text-red-500" />,
            title: "Thanh toán thất bại",
            desc: "Đã có lỗi xảy ra trong quá trình giao dịch. Vui lòng kiểm tra lại số dư tài khoản hoặc thử lại sau.",
            color: "text-red-600",
            bg: "bg-red-50",
        };
    }
    else if (status === "cancel") {
        content = {
            icon: <AlertCircle className="w-20 h-20 text-orange-500" />,
            title: "Đã hủy thanh toán",
            desc: "Bạn đã hủy quá trình thanh toán. Lịch hẹn của bạn hiện vẫn ở trạng thái chờ và chưa được chốt.",
            color: "text-orange-600",
            bg: "bg-orange-50",
        };
    }

    return (
        <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans pb-20">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center flex flex-col items-center transform transition-all hover:shadow-md">

                    <div className={`p-5 rounded-full ${content.bg} mb-6`}>
                        {content.icon}
                    </div>

                    <h1 className={`text-3xl font-semibold mb-4 ${content.color}`}>
                        {content.title}
                    </h1>

                    <p className="text-gray-600 mb-10 leading-relaxed text-base">
                        {content.desc}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                            className="flex-1 rounded-full py-6 font-bold text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Về trang chủ
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard?tab=bookings")}
                            className="flex-1 bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full py-6 font-bold transition-colors"
                        >
                            Xem lịch đặt
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
