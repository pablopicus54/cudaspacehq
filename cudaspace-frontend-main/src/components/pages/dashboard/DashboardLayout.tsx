/* eslint-disable @typescript-eslint/no-unused-vars */
 
'use client';

import Loading from '@/components/ui/Loading/Loading';
import { ContextProvider } from '@/lib/MyContextProvider';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Drawer, Layout, Space, theme } from 'antd';
import { Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RxAvatar } from 'react-icons/rx';
import {
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { BiLogOut } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
import {
    IoClose,
    IoMenu,
    IoNotificationsOutline,
    IoSettingsOutline,
    IoWalletOutline,
} from 'react-icons/io5';
import { LiaListAltSolid } from 'react-icons/lia';
import { LuClipboardList } from 'react-icons/lu';
import { MdKeyboardArrowDown, MdPending } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useGetAllNotificationQuery } from '@/redux/features/notification/notification.api';
import NotificationsPanel from '@/components/ui/NotificationPanel/NotificationPanel';
import { getSocket } from '@/utils/socket';
import { RiBloggerLine } from 'react-icons/ri';

const { Header, Sider, Content } = Layout;

type Notification = {
	id: string;
	userId: string;
	message: string;
	link: string;
	isRead: boolean;
	createdAt: string; // or Date if you parse it
	updatedAt: string; // or Date if you parse it
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
	const user = useAppSelector(selectCurrentUser);
	const role = user?.role;
	const [isShowDrawer, setIsShowDrawer] = useState(false);
	const context = useContext(ContextProvider);
	const windowWidth = context ? context.windowWidth : 0;
	const isSmallScreen = windowWidth < 1024;
	const dispatch = useAppDispatch();
	const {
		data: response,
		isLoading,
		isFetching,
	} = useGetMeQuery(undefined, { skip: !user });

	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const notificationRef = useRef<HTMLDivElement>(null);

	const { data: getAllNotificationQuery } = useGetAllNotificationQuery(
		undefined,
		{
			skip: !user,
			// pollingInterval: 5000,
			// refetchOnFocus: true,
			// refetchOnMountOrArgChange: true,
		},
	);

	useEffect(() => {
		setAllNotifications(getAllNotificationQuery?.data);
	}, [getAllNotificationQuery?.data]);

	const handleSubmit = async (formData: any, reset: any) => {
		console.log(formData, reset);
	};

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notificationRef.current &&
				!notificationRef.current.contains(event.target as Node)
			) {
				setIsNotificationOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const profileImage = response?.data?.profileImage?.includes(
		'http://localhost:5000',
	)
		? response?.data?.profileImage?.replace(
				'http://localhost:5000',
				'http://10.0.10.33:5000',
		  )
		: response?.data?.profileImage;

	const handleLogout = async () => {
		const result = await Swal.fire({
			title: 'Are you sure?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Log out',
		});
		if (result.isConfirmed) {
			try {
				await dispatch(logout());
				Swal.fire({
					title: 'Logged out!',
					icon: 'success',
					timer: 1500,
					showConfirmButton: false,
				});
			} catch (error) {
				console.error('Logout failed:', error);
				Swal.fire({
					title: 'Error!',
					text: 'Logout failed. Please try again.',
					icon: 'error',
				});
			}
		}
	};

	if (isLoading || isFetching) {
		return <Loading />;
	}

	return (
		<div className="">
			{/* Mobile menu start */}
			<Drawer
				title="Menu"
				placement="left"
				onClose={() => setIsShowDrawer(false)}
				open={isShowDrawer}
				closeIcon={false}
				extra={
					<Space>
						<button onClick={() => setIsShowDrawer(false)}>
							<IoClose className="hover:text-red-500" size={25} />
						</button>
					</Space>
				}>
				<SideMenu role={role as string} />
			</Drawer>
			{/* Mobile menu end */}

			<Layout className="h-[calc(100vh-0px)]">
				<Layout>
					<div className="bg-white lg:border-t-[1px] lg:pt-9 overflow-hidden overflow-y-auto slim-scroll border">
						{!isSmallScreen && (
							<Sider
								trigger={null}
								collapsible
								className="!bg-white"
								width={280}>
								<div className="ms-2 xl:ms-3 2xl:ms-4">
									<SideMenu role={role as string} />
								</div>
							</Sider>
						)}
					</div>
					<div className="w-full">
						<Header className="bg-white flex items-center justify-between px-3 lg:px-6 py-3 lg:py-0 h-fit border ">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
								<div className="flex items-center gap-6">
									{isSmallScreen && (
										<button onClick={() => setIsShowDrawer(true)}>
											<IoMenu size={22} />
										</button>
									)}

									<h4 className="text-[24px] font-semibold hidden lg:block">
										Welcome Back, {response?.data?.name}
									</h4>
								</div>

								<div className="flex flex-wrap-reverse items-center justify-between gap-4">
									<div className="flex items-center gap-4">
										<div
											className="relative  flex items-center"
											ref={notificationRef}>
											<button
												onClick={() =>
													setIsNotificationOpen(!isNotificationOpen)
												}
												className="relative hover:bg-gray-100 rounded-full transition-colors"
												aria-label="Notifications">
												<IoNotificationsOutline className="h-7 w-7 text-gray-600" />
												<span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
											</button>

											{isNotificationOpen && (
												<div className="absolute sm:right-0 top-12 -mt-2 z-[99999] ">
													<NotificationsPanel
														setIsNotificationOpen={setIsNotificationOpen}
														setAllNotifications={setAllNotifications}
														allNotifications={allNotifications}
													/>
												</div>
											)}
										</div>

										<div className="relative" ref={dropdownRef}>
											<button
												onClick={() => setIsDropdownOpen(!isDropdownOpen)}
												className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-colors"
												aria-expanded={isDropdownOpen}
												aria-haspopup="true">
												<div className="h-10 w-10 rounded-full flex items-center justify-center border overflow-hidden bg-gray-100">
													{response?.data?.profileImage ? (
														<Image
															height={100}
															width={100}
															src={profileImage}
															alt="User avatar"
															className="h-full w-full object-cover"
														/>
													) : (
														<RxAvatar size={30} />
													)}
												</div>
												<MdKeyboardArrowDown className="h-5 w-5 text-gray-600" />
											</button>

											{isDropdownOpen && (
												<div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
													<div className="flex items-center gap-3 mx-3 border-b border-dashed cursor-pointer">
														<div className="h-10 w-10 rounded-full flex items-center justify-center border overflow-hidden bg-gray-100">
															{response?.data?.profileImage ? (
																<Image
																	height={100}
																	width={100}
																	src={profileImage}
																	alt="User avatar"
																	className="h-full w-full object-cover"
																/>
															) : (
																<RxAvatar size={30} />
															)}
														</div>
														<h3 className="font-medium">
															{response?.data?.name}
														</h3>
													</div>
													{/* <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <FiUser className="h-4 w-4 text-blue-primary" />
                            My Profile
                          </button> */}
													<button
														onClick={handleLogout}
														className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
														<BiLogOut className="h-4 w-4 text-blue-primary" />
														Logout
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</Header>

						<Content
							style={{
								// margin: '16px 16px',
								// padding: 24,
								//   background: colorBgContainer,
								borderRadius: borderRadiusLG,
							}}
							className="overflow-hidden overflow-y-auto h-[calc(100vh-92px)] md:p-4">
							{children}
						</Content>
					</div>
				</Layout>
			</Layout>
		</div>
	);
};

const SideMenu = ({ role }: { role: string }) => {
	const pathname = usePathname();
	const [activeKey, setActiveKey] = useState<string | null>(null);
	const menuItems = useMemo(() => {
		if (role === 'ADMIN') {
			return [
				{
					href: '/dashboard',
					icon: (
						<svg
							className="w-5 h-5 mr-1"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect
								x="3"
								y="3"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="14"
								y="3"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="3"
								y="14"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="14"
								y="14"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					),
					text: 'Dashboard',
					isActive: true,
				},
				{
					href: '/dashboard/user-management',
					icon: <Users className="w-5 h-5 mr-1" />,
					text: 'User Management',
					isActive: false,
				},
				{
					href: '/dashboard/manage-orders',
					icon: <LuClipboardList className="w-5 h-5 mr-1" />,
					text: 'Manage Order',
					isActive: false,
				},
				{
					href: '/dashboard/blog-management',
					icon: <RiBloggerLine className="w-5 h-5 mr-1" />,
					text: 'Manage Blog',
					isActive: false,
				},
				{
					href: '/dashboard/service',
					icon: <LiaListAltSolid className="w-5 h-5 mr-1" />,
					text: 'Service',
					isActive: false,
				},
				{
					href: '/dashboard/settings',
					icon: <IoSettingsOutline className="w-5 h-5 mr-1" />,
					text: 'Settings',
					isActive: false,
				},
				{
					href: '/dashboard/pending-task',
					icon: <MdPending className="w-5 h-5 mr-1" />,
					text: 'Pending Task',
					isActive: false,
				},
			];
        } else {
            return [
                {
                    href: '/user',
                    icon: (
						<svg
							className="w-5 h-5 mr-1"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<rect
								x="3"
								y="3"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="14"
								y="3"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="3"
								y="14"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<rect
								x="14"
								y="14"
								width="7"
								height="7"
								rx="1"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
					),
					text: 'Dashboard',
					isActive: true,
                },
                {
                    href: '/user/virtual-servers',
                    icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none">
							<g clipPath="url(#clip0_317_2997)">
								<path
									d="M20.5 18.9995H12.5C12.224 18.9995 12 19.2236 12 19.4996C12 19.7756 12.224 19.9996 12.5 19.9996H20.5C20.776 19.9996 21 19.7756 21 19.4996C21 19.2236 20.776 18.9995 20.5 18.9995ZM20.5 20.9995H12.5C12.224 20.9995 12 21.2235 12 21.4995C12 21.7755 12.224 21.9995 12.5 21.9995H20.5C20.776 21.9995 21 21.7755 21 21.4995C21 21.2235 20.776 20.9995 20.5 20.9995ZM3.50002 18.9995C2.673 18.9995 2.00002 19.6725 2.00002 20.4995C2.00002 21.3266 2.673 21.9995 3.50002 21.9995C4.32703 21.9995 5.00002 21.3266 5.00002 20.4995C5.00002 19.6725 4.32698 18.9995 3.50002 18.9995ZM3.50002 20.9995C3.22402 20.9995 3 20.7755 3 20.4995C3 20.2235 3.22402 19.9995 3.50002 19.9995C3.77602 19.9995 4.00003 20.2235 4.00003 20.4995C3.99998 20.7755 3.77602 20.9995 3.50002 20.9995ZM3.50002 12.9995C2.673 12.9995 2.00002 13.6725 2.00002 14.4995C2.00002 15.3266 2.673 15.9995 3.50002 15.9995C4.32703 15.9995 5.00002 15.3266 5.00002 14.4995C5.00002 13.6725 4.32698 12.9995 3.50002 12.9995ZM3.50002 14.9995C3.22402 14.9995 3 14.7755 3 14.4995C3 14.2235 3.22402 13.9995 3.50002 13.9995C3.77602 13.9995 4.00003 14.2235 4.00003 14.4995C4.00003 14.7755 3.77602 14.9995 3.50002 14.9995ZM20.5 8.99951H12.5C12.224 8.99951 12 9.22353 12 9.49953C12 9.77553 12.224 9.99954 12.5 9.99954H20.5C20.776 9.99954 21 9.77553 21 9.49953C21 9.22353 20.776 8.99951 20.5 8.99951Z"
									fill="#101010"
								/>
								<path
									d="M24 9.49947V7.49946C24 7.01946 23.857 6.57447 23.621 6.19244C23.614 6.17843 23.613 6.16244 23.605 6.14946L20.513 1.17949C20.054 0.441488 19.26 0.000488281 18.39 0.000488281H5.613C4.74202 0.000488281 3.94898 0.441488 3.48998 1.17949L0.398016 6.14946C0.393 6.15747 0.393 6.16647 0.388031 6.17547C0.146016 6.56046 0 7.01247 0 7.49946V9.49947C0 10.3195 0.402984 11.0435 1.01602 11.4995C0.402984 11.9565 0 12.6795 0 13.4995V15.4995C0 16.3195 0.402984 17.0435 1.01602 17.4995C0.402984 17.9565 0 18.6795 0 19.4995V21.4995C0 22.8775 1.122 23.9995 2.49998 23.9995H21.5C22.878 23.9995 24 22.8775 24 21.4995V19.4995C24 18.6795 23.597 17.9554 22.9839 17.4994C23.597 17.0435 24 16.3195 24 15.4995V13.4995C24 12.6795 23.597 11.9554 22.984 11.4994C23.597 11.0435 24 10.3205 24 9.49947ZM4.33898 1.70749C4.614 1.26447 5.08997 0.999488 5.61197 0.999488H18.389C18.911 0.999488 19.387 1.26447 19.662 1.70749L21.725 5.02249C21.65 5.0155 21.577 4.99947 21.5 4.99947H2.49998C2.42297 4.99947 2.35097 5.01546 2.27597 5.02249L4.33898 1.70749ZM23 19.4995V21.4995C23 22.3265 22.327 22.9995 21.5 22.9995H2.49998C1.67297 22.9995 0.999984 22.3265 0.999984 21.4995V19.4995C0.999984 18.6724 1.67297 17.9995 2.49998 17.9995H21.5C22.327 17.9995 23 18.6725 23 19.4995ZM23 13.4995V15.4995C23 16.3265 22.327 16.9995 21.5 16.9995H2.49998C1.67297 16.9995 0.999984 16.3265 0.999984 15.4995V13.4995C0.999984 12.6724 1.67297 11.9995 2.49998 11.9995H21.5C22.327 11.9995 23 12.6725 23 13.4995ZM23 9.49947C23 10.3265 22.327 10.9995 21.5 10.9995H2.49998C1.67297 10.9995 0.999984 10.3265 0.999984 9.49947V7.49946C0.999984 6.67244 1.67297 5.99946 2.49998 5.99946H21.5C22.327 5.99946 23 6.67244 23 7.49946V9.49947H23Z"
									fill="#101010"
								/>
								<path
									d="M20.5 6.99951H12.5C12.224 6.99951 12 7.22353 12 7.49953C12 7.77553 12.224 7.99954 12.5 7.99954H20.5C20.776 7.99954 21 7.77553 21 7.49953C21 7.22353 20.776 6.99951 20.5 6.99951ZM20.5 14.9995H12.5C12.224 14.9995 12 15.2235 12 15.4995C12 15.7755 12.224 15.9995 12.5 15.9995H20.5C20.776 15.9995 21 15.7755 21 15.4995C21 15.2235 20.776 14.9995 20.5 14.9995ZM20.5 12.9995H12.5C12.224 12.9995 12 13.2235 12 13.4995C12 13.7755 12.224 13.9995 12.5 13.9995H20.5C20.776 13.9995 21 13.7755 21 13.4995C21 13.2235 20.776 12.9995 20.5 12.9995ZM3.50002 6.99951C2.673 6.99951 2.00002 7.6725 2.00002 8.49951C2.00002 9.32653 2.673 9.99951 3.50002 9.99951C4.32703 9.99951 5.00002 9.32653 5.00002 8.49951C5.00002 7.6725 4.32698 6.99951 3.50002 6.99951ZM3.50002 8.99948C3.22402 8.99948 3 8.77547 3 8.49947C3 8.22347 3.22402 7.99945 3.50002 7.99945C3.77602 7.99945 4.00003 8.22347 4.00003 8.49947C4.00003 8.77547 3.77602 8.99948 3.50002 8.99948Z"
									fill="#101010"
								/>
							</g>
							<defs>
								<clipPath id="clip0_317_2997">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					),
					text: 'Virtual Servers',
					isActive: false,
                },
                {
                    href: '/user/gpu-servers',
                    icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none">
							<g clipPath="url(#clip0_317_3017)">
								<path
									d="M23.4546 9.27272C23.7561 9.27272 24.0001 9.02874 24.0001 8.72725C24.0001 8.42575 23.7561 8.18182 23.4546 8.18182H21.8182V5.99999H23.4546C23.7561 5.99999 24.0001 5.75602 24.0001 5.45452C24.0001 5.15302 23.7561 4.90909 23.4546 4.90909H21.8182V4.36362C21.8182 3.16033 20.8397 2.18179 19.6364 2.18179H19.0909V0.545421C19.0909 0.473784 19.0769 0.402841 19.0495 0.33665C19.0221 0.270458 18.9819 0.210315 18.9312 0.15966C18.8806 0.109005 18.8204 0.0688313 18.7543 0.0414357C18.6881 0.01404 18.6171 -4.02148e-05 18.5455 1.17615e-07C18.4738 -4.69447e-05 18.4029 0.01403 18.3367 0.0414259C18.2705 0.0688217 18.2103 0.108999 18.1597 0.15966C18.109 0.210321 18.0688 0.270472 18.0414 0.336673C18.014 0.402874 18 0.473826 18 0.545472V2.18184H15.8182V0.545472C15.8182 0.243972 15.5742 1.17615e-07 15.2728 1.17615e-07C14.9713 1.17615e-07 14.7273 0.243972 14.7273 0.545472V2.18184H12.5454V0.545472C12.5454 0.243972 12.3015 1.17615e-07 12 1.17615e-07C11.6986 1.17615e-07 11.4546 0.243972 11.4546 0.545472V2.18184H9.27272V0.545472C9.27272 0.243972 9.02875 1.17615e-07 8.7273 1.17615e-07C8.42585 1.17615e-07 8.18182 0.243972 8.18182 0.545472V2.18184H5.99999V0.545472C5.99999 0.243972 5.75602 1.17615e-07 5.45457 1.17615e-07C5.15312 1.17615e-07 4.90909 0.243972 4.90909 0.545472V2.18184H4.36362C3.16033 2.18184 2.18179 3.16033 2.18179 4.36367V4.90909H0.545421C0.243972 4.90909 1.17615e-07 5.15307 1.17615e-07 5.45457C1.17615e-07 5.75607 0.243972 6.00004 0.545472 6.00004H2.18184V8.18182H0.545472C0.243972 8.18182 1.17615e-07 8.4258 1.17615e-07 8.7273C1.17615e-07 9.0288 0.243972 9.27277 0.545472 9.27277H2.18184V11.4546H0.545472C0.243972 11.4546 1.17615e-07 11.6985 1.17615e-07 12C1.17615e-07 12.3015 0.243972 12.5455 0.545472 12.5455H2.18184V14.7273H0.545472C0.243972 14.7273 1.17615e-07 14.9713 1.17615e-07 15.2728C1.17615e-07 15.5743 0.243972 15.8182 0.545472 15.8182H2.18184V18H0.545472C0.473826 18 0.402874 18.014 0.336673 18.0414C0.270472 18.0688 0.210321 18.109 0.15966 18.1597C0.108999 18.2103 0.0688217 18.2705 0.0414259 18.3367C0.01403 18.4029 -4.69447e-05 18.4738 1.17615e-07 18.5455C-4.69447e-05 18.6171 0.01403 18.6881 0.0414259 18.7543C0.0688217 18.8205 0.108999 18.8806 0.15966 18.9313C0.210321 18.982 0.270472 19.0221 0.336673 19.0495C0.402874 19.0769 0.473826 19.091 0.545472 19.091H2.18184V19.6364C2.18184 20.8397 3.16033 21.8182 4.36367 21.8182H4.90909V23.4546C4.90909 23.7561 5.15307 24.0001 5.45457 24.0001C5.75607 24.0001 6.00004 23.7561 6.00004 23.4546V21.8182H8.18182V23.4546C8.18182 23.7561 8.4258 24.0001 8.7273 24.0001C9.0288 24.0001 9.27277 23.7561 9.27277 23.4546V21.8182H11.4546V23.4546C11.4546 23.7561 11.6985 24.0001 12 24.0001C12.3015 24.0001 12.5455 23.7561 12.5455 23.4546V21.8182H14.7273V23.4546C14.7273 23.7561 14.9713 24.0001 15.2728 24.0001C15.5743 24.0001 15.8182 23.7561 15.8182 23.4546V21.8182H18V23.4546C18 23.5262 18.014 23.5972 18.0414 23.6634C18.0688 23.7296 18.109 23.7897 18.1597 23.8404C18.2103 23.8911 18.2705 23.9312 18.3367 23.9586C18.4029 23.986 18.4738 24.0001 18.5455 24.0001C18.6171 24.0001 18.6881 23.986 18.7543 23.9586C18.8205 23.9312 18.8806 23.8911 18.9313 23.8404C18.982 23.7897 19.0221 23.7296 19.0495 23.6634C19.0769 23.5972 19.091 23.5262 19.091 23.4546V21.8182H19.6364C20.8397 21.8182 21.8182 20.8397 21.8182 19.6364V19.0909H23.4546C23.5262 19.091 23.5972 19.0769 23.6634 19.0495C23.7296 19.0221 23.7897 18.9819 23.8404 18.9312C23.8911 18.8806 23.9312 18.8204 23.9586 18.7542C23.986 18.688 24.0001 18.6171 24.0001 18.5454C24.0001 18.4738 23.986 18.4028 23.9586 18.3366C23.9312 18.2704 23.8911 18.2103 23.8404 18.1596C23.7897 18.109 23.7296 18.0688 23.6634 18.0414C23.5972 18.014 23.5262 17.9999 23.4546 18H21.8182V15.8181H23.4546C23.7561 15.8181 24.0001 15.5742 24.0001 15.2727C24.0001 14.9712 23.7561 14.7273 23.4546 14.7273H21.8182V12.5454H23.4546C23.7561 12.5454 24.0001 12.3015 24.0001 12C24.0001 11.6985 23.7561 11.4546 23.4546 11.4546H21.8182V9.27272H23.4546ZM20.7273 19.6364C20.7273 20.2377 20.2377 20.7273 19.6364 20.7273H4.36362C3.76226 20.7273 3.27273 20.2377 3.27273 19.6364V4.36362C3.27273 3.76226 3.76226 3.27273 4.36362 3.27273H19.6364C20.2377 3.27273 20.7273 3.76226 20.7273 4.36362V19.6364Z"
									fill="#101010"
								/>
								<path
									d="M19.0909 4.36377H4.90909C4.83745 4.36372 4.7665 4.3778 4.7003 4.4052C4.63409 4.43259 4.57394 4.47277 4.52328 4.52343C4.47262 4.57409 4.43244 4.63424 4.40505 4.70044C4.37765 4.76664 4.36358 4.8376 4.36362 4.90924V19.0911C4.36358 19.1627 4.37765 19.2337 4.40505 19.2999C4.43244 19.3661 4.47262 19.4262 4.52328 19.4769C4.57394 19.5275 4.63409 19.5677 4.7003 19.5951C4.7665 19.6225 4.83745 19.6366 4.90909 19.6365H19.0909C19.1626 19.6366 19.2335 19.6225 19.2997 19.5951C19.3659 19.5677 19.4261 19.5275 19.4767 19.4769C19.5274 19.4262 19.5676 19.3661 19.595 19.2999C19.6223 19.2337 19.6364 19.1627 19.6364 19.0911V4.90924C19.6364 4.8376 19.6223 4.76664 19.595 4.70044C19.5676 4.63424 19.5274 4.57409 19.4767 4.52343C19.4261 4.47277 19.3659 4.43259 19.2997 4.4052C19.2335 4.3778 19.1626 4.36372 19.0909 4.36377ZM18.5455 18.5456H5.45457V5.45471H18.5455V18.5456Z"
									fill="#101010"
								/>
							</g>
							<defs>
								<clipPath id="clip0_317_3017">
									<rect width="24" height="24" fill="white" />
								</clipPath>
							</defs>
						</svg>
					),
					text: 'GPU Servers',
					isActive: false,
                },
                {
                    href: '/user/dedicated-servers',
                    icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M1.25 14.5C1.25 14.3011 1.32902 14.1103 1.46967 13.9697C1.61032 13.829 1.80109 13.75 2 13.75H22C22.1989 13.75 22.3897 13.829 22.5303 13.9697C22.671 14.1103 22.75 14.3011 22.75 14.5V21C22.75 21.1989 22.671 21.3897 22.5303 21.5303C22.3897 21.671 22.1989 21.75 22 21.75H2C1.80109 21.75 1.61032 21.671 1.46967 21.5303C1.32902 21.3897 1.25 21.1989 1.25 21V14.5ZM2.75 15.25V20.25H21.25V15.25H2.75Z"
								fill="#101010"
							/>
							<path
								d="M17.75 19C18.0815 19 18.3995 18.8683 18.6339 18.6339C18.8683 18.3995 19 18.0815 19 17.75C19 17.4185 18.8683 17.1005 18.6339 16.8661C18.3995 16.6317 18.0815 16.5 17.75 16.5C17.4185 16.5 17.1005 16.6317 16.8661 16.8661C16.6317 17.1005 16.5 17.4185 16.5 17.75C16.5 18.0815 16.6317 18.3995 16.8661 18.6339C17.1005 18.8683 17.4185 19 17.75 19Z"
								fill="#101010"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M3.785 2.345C3.82055 2.17669 3.91289 2.02571 4.04652 1.91738C4.18016 1.80905 4.34697 1.74996 4.519 1.75H19.51C19.6825 1.74982 19.8497 1.8091 19.9836 1.91784C20.1175 2.02658 20.2098 2.17815 20.245 2.347L22.735 14.347L21.265 14.652L18.9 3.25H5.128L2.734 14.654L1.266 14.346L3.785 2.345Z"
								fill="#101010"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M6.75 9.75618C6.75 8.23018 8.139 7.26318 9.503 7.26318C9.70191 7.26318 9.89268 7.3422 10.0333 7.48285C10.174 7.62351 10.253 7.81427 10.253 8.01318C10.253 8.2121 10.174 8.40286 10.0333 8.54351C9.89268 8.68417 9.70191 8.76318 9.503 8.76318C8.725 8.76318 8.25 9.28318 8.25 9.75618C8.25 10.1292 8.388 10.3292 8.6 10.4692C8.854 10.6372 9.276 10.7492 9.849 10.7492H10.489C10.6879 10.7492 10.8787 10.8282 11.0193 10.9689C11.16 11.1095 11.239 11.3003 11.239 11.4992C11.239 11.6981 11.16 11.8889 11.0193 12.0295C10.8787 12.1702 10.6879 12.2492 10.489 12.2492H9.849C9.12 12.2492 8.367 12.1132 7.773 11.7202C7.136 11.3002 6.75 10.6272 6.75 9.75618ZM13.754 8.01318C13.754 7.81427 13.833 7.62351 13.9737 7.48285C14.1143 7.3422 14.3051 7.26318 14.504 7.26318C15.129 7.26318 15.807 7.40618 16.348 7.81618C16.92 8.24918 17.25 8.91518 17.25 9.75618C17.25 10.6292 16.86 11.3012 16.222 11.7212C15.626 12.1132 14.872 12.2502 14.144 12.2502H13.494C13.2951 12.2502 13.1043 12.1712 12.9637 12.0305C12.823 11.8899 12.744 11.6991 12.744 11.5002C12.744 11.3013 12.823 11.1105 12.9637 10.9699C13.1043 10.8292 13.2951 10.7502 13.494 10.7502H14.144C14.717 10.7502 15.141 10.6372 15.398 10.4682C15.612 10.3272 15.75 10.1272 15.75 9.75618C15.75 9.34118 15.606 9.13618 15.442 9.01118C15.247 8.86318 14.927 8.76318 14.504 8.76318C14.3051 8.76318 14.1143 8.68417 13.9737 8.54351C13.833 8.40286 13.754 8.2121 13.754 8.01318Z"
								fill="#101010"
							/>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M9.652 5.66C10.249 5.058 11.076 4.75 12 4.75C12.93 4.75 13.756 5.068 14.352 5.67C14.946 6.27 15.253 7.098 15.253 8.013C15.253 8.21191 15.174 8.40268 15.0333 8.54333C14.8927 8.68398 14.7019 8.763 14.503 8.763C14.3041 8.763 14.1133 8.68398 13.9727 8.54333C13.832 8.40268 13.753 8.21191 13.753 8.013C13.753 7.436 13.565 7.007 13.285 6.724C13.007 6.444 12.582 6.25 12 6.25C11.413 6.25 10.99 6.44 10.717 6.716C10.443 6.993 10.253 7.42 10.253 8.013C10.253 8.21191 10.174 8.40268 10.0333 8.54333C9.89268 8.68398 9.70191 8.763 9.503 8.763C9.30409 8.763 9.11332 8.68398 8.97267 8.54333C8.83202 8.40268 8.753 8.21191 8.753 8.013C8.753 7.089 9.056 6.26 9.653 5.659L9.652 5.66ZM14 12.25H10V10.75H14V12.25Z"
								fill="#101010"
							/>
						</svg>
					),
					text: 'Dedicated Servers',
					isActive: false,
                },
                {
                    href: '/user/wallet',
                    icon: <IoWalletOutline className="w-5 h-5 mr-1" />,
                    text: 'Wallet',
                    isActive: false,
                },
                {
                    href: '/user/billing',
                    icon: (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none">
							<path
								d="M12.37 8.87988H17.62"
								stroke="#101010"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M6.38 8.87988L7.13 9.62988L9.38 7.37988"
								stroke="#101010"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M12.37 15.8799H17.62"
								stroke="#101010"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M6.38 15.8799L7.13 16.6299L9.38 14.3799"
								stroke="#101010"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
								stroke="#101010"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					),
					text: 'Billing',
					isActive: false,
				},
				{
					href: '/user/settings',
					icon: <IoSettingsOutline className="w-5 h-5 mr-1" />,
					text: 'Settings',
					isActive: false,
				},
			];
		}
	}, [pathname, role]);

	if (typeof window !== 'undefined') {
		useEffect(() => {
			const sortedMenuList = [...menuItems].sort(
				(a, b) => b.href.length - a.href.length,
			);

			const selectedMenu = sortedMenuList.find((item) =>
				pathname?.startsWith(item.href),
			)?.href;

			if (selectedMenu) {
				setActiveKey(selectedMenu);
			}
		}, [pathname, menuItems]);
	}

	const handleMenuClick = (e: { href: string }) => {
		setActiveKey(e.href);
	};

	return (
		<aside className="w-full bg-whit xl:border-r border-gray-200 flex flex-col justify-center ">
			<div>
				<Link
					href={'/'}
					className="text-xl font-bold text-blue-600 hover:text-primary ms-[18px] hidden lg:block">
					<div className="w-40 overflow-hidden">
						<img src="/Logo.png" alt=" CudaSpace" className="w-full h-full" />
					</div>
				</Link>

				<nav className="mt-6">
					{menuItems.map((item, index) => (
						<Link
							key={index}
							href={item.href}
							onClick={() => handleMenuClick(item)}
							className={`flex items-center px-6 py-3 lg:max-w-52  rounded-lg gap-2 ${
								activeKey === item.href
									? 'bg-blue-primary text-white'
									: 'text-gray-700 hover:bg-gray-100'
							}`}>
							{item.icon}
							{item.text}
						</Link>
					))}
				</nav>
			</div>
		</aside>
	);
};

export default DashboardLayout;
