import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Order {
	_id: string;
	products: [
		{
			product: string;
			name: string;
			quantity: number;
			price: number;
		}
	];
	orderCost: number;
	createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export function OrdersList({
	data
}: {
	data: Order[];
}) {
	return (
		<div className=''>
			<Table>
				<TableHeader>
					<TableRow className='bg-neutral-400'>
						<TableHead>Order Id</TableHead>
						<TableHead className='text-center'>Products</TableHead>
						<TableHead>Order Cost</TableHead>
						<TableHead>Order Placed At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((order, index) => {
						return (
							<TableRow key={index}>
								<TableCell className='font-medium'>{order._id}</TableCell>
								<TableCell>
									<div className='flex flex-col gap-2'>
										<div
											key={index}
											className='grid grid-cols-4 [&>p]:font-semibold'
										>
											<p>Name</p>
											<p>Price</p>
											<p>Quantity</p>
											<p>Sub Total</p>
										</div>
										{order.products.map((product, index) => (
											<div
												key={index}
												className='grid grid-cols-4'
											>
												<p>{product.name}</p>
												<p>{product.price}</p>
												<p>{product.quantity}</p>
												<p>{product.price * product.quantity}</p>
											</div>
										))}
									</div>
								</TableCell>
								<TableCell>₹{order.orderCost.toString()}</TableCell>
								<TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
