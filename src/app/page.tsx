"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Search, CalendarHeart, Sparkles, ArrowRight, Gem, GraduationCap, Drama } from "lucide-react";
// import { mockReviews } from "@/data/mock-data";
import Header from "@/components/header";
import Footer from "@/components/footer";

import { HomeArtist, HomePromotion } from "@/types/home";
import { defaultAvatar } from "@/common/constant/default-avatar";
import { getHomeData } from "@/services/home-service";
import { Category } from "@/common/constant/category";

const categoryIconMap: Record<string, React.ElementType> = {
    "gem": Gem,
    "sparkles": Sparkles,
    "graduation-cap": GraduationCap,
    "palette": Drama
};

export default function HomePage() {
    const router = useRouter();

    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");

    const [featuredArtists, setFeaturedArtists] = useState<HomeArtist[]>([]);
    const [promotions, setPromotions] = useState<HomePromotion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            setIsLoading(true);
            const data = await getHomeData();
            setFeaturedArtists(data.featuredArtists);
            setPromotions(data.promotions);
            setIsLoading(false);
        };

        fetchHomeData();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword.trim()) params.append("keyword", keyword.trim());
        if (location.trim()) params.append("location", location.trim());
        router.push(`/artists?${params.toString()}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
            <Header />

            <section className="relative h-[90vh] w-full flex items-center justify-center">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1595051665600-afd01ea7c446?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                        backgroundPosition: "center 20%"
                    }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight drop-shadow-lg">
                        Tỏa Sáng Theo Cách Riêng Của Bạn
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 drop-shadow-md max-w-2xl mx-auto font-light">
                        Nền tảng đặt lịch chuyên viên trang điểm hàng đầu Việt Nam. Nhanh chóng, uy tín và cá nhân hóa.
                    </p>

                    <div className="mt-8 bg-white p-2 rounded-full flex items-center shadow-2xl max-w-2xl mx-auto">
                        <div className="flex-1 flex items-center px-4 border-r border-gray-200">
                            <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm dịch vụ (VD: Cô dâu, Đi tiệc...)"
                                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <div className="flex-1 hidden sm:flex items-center px-4">
                            <MapPin className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tại TP. Hồ Chí Minh"
                                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 py-6 font-bold shadow-md cursor-pointer transition-colors"
                        >
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Artist Nổi Bật Tuần Này</h2>
                        <p className="text-gray-500 text-sm">Những chuyên viên được khách hàng đánh giá cao nhất.</p>
                    </div>
                    <Link href="/artists" className="text-[#E4187D] font-semibold text-sm hover:underline hidden sm:block">
                        Xem tất cả
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-10"><span className="text-gray-400 animate-pulse">Đang tải dữ liệu...</span></div>
                ) : featuredArtists.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">Hiện chưa có Artist nổi bật nào.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredArtists.map((artist) => (
                            <Link href={`/provider/${artist.id}`} key={artist.id}>
                                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer h-full flex flex-col">
                                    <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
                                        <Image
                                            src={artist.avatarUrl || defaultAvatar}
                                            alt={artist.displayName}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 truncate">{artist.displayName}</h3>
                                    <p className="text-xs text-gray-500 mb-3 truncate">{artist.specialty || "Chuyên viên trang điểm"}</p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-gray-700">{artist.rating.toFixed(1)}</span>
                                            <span className="text-xs text-gray-400">({artist.reviewsCount})</span>
                                        </div>
                                        <span className="text-[#E4187D] font-bold text-sm">
                                            {artist.priceFrom > 0 ? `Từ ${artist.priceFrom.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="py-12 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Ưu Đãi Độc Quyền</h2>
                    {isLoading ? (
                        <div className="flex justify-center py-10"><span className="text-gray-400 animate-pulse">Đang tải khuyến mãi...</span></div>
                    ) : promotions.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">Hiện chưa có khuyến mãi nào đang diễn ra.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {promotions.map(promo => (
                                <div key={promo.id} className="relative h-48 rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
                                    <Image
                                        src={promo.imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1187&auto=format&fit=crop"}
                                        alt={promo.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent"></div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-center">
                                        <span className="bg-[#E4187D] text-white text-[10px] font-bold px-2 py-1 rounded w-max mb-3 uppercase tracking-wider">
                                            {promo.title}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-1">Mã Giảm Giá Đặc Biệt</h3>
                                        <p className="text-sm text-gray-300 mb-4">HSD: {promo.validUntil}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="border border-dashed border-white/50 text-white px-3 py-1.5 rounded-lg text-sm font-mono tracking-wider bg-white/10 backdrop-blur-sm">
                                                {promo.code}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-20 bg-pink-50/50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12">Chỉ 3 Bước Để Tỏa Sáng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#E4187D] mb-6">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Tìm kiếm Artist</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Duyệt qua hàng trăm hồ sơ chất lượng được đánh giá minh bạch bởi cộng đồng.</p>
                        </div>
                        <div className="flex flex-col items-center relative">
                            <div className="hidden md:block absolute top-8 left-[-50%] w-full h-0.5 bg-linear-to-r from-transparent via-[#E4187D]/20 to-transparent -z-10"></div>
                            <div className="w-16 h-16 bg-[#E4187D] rounded-2xl shadow-md shadow-pink-200 flex items-center justify-center text-white mb-6">
                                <CalendarHeart className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Chat & Đặt lịch</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Nhắn tin trực tiếp trao đổi ý tưởng và chốt thời gian, địa điểm nhanh chóng.</p>
                        </div>
                        <div className="flex flex-col items-center relative">
                            <div className="hidden md:block absolute top-8 left-[-50%] w-full h-0.5 bg-linear-to-r from-transparent via-[#E4187D]/20 to-transparent -z-10"></div>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#E4187D] mb-6">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Tận hưởng dịch vụ</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Artist đến tận nơi hoặc làm tại Studio. Bạn chỉ cần thư giãn và lột xác.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#E4187D] py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                        Bạn Là Chuyên Viên Trang Điểm?
                    </h2>
                    <p className="text-pink-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Gia nhập cộng đồng <span className="font-normal text-white">BookingMakeup</span> ngay hôm nay để tiếp cận hàng ngàn khách hàng tiềm năng, quản lý lịch trình chuyên nghiệp và bứt phá thu nhập của bạn.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register/service-owner">
                            <Button className="bg-white text-[#E4187D] hover:bg-gray-50 hover:scale-105 rounded-full px-8 py-6 font-bold text-base shadow-xl transition-all w-full sm:w-auto">
                                Đăng ký làm Đối tác
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/about-service-owner">
                            <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-bold text-base transition-colors w-full sm:w-auto">
                                Tìm hiểu thêm
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Khám Phá Dịch Vụ</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {Category.map((cat) => {
                        const IconComponent = categoryIconMap[cat.iconUrl] || Sparkles;
                        return (
                            <Link href={`/artists?specialization=${cat.slug}`} key={cat.id}>
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg hover:border-pink-100 transition-all cursor-pointer group flex flex-col items-center justify-center h-full">
                                    <div className="mb-4 text-gray-700 group-hover:text-[#E4187D] transition-colors duration-300">
                                        <IconComponent
                                            className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#E4187D] transition-colors">{cat.name}</h3>
                                    <p className="text-xs text-gray-500">{cat.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="py-20 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/*{mockReviews.map((review) => (*/}
                        {/*    <div key={review.id} className="bg-white p-6 rounded-2xl relative shadow-sm border border-gray-100 hover:shadow-md transition-shadow">*/}
                        {/*        <div className="flex gap-1 mb-4">*/}
                        {/*            {[...Array(review.rating)].map((_, i) => (*/}
                        {/*                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />*/}
                        {/*            ))}*/}
                        {/*        </div>*/}
                        {/*        <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&quot;{review.comment}&quot;</p>*/}
                        {/*        <div className="flex items-center gap-3">*/}
                        {/*            <Image*/}
                        {/*                src={review.customerAvatar}*/}
                        {/*                alt={review.customerName}*/}
                        {/*                width={40}*/}
                        {/*                height={40}*/}
                        {/*                unoptimized*/}
                        {/*                className="rounded-full border-2 border-gray-50 shadow-sm"*/}
                        {/*            />*/}
                        {/*            <div>*/}
                        {/*                <h4 className="font-bold text-sm text-gray-900">{review.customerName}</h4>*/}
                        {/*                <p className="text-xs text-gray-400">{review.serviceName} • {review.createdAt}</p>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}