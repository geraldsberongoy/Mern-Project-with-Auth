import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="bg-base-200 text-base-content container flex min-h-screen items-center justify-center p-5">
        <div className="card bg-base-100 flex w-96 border shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Card Title</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary rounded-full">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
