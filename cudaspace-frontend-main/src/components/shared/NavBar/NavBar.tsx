'use client';
import MyButton from '@/components/ui/MyButton/MyButton';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { menuItems } from '@/constant/menuItems';
import { cn } from '@/lib/utils';
import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';
import { Dropdown, MenuProps } from 'antd';
import { JwtPayload } from 'jwt-decode';
import { ChevronDown, LogOut, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface DecodedUser extends JwtPayload {
  role: string;
}

const NavBar = () => {
  const dispatch = useAppDispatch();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentUserToken = useAppSelector(selectCurrentToken);
  const currentUser = currentUserToken ? verifyToken(currentUserToken) : null;

  const handleLogOut = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Log out!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire({
          title: 'Successful!',
          text: 'Your have been logged out.',
          icon: 'success',
        });
      }
    });
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link
          rel="noopener noreferrer"
          href={
            (currentUser as DecodedUser)?.role === 'ADMIN'
              ? '/dashboard'
              : '/user'
          }
        >
          Dashboard
        </Link>
      ),
    },
  ];

  return (
    <div className="bg-white sticky top-0 z-[1000] py-3 shadow-lg">
      <MyContainer>
        <div className="flex justify-between items-center md:py-1">
          {/* Logo */}
          <div
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-40 h-12 cursor-pointer overflow-hidden"
          >
            {/* <Image
              src={logo}
              alt="Logo"
              height={100}
              width={150}
              priority
              quality={100}
            /> */}
            {/* <h3 className="text-primary text-[24px] md:text-[32px] font-bold !leading-[48px]">
              CudaSpace
            </h3> */}

            {/* <Image src={"/Logo.jpeg"} /> */}
            <img src="/Logo.png" alt=" CudaSpace" className="w-full h-full" />
            
          </div>

          {/* Desktop Navigation */}
          {/* <div className="hidden lg:flex justify-center gap-12 items-center">
            {menuItems.map((menu, idx) => (
              <Link
                href={menu.path || '#'}
                key={idx}
                className={cn(
                  'text-text-primary font-medium text-base hover:text-primary transition-all duration-300',
                  { 'text-primary font-semibold': 'path' in menu && pathname === menu.path }
                )}
              >
                {menu.title}
              </Link>
            ))}
          </div> */}

          {/* desktop nav */}
          <nav className="hidden lg:flex justify-center gap-8 items-center">
            {menuItems.map((item) => (
              <div
                key={item.type === 'link' ? item.path : `dropdown-${item.title}`}
                className="relative group"
              >
                {item.type === 'link' ? (
                  <Link
                    href={item.path}
                    className={cn(
                      'text-foreground font-medium hover:text-primary transition-colors',
                      pathname === item.path && 'text-primary font-semibold',
                    )}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className={cn(
                        'flex items-center gap-1 text-foreground font-medium hover:text-primary transition-colors',
                        item.children.some(
                          (child) => 'path' in child && child.path === pathname,
                        ) && 'text-primary font-semibold',
                      )}
                    >
                      {item.title}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>

                    <div className="absolute bg-white left-1/2 -translate-x-1/2 mt-2 w-56 origin-top-right rounded-md bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-2">
                        {item.children.map((child, idx) => (
                          <Link
                            key={'path' in child ? child.path : `dropdown-${child.title}-${idx}`}
                            href={'path' in child ? child.path : '#'}
                            className={cn(
                              'block px-4 py-2 text-sm hover:bg-accent rounded hover:text-primary transition-colors',
                              'path' in child &&
                                pathname === child.path &&
                                'bg-accent font-medium',
                            )}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Action Buttons */}
          {currentUser ? (
            <div className="hidden lg:flex gap-3">
              <Dropdown
                menu={{ items }}
                trigger={['click']}
                placement="bottom"
                arrow
              >
                <button className="flex items-center bg-slate-100 hover:bg-slate-200 transition-all duration-300 px-3 py-2 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_887_1316)">
                      <path
                        d="M12.1001 0.0742188C8.61077 0.0742188 5.77197 2.91302 5.77197 6.40234C5.77197 9.89167 8.61077 12.7305 12.1001 12.7305C15.5894 12.7305 18.4282 9.89167 18.4282 6.40234C18.4282 2.91302 15.5894 0.0742188 12.1001 0.0742188Z"
                        fill="#4D4D4D"
                      />
                      <path
                        d="M19.9735 16.8646C18.241 15.1055 15.9443 14.1367 13.5063 14.1367H10.6938C8.25597 14.1367 5.95919 15.1055 4.22669 16.8646C2.50268 18.6151 1.55322 20.9258 1.55322 23.3711C1.55322 23.7594 1.86804 24.0742 2.25635 24.0742H21.9438C22.3322 24.0742 22.647 23.7594 22.647 23.3711C22.647 20.9258 21.6975 18.6151 19.9735 16.8646Z"
                        fill="#4D4D4D"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_887_1316">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                          transform="translate(0.100098 0.0742188)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M20.6001 8.07422C21.4285 8.07422 22.1001 7.40265 22.1001 6.57422C22.1001 5.74579 21.4285 5.07422 20.6001 5.07422C19.7717 5.07422 19.1001 5.74579 19.1001 6.57422C19.1001 7.40265 19.7717 8.07422 20.6001 8.07422Z"
                      fill="#4D4D4D"
                    />
                    <path
                      d="M16.6001 8.07422H3.6001C2.772 8.07422 2.1001 7.40232 2.1001 6.57422C2.1001 5.74612 2.772 5.07422 3.6001 5.07422H16.6001C17.4282 5.07422 18.1001 5.74612 18.1001 6.57422C18.1001 7.40232 17.4282 8.07422 16.6001 8.07422Z"
                      fill="#4D4D4D"
                    />
                    <path
                      d="M16.6001 14.0742H3.6001C2.772 14.0742 2.1001 13.4023 2.1001 12.5742C2.1001 11.7461 2.772 11.0742 3.6001 11.0742H16.6001C17.4282 11.0742 18.1001 11.7461 18.1001 12.5742C18.1001 13.4023 17.4282 14.0742 16.6001 14.0742Z"
                      fill="#4D4D4D"
                    />
                    <path
                      d="M10.6001 20.0742H3.6001C2.772 20.0742 2.1001 19.4023 2.1001 18.5742C2.1001 17.7461 2.772 17.0742 3.6001 17.0742H10.6001C11.4282 17.0742 12.1001 17.7461 12.1001 18.5742C12.1001 19.4023 11.4282 20.0742 10.6001 20.0742Z"
                      fill="#4D4D4D"
                    />
                  </svg>
                </button>
              </Dropdown>
              <button
                onClick={handleLogOut}
                className="bg-slate-100 hover:bg-slate-200 transition-all duration-300 px-3 py-2 rounded-md text-gray-500"
              >
                <LogOut />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex gap-5">
              <MyButton
                onClick={() => router.push('/auth/login')}
                label="Login"
                className="rounded-full px-8 md:px-12"
              />
              {/* <MyButton
                onClick={() => router.push('/login')}
                label="Sign in"
                variant="outline"
              /> */}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Drawer */}
        <div
          className={cn(
            'fixed inset-0 bg-black bg-opacity-50 z-50 transition-all duration-300',
            {
              'opacity-100 visible': isDrawerOpen,
              'opacity-0 invisible': !isDrawerOpen,
            },
          )}
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className={cn(
              'fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white shadow-lg p-5 flex flex-col transform transition-all duration-500',
              {
                'translate-x-0': isDrawerOpen,
                'translate-x-full': !isDrawerOpen,
              },
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="self-end mb-4"
              onClick={() => setIsDrawerOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Mobile Navigation Links with Dropdown Support */}
            <div className="flex flex-col gap-5">
              {menuItems.map((menu) => (
                <div
                  key={menu.type === 'link' ? menu.path : `dropdown-${menu.title}`}
                  className="flex flex-col"
                >
                  {'children' in menu ? (
                    // Dropdown menu item
                    <>
                      <button
                        onClick={() => {
                          if (menu.children?.length === 1) {
                            if ('path' in menu.children[0]) {
                              router.push(menu.children[0].path);
                            }
                            setIsDrawerOpen(false);
                          } else {
                            setOpenDropdown(
                              openDropdown === menu.title ? null : menu.title,
                            );
                          }
                        }}
                        className={cn(
                          'flex items-center justify-between text-text-primary text-lg hover:text-primary transition-all duration-300',
                          {
                            'text-primary font-semibold': menu.children?.some(
                              (child) =>
                                'path' in child && pathname === child.path,
                            ),
                          },
                        )}
                      >
                        {menu.title}
                        {menu.children && menu.children.length > 1 && (
                          <ChevronDown
                            className={cn(
                              'h-5 w-5 transition-transform',
                              openDropdown === menu.title && 'rotate-180',
                            )}
                          />
                        )}
                      </button>

                      {openDropdown === menu.title && menu.children && (
                        <div className="pl-4 flex flex-col gap-3 mt-2">
                          {menu.children.map((child, idx) => (
                            <Link
                              key={'path' in child ? child.path : `dropdown-${child.title}-${idx}`}
                              href={'path' in child ? child.path : '#'}
                              className={cn(
                                'text-text-primary text-lg hover:text-primary transition-all duration-300',
                                {
                                  'text-primary font-semibold':
                                    'path' in child && pathname === child.path,
                                },
                              )}
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Regular link item
                    <Link
                      href={menu.path || '#'}
                      className={cn(
                        'text-text-primary text-lg hover:text-primary transition-all duration-300',
                        {
                          'text-primary font-semibold': pathname === menu.path,
                        },
                      )}
                      onClick={() => setIsDrawerOpen(false)}
                    >
                      {menu.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Action Buttons (keep your existing code) */}
            {currentUser ? (
              <div className="lg:hidden flex flex-col gap-3 mt-5">
                {(currentUser as DecodedUser)?.role === 'ADMIN' ? (
                  <MyButton
                    onClick={() => router.push('/dashboard')}
                    label="Admin Dashboard"
                    variant="outline"
                    fullWidth
                  />
                ) : (
                  <MyButton
                    onClick={() =>
                      router.push(
                        `/${(currentUser as DecodedUser)?.role.toLowerCase()}`,
                      )
                    }
                    label="Dashboard"
                    variant="outline"
                    fullWidth
                  />
                )}
                <button
                  onClick={handleLogOut}
                  className="bg-slate-100 rounded-full flex items-center gap-2 justify-center hover:bg-slate-200 transition-all duration-300 px-3 py-3 text-gray-500"
                >
                  <LogOut /> Sign out
                </button>
              </div>
            ) : (
              <div className="lg:hidden flex flex-col gap-3 mt-5">
                <MyButton
                  onClick={() => router.push('/auth/register')}
                  label="Sign up"
                  variant="outline"
                  fullWidth
                />
                <MyButton
                  onClick={() => router.push('/auth/login')}
                  label="Sign in"
                  variant="filled"
                  fullWidth
                />
              </div>
            )}
          </div>
        </div>
      </MyContainer>
    </div>
  );
};

export default NavBar;
