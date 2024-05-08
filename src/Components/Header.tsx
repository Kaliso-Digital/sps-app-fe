import { Link } from "react-router-dom";
import { useUserStore } from "../Service/userStore";
const userName = "John";

function Header() {
  const userData = useUserStore((state) => state.userData);

  return (
    <div className="w-full items-center justify-center flex h-[10vh] shadow-sm">
      <div className="header h-full flex flex-row justify-between py-4 w-5/6 items-center">
        <div className="logo w-[18%] flex justify-center items-center">
          <Link to={`/inquiries`}>
            <img src="/Assets/spsLogo.jpg" alt=""/>
          </Link>
        </div>
        <div className="profile-section flex flex-row items-center text-center gap-3">
          <div className="userName font-satoshi text-md font-bold">Hi, {userData ? userData.firstName : 'Unknown User'}</div>
        <div>
          <Link to={`/profile`}>
            <img src={userData ? userData.avatar : '/Assets/profileIcon.png'} alt={userData ? userData.firstName+' '+userData.lastName : 'Unknown User'} className="w-[24px] h-[24px]"/>
          </Link>
      </div>
    </div>
    </div>
    </div>
  );
}

export default Header;
