import { useState } from 'react';

function LoginForm({ onLogin, onSwitch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <>
     <h1 className=' text-center text-4xl bg-slate-200 text-slate-900'>File Transfer</h1>
    <div className="flex justify-center items-center min-h-screen bg-slate-200">
        
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md  bg-blue-200 ">
        <h2 className="mt-6 text-center text-3xl font text-gray-900">Log in to your account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          />
          <button 
            type="submit" 
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-900 hover:bg-blue-300 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
          <p className="text-center text-sm">
            Don`t have an account?{' '}
            <button onClick={onSwitch} className="font-medium text-blue-600 hover:text-blue-500">
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
</>
  );
}

export default LoginForm;