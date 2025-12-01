import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/utils/utills";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (localStorage.getItem('token')) {
			window.location.href = '/';
		}
	}, []);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_URL}/user/login`, {
				email,
				password
			});

			setError('');
			localStorage.setItem('token', response.data.token);
			window.location.href = '/products';
		} catch (error: AxiosError | any) {
			const message = error.response?.data?.message || error.message;
			setError(message);
		}
	};

	return (
		<div className="mx-auto space-y-4 pt-4 w-sm text-center">
			<h1 className="text-3xl font-semibold">Login</h1>
			<form className="max-w-sm space-y-4 [&>div]:space-y-2" onSubmit={onSubmit}>
				<div>
					<Label htmlFor="email">Email</Label>
					<Input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div>
					<Label htmlFor="password">Password</Label>
					<Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>

				{error && <p className="text-red-500 font-medium">{error}</p>}

				<div className="space-x-4">
					<Button type="submit">Login</Button>
					<Link to="/register">
						<Button variant={"outline"}>Register</Button>
					</Link>
				</div>
			</form>
		</div>
	)
}
