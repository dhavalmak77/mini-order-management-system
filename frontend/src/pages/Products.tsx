import { CreateProduct } from "@/components/products/CreateProduct";
import { ProductList, type Product } from "@/components/products/ProductList";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export const Products = () => {
	const [products, setProducts] = useState<Array<Product>>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(1);

	const token = localStorage.getItem('token');

	const fetchProducts = async (page = 1) => {
		try {
			const response = await axios.get(`${API_URL}/products/`, {
				params: {
					page,
					limit: 10
				},
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			setProducts(response.data.data);
			setCurrentPage(response.data.currentPage);
			setTotalPage(response.data.totalPage);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchProducts(currentPage);
	}, [currentPage]);

	return (
		<div className="mx-auto space-y-4 pt-4 text-center">
			<CreateProduct fetchProducts={fetchProducts} />
			<div className="w-7xl">
				<ProductList
					data={products}
					currentPage={currentPage}
					totalPage={totalPage}
					setCurrentPage={setCurrentPage}
					fetchProducts={fetchProducts}
				/>
			</div>
		</div>
	)
}
