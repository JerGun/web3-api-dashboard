import Button from "@components/Button"
import { faCopy, faKey, faSignature } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import { getSession, signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import Input from "../components/Input"

// gets a prop from getServerSideProps
function User({ user }) {
  const pathRef = useRef()
  const usernameRef = useRef()
  const avatarRef = useRef()
  const bannerRef = useRef()

  const [userData, setUserData] = useState({})
  const [queryData, setQueryData] = useState({})

  useEffect(() => {
    localStorage.setItem("accessToken", user.accessToken)

    fetchUser()
  }, [])

  const substring = (string, index) => {
    return `${string.substring(0, index || 8)} ... ${string.slice(
      -index || -8
    )}`
  }

  const fetchUser = async () => {
    const user = await axios.get(`${process.env.BACKEND_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    setUserData(user.data)
    usernameRef.current.value = user.data.username
    avatarRef.current.value = user.data.avatar
    bannerRef.current.value = user.data.banner
  }

  const handlerSubmit = async (e) => {
    e.preventDefault()
    const updateUser = {
      username: usernameRef.current.value,
      avatar: avatarRef.current.value,
      banner: bannerRef.current.value,
    }
    const user = await axios.put(
      `${process.env.BACKEND_URL}/users`,
      updateUser,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    )
    setUserData(user.data)
  }

  const handlerQueryPath = async (e) => {
    e.preventDefault()
    const path = pathRef.current.value
    const queryResult = await axios.get(`${process.env.BACKEND_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    setQueryData(queryResult.data)
  }

  const copyData = (data) => {
    navigator.clipboard.writeText(data)
  }

  return (
    <div className="h-screen flex p-10 space-x-10 bg-background text-white">
      <div className="w-1/4 space-y-5">
        <div className="h-fit w-full rounded-xl bg-subBackground">
          <div className="h-64 w-full opacity-90">
            <img
              src={userData.banner}
              alt="Banner"
              className="h-full w-full rounded-t-xl object-cover"
            />
          </div>
          <div className="h-2/3 flex p-5 space-x-5">
            <img
              src={userData.avatar}
              alt="Avatar"
              className="h-24 w-24 rounded-full p-1 border-2 border-dashed"
            />
            <div className="w-full space-y-3 text-white">
              <p className="text-2xl">{userData.username}</p>
              <button
                onClick={() => copyData(user.address)}
                className="h-10 flex items-center space-x-3 px-5 border rounded-md transition-all ease-in-out duration-300 hover:bg-white hover:text-black"
              >
                <p className="text-xl">{substring(user.address, 5)}</p>
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <div className="flex space-x-3 items-center text-primary">
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faKey} />
                  <p>Access Token: </p>
                </div>
                <button
                  onClick={() => copyData(user.accessToken)}
                  className="text-white"
                >
                  {substring(user.accessToken)}
                </button>
              </div>
              <div className="flex space-x-3 items-center text-primary">
                <div className="flex items-center space-x-1">
                  <FontAwesomeIcon icon={faSignature} />
                  <p>Signature: </p>
                </div>
                <button
                  onClick={() => copyData(user.signature)}
                  className="text-white"
                >
                  {substring(user.signature)}
                </button>
              </div>
            </div>
          </div>
          <div className="p-3">
            <Button
              onClick={() => signOut({ redirect: "/signin" })}
              title="Sign Out"
              bgColor="bg-cancel"
              textColor="text-white"
            />
          </div>
        </div>
        <form
          onSubmit={handlerSubmit}
          className="w-full flex flex-col space-y-5 p-5 rounded-xl bg-subBackground"
        >
          <div className="flex items-center space-x-3">
            <p className="w-24">Username</p>
            <Input ref={usernameRef} />
          </div>
          <div className="flex items-center space-x-3">
            <p className="w-24">Avatar</p>
            <Input ref={avatarRef} />
          </div>
          <div className="flex items-center space-x-3">
            <p className="w-24">Banner</p>
            <Input ref={bannerRef} />
          </div>
          <Button title="Save" />
        </form>
      </div>
      <form onSubmit={handlerQueryPath} className="space-x-5">
        <div className="flex items-center space-x-3">
          <p>{process.env.BACKEND_URL}/</p>
          <input
            ref={pathRef}
            type="text"
            placeholder="path"
            className="h-10 rounded border border-gray-300 px-3"
          />
        </div>
        <button
          type="submit"
          className="h-10 border rounded px-5 bg-blue-400 text-white"
        >
          Send
        </button>
      </form>
      <pre>{JSON.stringify(queryData, null, 2)}</pre>

      <button
        onClick={() => signOut({ redirect: "/signin" })}
        className="h-10 border rounded px-5 bg-red-400 text-white"
      >
        Sign out
      </button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  // redirect if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: { user: session.user },
  }
}

export default User
