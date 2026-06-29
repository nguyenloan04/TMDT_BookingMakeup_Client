"use client";

import { useCallback, useEffect, useState } from 'react';
import { Artist } from '@/types/artist';
import { artistService } from '@/services/artist-service';
import ArtistCard from '@/components/artists/ArtistCard';
import AddArtistModal from '@/components/artists/AddArtistModal'; 
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Loader2, AlertCircle } from "lucide-react"; 

export default function ArtistManagementPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      const data = await artistService.getMyArtists();
      setArtists(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Không thể tải danh sách Artist. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
    fetchArtists();
  }, [fetchArtists]);

  // Giao diện lúc đang tải dữ liệu
  if (loading && artists.length === 0) {
    return (
        <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-[#E4187D] mb-4" />
                <p className="text-gray-500 font-medium">Đang tải danh sách thợ...</p>
            </main>
            <Footer />
        </div>
    );
  }

  // Giao diện lúc bị lỗi gọi API
  if (error) {
    return (
        <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Đã xảy ra lỗi</h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button 
                      onClick={() => { setError(''); fetchArtists(); }}
                      className="bg-[#E4187D] hover:bg-[#c9126b] text-white rounded-full px-8 py-3 font-bold w-full transition"
                    >
                        Thử lại
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  // Giao diện chính
  return (
    <div className="bg-[#FFF5F8] min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto relative mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Artist</h1>
        
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md flex items-center font-medium"
          >
            + Thêm Artist mới
          </button>
        </div>

        {artists.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-dashed border-pink-200">
            <p className="text-gray-500 mb-4 text-lg">Bạn chưa có chuyên viên trang điểm nào.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[#E4187D] font-bold hover:underline"
            >
              Thêm thợ ngay để bắt đầu nhận lịch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}

        <AddArtistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchArtists} 
        />
      </main>

      <Footer />
    </div>
  );
}