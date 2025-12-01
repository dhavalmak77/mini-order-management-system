import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './App.css';
import { Header } from './components/layout/Header';
import { Index } from './pages/Index';
import { Login } from './pages/Login';
import { MainWrapper } from './components/layout/MainWrapper';
import { Register } from './pages/Register';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';

const Protected = ({ children }: React.PropsWithChildren) => {
	const token = localStorage.getItem('token');
	if (!token) {
		return <Navigate to="/login" replace />
	}
	return children;
}

function App() {
	return (
		<BrowserRouter>
			<Header />
			<MainWrapper>
				<Routes>
					<Route
						index
						element={<Protected><Index /></Protected>}
					/>
					<Route
						path='login'
						element={<Login />}
					/>
					<Route
						path='register'
						element={<Register />}
					/>
					<Route
						path='products'
						element={<Protected><Products /></Protected>}
					/>
					<Route
						path='orders'
						element={<Protected><Orders /></Protected>}
					/>
					{/* <Route
						path='step-2'
						element={<StepTwo />}
					/>
					<Route
						path='step-3'
						element={<StepThree />}
					/> */}
				</Routes>
			</MainWrapper>
		</BrowserRouter>
	);
}

export default App;
