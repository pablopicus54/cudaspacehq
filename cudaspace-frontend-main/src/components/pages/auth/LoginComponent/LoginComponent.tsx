"use client";
import loginImage from "@/assets/images/authImage.webp";
import MyFormInput from "@/components/ui/MyForm/MyFormInput/MyFormInput";
import MyFormWrapper from "@/components/ui/MyForm/MyFormWrapper/MyFormWrapper";
import MyFormCheckbox from "@/components/ui/MyForm/MyFormCheckbox/MyFormCheckbox";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { handleAsyncWithToast } from "@/utils/handleAsyncWithToast";
import { verifyToken } from "@/utils/verifyToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { JwtPayload } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const validationSchema = z.object({
	email: z
		.string({
			required_error: "Email is required",
		})
		.email("Invalid email address"),
	password: z
		.string({
			required_error: "Password is required",
		})
		.min(8, "Password must be at least 8 characters long"),
	keepMeLogin: z.boolean().optional(),
});

interface DecodedUser extends JwtPayload {
	role: string; // Add role explicitly
}

export default function LoginComponent() {
	const [login] = useLoginMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get("redirect");

	console.log("redirectUrl", redirectUrl);

	const handleSubmit = async (formData: any, reset: any) => {
		const response = await handleAsyncWithToast(async () => {
			return login(formData);
		});
		if (response?.data?.success) {
			const user = (await verifyToken(
				response?.data?.data?.accessToken
			)) as DecodedUser;
			await dispatch(
				setUser({
					user: user,
					access_token: response?.data?.data?.accessToken,
					refresh_token: response?.data?.data?.refreshToken,
				})
			);
			// Basic verification: log approximate expiry based on decoded exp
			const expMs = (user?.exp ?? 0) * 1000;
			if (expMs) {
				const approxDays = Math.round((expMs - Date.now()) / (1000 * 60 * 60 * 24));
				console.log(`Login keepMeLogin=${!!formData?.keepMeLogin}, token expires in ~${approxDays} days`);
			}
			reset();

			if (redirectUrl) {
				router.push(redirectUrl);
			} else if (user?.role === "ADMIN") {
				router.push("/dashboard");
			} else {
				router.push("/");
			}
		}
	};
	return (
		<main className="flex min-h-screen">
			{/* Left side - Spa illustration */}
			<div className="hidden md:flex md:w-1/2 bg-green-900 relative">
				<div className="relative w-full h-full flex items-center justify-center p-12">
					<div className="absolute inset-0 flex items-center justify-center">
						<Image
							src={loginImage}
							alt="Spa relaxation illustration"
							width={1000}
							height={1000}
							className="object-cover w-full h-full"
							priority
						/>
					</div>
				</div>
			</div>

			{/* Right side - Sign up form */}
			<div className="w-full md:w-1/2 flex items-center justify-center p-8 ">
				<div className="w-full  max-w-2xl">
					<h1 className="text-2xl font-bold mb-8">Log In</h1>

				<MyFormWrapper
					onSubmit={handleSubmit}
					resolver={zodResolver(validationSchema)}
					defaultValues={{ keepMeLogin: false }}
					className="space-y-6">
					<div className="space-y-6">
						<MyFormInput
							name="email"
							label="Email Address"
							type="email"
							placeHolder="demo@gmail.com"
							inputClassName="w-full px-3 py-2 "
						/>

							<MyFormInput
								name="password"
								label="Password"
								type="password"
								placeHolder="••••••••"
								inputClassName="w-full px-3 py-2 "
							/>
						<div>
							<Link href={"/auth/forgot-password"} className="text-sm ">
								<p className="text-blue-primary underline cursor-pointer">
									Forget Password?
								</p>
							</Link>
						</div>

						{/* Remember me checkbox */}
						<MyFormCheckbox
							name="keepMeLogin"
							label="Remember me"
							checkboxClassName=""
						/>
					</div>

						<div className="flex flex-col items-center gap-4">
							<button
								type="submit"
								className="w-full bg-blue-primary text-white py-3 rounded-md hover:bg-blue-900 transition duration-200">
								Login
							</button>

							<p className="text-sm text-gray-600">
								Don’t have an account?
								<Link href="/auth/register" className="text-blue-primary  ps-1">
									Create now
								</Link>
							</p>
						</div>
					</MyFormWrapper>
				</div>
			</div>
		</main>
	);
}
