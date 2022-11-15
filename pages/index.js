import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import axios from "axios"
import { ResponsiveHoneycomb, Honeycomb, Hexagon } from "react-honeycomb"
import range from "lodash/range"

const items = range(72)
const sideLength = 64
const hideList = [0, 1, 8, 9, 10, 26, 44, 62]
const cleenList = [11, 17, 18, 19, 27, 28, 36, 45, 54, 63, 35, 43, 53, 60, 61, 70, 71]

export default function Home() {
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { push } = useRouter()

  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync()
    }

    const { account } = await connectAsync({
      connector: new MetaMaskConnector(),
    })
    const address = account

    const fetchNonce = await axios.get(`${process.env.BACKEND_URL}/users/nonce/${account}`)

    const message = `Nonce: ${fetchNonce.data.nonce}`
    const signature = await signMessageAsync({ message })

    const { url } = await signIn("credentials", {
      address,
      signature,
      redirect: false,
      callbackUrl: "/user",
    })

    push(url)
  }
  return (
    <div>
      <h3>Web3 Authentication</h3>
      <button onClick={() => handleAuth()}>Authenticate via Metamask</button>
      <Honeycomb
        columns={9}
        size={sideLength}
        items={items}
        renderItem={(item, index) => (
          <Hexagon>
            {/* <p>{index}</p>
            <p>{index}</p> */}
            {cleenList.includes(index) ? (
              <div className="h-full w-full bg-gray-600"></div>
            ) : !hideList.includes(index) ? (
              <img
                src={`https://picsum.photos/${sideLength * 2}?random=${item}`}
                alt={`Random #${item}`}
                className="h-full w-full"
              />
            ) : null}
          </Hexagon>
        )}
      />
    </div>
  )
}
