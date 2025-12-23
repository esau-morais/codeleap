import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type SignupInput, signupSchema } from "../lib/schemas";

interface SignupProps {
	onSignup: (username: string) => void;
}

export default function Signup({ onSignup }: SignupProps) {
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm<SignupInput>({
		resolver: zodResolver(signupSchema),
		mode: "onChange",
	});

	const onSubmit = (data: SignupInput) => onSignup(data.username);

	return (
		<div className="fixed inset-0 bg-[#ddd] flex items-center justify-center p-4">
			<div className="bg-white border border-[#ccc] rounded-2xl p-6 w-full max-w-[500px]">
				<h1 className="text-[22px] font-bold text-black mb-[26px]">
					Welcome to CodeLeap network!
				</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<p className="text-base text-black mb-[11px]">
						Please enter your username
					</p>
					<input
						{...register("username")}
						placeholder="John doe"
						className="w-full border border-[#777] rounded-lg px-[11px] py-2 text-sm mb-4 placeholder:text-[#ccc]"
					/>
					<div className="flex justify-end">
						<button
							type="submit"
							disabled={!isValid}
							className="bg-[#7695ec] text-white font-bold text-base px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							ENTER
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
