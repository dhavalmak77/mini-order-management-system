import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { API_URL, token } from '@/utils/utills';

export const CreateProduct = ({ fetchProducts }: { fetchProducts: () => void }) => {
	const [name, setName] = useState<string>('');
	const [price, setPrice] = useState<string>('');
	const [stock, setStock] = useState<string>('');
	const [error, setError] = useState<string>('');

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name || !price || !stock) {
			setError('All fields are required');
			return;
		}

		try {
			const response = await axios.post(
				`${API_URL}/products/`,
				{
					name,
					price,
					stock,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setError('');
			fetchProducts();
			toast(response.data.message);
			setName('');
			setPrice('');
			setStock('');
		} catch (error: AxiosError | any) {
			const message = error.response?.data?.message || error.message;
			setError(message);
		}
	};

	return (
		<>
			<h1 className='text-3xl font-semibold'>Add Product</h1>
			<form
				className='mx-auto max-w-sm space-y-4 [&>div]:space-y-2'
				onSubmit={onSubmit}
			>
				<div>
					<Label htmlFor='email'>Name</Label>
					<Input
						type='text'
						id='email'
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor='number'>Price</Label>
					<Input
						type='number'
						id='number'
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor='number'>Stock</Label>
					<Input
						type='number'
						id='number'
						value={stock}
						onChange={(e) => setStock(e.target.value)}
					/>
				</div>

				{error && <p className='text-red-500 font-medium'>{error}</p>}

				<div className='space-x-4'>
					<Button type='submit'>Add Product</Button>
				</div>
			</form>
		</>
	);
};
