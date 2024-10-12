import Logo from "@components/Logo";
import menu from "@config/menu.json";
import socical from "@config/social.json";
import Social from "@layouts/components/Social";
import ThemeSwitcher from "@layouts/components/ThemeSwitcher";
import SearchModal from "@partials/SearchModal";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MenuOutline } from 'react-ionicons'



const Header = ({configData}) => {
  // distructuring the main menu from menu object
  const { main } = menu;

  // states declaration
  const [searchModal, setSearchModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [searchBtnActive, setSearchBtnActive] = useState(false);
  // Router
  const router = useRouter();

  //stop scrolling when nav is open
  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [showMenu]);

  

  return (
    <header className="header sticky top-0 bg-white z-50">
      <nav className="navbar container px-1 sm:px-0">
        <div className="order-0 small-l sm:flex flex-row justify-between">
          <Logo  logoImg={configData?.Logo?.data?.attributes?.formats?.thumbnail?.url}/>
        
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="absolute right-6 top-6 inline-flex h-10 w-10 items-end justify-center rounded-full lg:hidden"
          >
            {!showMenu && (
              
              <MenuOutline
                 color={'#000000'} 
                  title={'Menu Open'}
                  height="60px"
                  width="40px"
                />
            )}
          </button>

        </div>

        <hr className="md:hidden lg:hidden w-full h-1/50 mt-24"/>
        <div className="midle-title flex flex-col items-center justify-evenly">
          <h3 className="md:my-2 mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
           {configData?configData.Title:" STARS and TOQUES"}
          </h3>
          <p className="md:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600">
              {configData?configData.Tagline:"Mostly Fine Dining Restaurant Reviews"}
          </p>
        </div>

        <div className="flex items-center space-x-4 xl:space-x-8">
          
          <div
            className={`collapse-menu ${
              !showMenu && "translate-x-full"
            } lg:flex lg:translate-x-0`}
          >
            <button
              className="absolute right-6 top-11 lg:hidden"
              onClick={() => setShowMenu(false)}
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <title>Menu Close</title>
                <polygon
                  points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                  transform="rotate(45 10 10)"
                />
              </svg>
            </button>



            <ul
              id="nav-menu"
              className="navbar-nav w-full flex flex-col md:w-auto md:space-x-1 lg:flex xl:space-x-2"
            >
              {main.map((menu, i) => (
                <React.Fragment key={`menu-${i}`}>
                  {menu.hasChildren ? (
                    <li className="nav-item nav-dropdown group relative">
                      <span
                        className={`nav-link ${
                          menu.children
                            .map((c) => c.url)
                            .includes(router.asPath) && "active"
                        } inline-flex items-center`}
                      >
                        {menu.name}
                        <svg
                          className="h-4 w-4 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </span>
                      <ul className="nav-dropdown-list hidden transition-all duration-300 group-hover:top-[46px] group-hover:block md:invisible md:absolute md:top-[60px] md:block md:opacity-0 md:group-hover:visible md:group-hover:opacity-100">
                        {menu.children.map((child, i) => (
                          <li
                            className="nav-dropdown-item"
                            key={`children-${i}`}
                          >
                            <Link
                              href={child.url}
                              className={`nav-dropdown-link block ${
                                router.asPath === child.url && "active"
                              }`}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item">
                    { menu.name === "SEARCH" || menu.url==='/search' ?(
                      <Link
                        // className={`search-button flex items-center justify-center px-4 py-2 text-sm text-white rounded-full bg-primary`}
                        className={`nav-link block ${
                          (searchBtnActive || menu.url==='/search') && "active"
                        }`}
                        onClick={() => {
                          if(router.asPath === '/') {
                            setSearchBtnActive(true);
                          }
                         setSearchModal(true);
                        }}

                        href="#"
                      >
                        {/* <IoSearch /> */}
                        {menu.name}
                      </Link>
                    ):( <Link
                        href={menu.url}
                        className={`nav-link block ${
                          router.asPath === menu.url && "active"
                        }`}
                       onClick={()=>setSearchBtnActive(false)}
                     >
                        {menu.name}
                      </Link>)
}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>


            
          </div>
         
        </div>

        <SearchModal
          searchModal={searchModal}
          setSearchModal={setSearchModal}
        />
      </nav>
      {showMenu && (
        <div className="header-backdrop absolute top-0 left-0 h-[100vh] w-full bg-black/50 lg:hidden"></div>
      )}
    </header>
  );
};

export default Header;
