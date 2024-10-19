import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const Home = () => {
  return (
    <div className="flex flex-col justify-center ">
      <div
        className=" flex items-center sticky top-0 justify-between h-14 mt-1 mx-2 p-4 
         bg-blue-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100"
      >
        <div>Drop</div>
        <div className="hidden sm:flex"> Choose a zebi</div>

        <div className=" flex flex-row justify-between  items-center">
          <div className="flex bg-slate-500 h-10 rounded-badge items-center me-2 p-1">
            there
          </div>
          <div className="me-1">Jone Doe</div>
          <div className=" md:hidden">
            <GiHamburgerMenu className="text-3xl" />
          </div>
          <div className="hidden md:flex ">
            <IoIosArrowDropdownCircle className="text-3xl" />
          </div>
        </div>
      </div>
      <div className=" flex flex-col md:flex-row justify-evenly m-2 p-2 bg-green-600 ">
        <section className="flex flex-col justify-start bg-yellow-400 md:m-12">
          <div className="text-2xl md:text-4xl text-gray-900 font-bold">
            The title
          </div>
          <div className="ms-3 md:m-4 md:p-5">
            <form className="flex flex-col space-y-2 items-center md:min-w-11 ">
              <input
                type="text"
                placeholder="lieu de depart"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="destination"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="schedule"
                className="input input-bordered w-full max-w-xs"
              />
              <input
                type="text"
                placeholder="schedule"
                className="input input-bordered w-full max-w-xs"
              />

              <button className="btn btn-outline w-3/4 md:w-full">
                Search
              </button>
            </form>
          </div>
        </section>
        <map className="bg-orange-500 flex-grow">the map</map>
      </div>
    </div>
  );
};

export default Home;
