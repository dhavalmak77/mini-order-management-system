import { OrdersList, type Order } from '@/components/orders/OrdersList';
import { API_URL, token } from '@/utils/utills';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

// export interface Order {
// 	_id: string,
// 	products: Product[],
// 	orderCost: number
// }

export const Orders = () => {
	const [orders, setOrders] = useState<Array<Order>>([]);

	const fetchOrders = async () => {
		try {
			const response = await axios.get(`${API_URL}/orders/`, {
				params: {
					limit: 1000
				},
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			setOrders(response.data.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<div className='mx-auto space-y-4 pt-4 text-center'>
			<h1 className='text-3xl font-semibold'>Orders</h1>
			<div className='w-7xl'>
				<OrdersList
					data={orders}
				/>
			</div>
		</div>
	);
};
