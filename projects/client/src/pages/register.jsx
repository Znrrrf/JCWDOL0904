import { React, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../API/api";
import { Button } from "@chakra-ui/react";

const url = "/user/register";

export const Register = () => {
  let navigate = useNavigate();

  let email = useRef();

  const registerAccount = async () => {
    try {
      let result = await api.post(url, { email: email.current.value });

      Swal.fire({
        title: "Success",
        text: result.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response.data.message,
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Register
            </h1>
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Create your galaxy ID
              </label>
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Email"
                required=""
                ref={email}
              />
            </div>
            <div class="flex items-start"></div>
            <button
              type="submit"
              class="w-full text-black bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              onClick={() => registerAccount(email.current.value)}
            >
              Register
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Button
                onClick={() => navigate("/")}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Login here
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
