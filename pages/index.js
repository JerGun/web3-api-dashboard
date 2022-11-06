import { useRouter } from "next/router"
import { signIn } from "next-auth/react"
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import axios from "axios"

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

    const fetchNonce = await axios.get(
      `${process.env.BACKEND_URL}/users/nonce/${account}`
    )

    const message = `Nonce: ${fetchNonce.data.nonce}`

    const signature = await signMessageAsync({ message })
    console.log(signature)

    const address = account

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
    </div>
  )
}
