import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/layout/BottomNav';
import DashboardHeader from '@/components/layout/DashboardHeader';
import OffersTable from '@/components/history/OffersTable';

const History = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      {isProfileOpen ? (
        <div className=" fixed w-full h-full flex justify-center items-center bg-black/5 ">
          <div className=" bg-white md:w-[500px] w-[90%] px-3 h-[400px] flex flex-col text-center justify-around items-center border rounded-lg shadow-lg ">
            <p className=" text-xl font-[500] text-[#333333] ">
              Complete your Profile
            </p>

            <img src="../../../images/profile.svg" alt="" />
            <p>
              This will help streamline your <br /> booking process
            </p>
            <div className=" w-full flex flex-col gap-5 ">
              <button
                onClick={() => navigate('/profile')}
                className=" w-full bg-[#4CAC3E] text-white px-3 py-2 rounded-[8px] "
              >
                Complete Now
              </button>
              <button
                onClick={handleProfileClick}
                className=" w-full bg-[#212121] text-white px-3 py-2 rounded-[8px] "
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      ) : null}{' '}
      <DashboardHeader
        isProfileOpen={isProfileOpen}
        handleProfileClick={handleProfileClick}
      />
      <main className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-6">Pickup History & Offers</h2>
        <OffersTable />
      </main>
      <BottomNav />
    </div>
  );
};

export default History;
