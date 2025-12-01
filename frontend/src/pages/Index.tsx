import { API_URL, token } from "@/utils/utills";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Index = () => {
	const [user, setUser] = useState<any>({});

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.get(`${API_URL}/user/`, {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				setUser(response.data.data);
			} catch (error: AxiosError | any) {
				const message = error.response?.data?.message || error.message;
				toast(message);
			}
		})();
	}, []);

	return (
		<div className="p-8">
			<p className="text-lg">Hi, {user?.email || '-'}</p>
			<p>Total Products: {user?.products?.length || '-'}</p>
			<p>Total Orders: {user?.orders?.length || '-'}</p>
		</div>
	)
}
