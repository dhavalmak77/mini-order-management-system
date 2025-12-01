import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { Checkbox } from "../ui/checkbox"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { API_URL, token } from "@/utils/utills";

export interface Product {
	_id: string,
	name: string,
	price: number,
	stock: number
}

export function ProductList({
	data,
	currentPage,
	totalPage,
	setCurrentPage,
	fetchProducts
}: {
	data: Product[];
	currentPage: number;
	totalPage: number;
	setCurrentPage: (page: number) => void;
	fetchProducts: () => void;
}) {
	const pages = Array.from({ length: totalPage }, (_, i) => i + 1);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
	const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});

	const toggleSelect = (productId: string) => {
		setSelectedProducts((prev) => {
			const exists = prev.includes(productId);
			if (exists) {
				const updated = prev.filter((p) => p !== productId);

				setOrderQuantities((prevQty) => {
					const { [productId]: _, ...rest } = prevQty;
					return rest;
				});

				return updated;
			}

			return [...prev, productId];
		});
	};

	const handleQuantityChange = (productId: string, value: string) => {
		const quantity = Number(value);

		// If empty or zero — remove quantity
		if (!value || quantity <= 0) {
			setOrderQuantities((prev) => {
				const { [productId]: _, ...rest } = prev;
				return rest;
			});
			return;
		}

		setOrderQuantities((prev) => ({
			...prev,
			[productId]: quantity
		}));
	};

	const placeOrder = async () => {
		if (selectedProducts.length === 0) {
			return toast("No products selected.");
		}

		const productsToOrder = selectedProducts.map((productId) => ({
			product: productId,
			quantity: orderQuantities[productId] ?? 0
		}));

		// Validation
		for (const item of productsToOrder) {
			if (item.quantity <= 0) {
				return toast("Quantity cannot be empty or zero for selected products.");
			}
		}

		try {
			const response = await axios.post(
				`${API_URL}/orders`,
				{ products: productsToOrder },
				{
					headers: { Authorization: `Bearer ${token}` }
				}
			);

			toast("Order placed successfully!");
			setSelectedProducts([]);
			setOrderQuantities({});
		} catch (error: AxiosError | any) {
			const msg = error.response?.data?.message || error.message;
			toast(msg);
		}
	};

	const deleteProduct = async (productId: String) => {
		try {
			const response = await axios.delete(`${API_URL}/products/${productId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			fetchProducts();
			toast(response.data.message);
		} catch (error: AxiosError | any) {
			const message = error.response?.data?.message || error.message;
			toast(message);
		}
	};

	return (
		<div className="">
			<div className="text-left mb-4 space-y-2">
				<h3 className="font-bold text-xl">Selected Products</h3>
				{selectedProducts.length === 0 ? (
					<span className="mr-4">none</span>
				) : (
					<p className="flex gap-4">
						{selectedProducts.map((product) => <span className="">{data.find((p) => p._id === product)?.name}</span>)}
					</p>
				)}
				<Button size="sm" variant="outline" onClick={placeOrder}>
					Place Order
				</Button>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Select</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Stock</TableHead>
						<TableHead>Action</TableHead>
						<TableHead className="text-right">Order Quantity</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((product, index) => {
						const isChecked = selectedProducts.some(
							(p) => p === product._id
						);

						return (
							<TableRow key={index}>
								<TableCell className="font-medium w-[50px]">
									<Checkbox
										checked={isChecked}
										onCheckedChange={() => toggleSelect(product._id)}
										disabled={product.stock === 0}
									/>
								</TableCell>
								<TableCell className="font-medium">{product.name}</TableCell>
								<TableCell>{product.price.toString()}</TableCell>
								<TableCell>{product.stock.toString()}</TableCell>
								<TableCell className="w-[100px]">
									<Button size='sm' variant='outline' onClick={() => deleteProduct(product._id)}>Delete</Button>
								</TableCell>
								<TableCell className="text-right w-[150px]">
									<Input
										type="number"
										min={1}
										disabled={!isChecked}  // disable input when not selected
										value={orderQuantities[product._id] ?? ""}
										onChange={(e) => handleQuantityChange(product._id.toString(), e.target.value)}
									/>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
				{/* <TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total</TableCell>
						<TableCell className="text-right">$2,500.00</TableCell>
					</TableRow>
				</TableFooter> */}
			</Table>

			<div className="mt-4 flex justify-end w-full">
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage > 1) {
										setCurrentPage(currentPage - 1);
									}
								}}
							/>
						</PaginationItem>

						{pages.map((page) => (
							<PaginationItem key={page}>
								<PaginationLink
									href="#"
									isActive={page === currentPage}
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage(page);
									}}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								href="#"
								onClick={(e) => {
									e.preventDefault();
									if (currentPage < totalPage) setCurrentPage(currentPage + 1);
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	)
}
