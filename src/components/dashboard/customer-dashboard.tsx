"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { getFavourites, removeFavourite } from "@/lib/api";
import { ServiceDto } from "@/types/service";

export default function CustomerDashboard() {
  const [favourites, setFavourites] = useState<ServiceDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFavourites = async () => {
    setLoading(true);
    try {
      const favList = await getFavourites();
      setFavourites(favList);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  const handleRemoveFav = async (serviceId: string) => {
    try {
      await removeFavourite(serviceId);
      toast.success("Đã xóa khỏi danh sách yêu thích");
      // Update local state directly to feel fast
      setFavourites(prev => prev.filter(item => item.id !== serviceId));
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
        <h3 className="font-bold text-gray-900 text-lg">
          Dịch vụ trang điểm yêu thích
        </h3>
        <p className="text-gray-500 text-xs mt-0.5">
          Danh sách các layout trang điểm bạn đã lưu làm yêu thích.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#E4187D] mb-2" />
          <p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {favourites.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
              <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg mb-1">Chưa có dịch vụ yêu thích</h3>
              <p className="text-gray-500 text-sm">Thêm các Layout trang điểm bạn yêu thích để theo dõi tại đây.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map(svc => (
                <Card key={svc.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between border-gray-100">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={svc.imageUrl || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600"}
                      alt={svc.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      onClick={() => handleRemoveFav(svc.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors cursor-pointer text-pink-600 shadow-sm"
                    >
                      <Heart className="w-5 h-5 fill-pink-600 text-pink-600" />
                    </button>
                    <Badge className="absolute bottom-3 left-3 bg-[#E4187D] text-white hover:bg-[#E4187D]">
                      {svc.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-bold line-clamp-1">{svc.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm line-clamp-2 mt-1">{svc.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-4 flex justify-between items-center gap-3 border-t border-gray-50 mt-4">
                    <span className="text-lg font-extrabold text-[#E4187D]">{formatPrice(svc.price)}</span>
                    <Link href={`/services/${svc.id}`}>
                      <Button className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-6 font-semibold cursor-pointer text-xs">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
