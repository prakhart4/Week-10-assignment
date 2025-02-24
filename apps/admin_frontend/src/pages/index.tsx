// import { Inter } from "next/font/google";
// import Dashboard from "@/components/Dashboard";
import { useEffect, useState } from "react";
// import { AppBarComponent } from "@/components/AppBarComponent";
// import { DrawerComponent } from "@/components/DrawerComponent";
// import { CssBaseline } from "@mui/material";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useRouter } from "next/navigation";
import { userLoggedInState } from "@/store/selectors/isUserLoggedIn";
import { userLoadingState } from "@/store/selectors/isUserLoading";
import { userState } from "@/store/atoms/user";
import { AppBarComponent } from "@/components/AppBarComponent";
import { DrawerComponent } from "@/components/DrawerComponent";
import Dashboard from "@/components/Dashboard";

// const inter = Inter({ subsets: ["latin"] });
export const drawerWidth = 240;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parse(context.req.headers.cookie || ""); // Parse cookies from the request headers
  const token = cookies.token || ""; // Extract the 'token' cookie

  //check for token
  if (!token) {
    return {
      redirect: {
        destination: "/signIn", // Redirect to the signIn page
        permanent: false,
      },
    };
  }

  //fetch user data from the backend
  const res = await fetch(
    `${process.env["NEXT_PUBLIC_BACKEND_URL"]}/api/user`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  //check for status ok
  if (!res.ok) {
    return {
      redirect: {
        destination: "/signIn", // Redirect to the signIn page
        permanent: false,
      },
    };
  }

  //Get the user data from the response body
  const user = await res.json();

  // Check if the token exists and is valid (you might want to implement your own validation logic)
  if (user) {
    // User is logged in

    //return the user data to the client
    return {
      props: {
        user,
      },
    };
  } else {
    // User is not logged in, redirect to a signIn page
    return {
      redirect: {
        destination: "/signIn", // Redirect to the signIn page
        permanent: false,
      },
    };
  }
};

export default function Home({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const setUser = useSetRecoilState(userState);
  const { push } = useRouter();

  useEffect(() => {
    setUser({ user, isLoading: false });

    return () => {};
  }, [user]);

  return <Dashboard />;
}

Home.getLayout = true;
