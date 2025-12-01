import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { token } from "@/utils/utills";

export const Header = () => {
	const logout = () => {
		localStorage.removeItem('token');
		window.location.href = '/login';
	};

	return (
		<div>
			<nav className='flex justify-between items-center p-4 border-b'>
				<div className='text-2xl font-bold select-none'>
					<Link to='/'>Mini Order Management System</Link>
				</div>

				<div className='flex items-center gap-6'>
					{!token ? (
						<>
							<Link to='/login' className="hover:underline underline-offset-4">Login</Link>
							<Link to='/register' className="hover:underline underline-offset-4">Register</Link>
						</>
					) : (
						<>
							<Link to='/products' className="hover:underline underline-offset-4">Products</Link>
							<Link to='/orders' className="hover:underline underline-offset-4">Orders</Link>
							<Button onClick={logout} className="hover:underline underline-offset-4" variant={"outline"}>Logout</Button>
						</>
					)}
				</div>
			</nav>
		</div>
	);
};
