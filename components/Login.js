import { signIn } from "next-auth/react";
import Image from "next/image";
//print((10.5 + 2*3)/(45-3.5))

function Login({ providers }) {
    // console.log('providers',providers)
  return (
    <div className="flex flex-col items-center space-y-20 pt-48 max-h-screen bg-black">
      {/* <Image
        src="https://rb.gy/ogau5a"
        width={150}
        height={150}
       
      /> */}

      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            {/* https://devdojo.com/tailwindcss/buttons#_ */}
            <button
              className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group mt-[150px]"
              onClick={() => signIn(provider.id, { callbackUrl: "http://localhost:3000/" })}
            >
              <span className="w-48 h-48 rounded rotate-[-40deg] bg-[#ff9933] absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
              <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
                Sign in with {provider.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Login;