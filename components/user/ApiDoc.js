import Button from "@components/Button"
import { faClipboard } from "@fortawesome/free-regular-svg-icons"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Listbox, Transition } from "@headlessui/react"
import axios from "axios"
import React, { Fragment, useRef, useState } from "react"

const methods = ["get", "post", "put", "patch", "delete"]

export default function ApiDoc() {
  const pathRef = useRef()
  const queryRef = useRef()

  const [queryData, setQueryData] = useState(null)
  const [payload, setPayload] = useState({})
  const [selected, setSelected] = useState(methods[0])

  const handlerQueryPath = async (e) => {
    e.preventDefault()
    const path = pathRef.current.value
    let queryResult = await axios({
      method: selected,
      url: `${process.env.BACKEND_URL}/${path || ""}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })

    console.log(queryResult)

    setQueryData(queryResult.data)
  }

  const copyData = (data) => {
    navigator.clipboard.writeText(data)
  }

  return (
    <div className="w-3/4 flex space-x-5">
      <div className="w-1/2 p-5 space-y-5 rounded-xl bg-subBackground">
        <p>API Docs</p>
        <div className="h-[94%] overflow-y-auto">
            
        </div>
      </div>
      <div className="w-1/2 space-y-5">
        <form
          onSubmit={handlerQueryPath}
          className="w-full flex justify-between"
        >
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative z-50">
              <Listbox.Button className="relative h-10 w-full px-5 space-x-3 rounded-md bg-input">
                <span className="uppercase">{selected}</span>
                <FontAwesomeIcon icon={faChevronDown} />
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-2 max-h-80 w-full rounded-md p-3 bg-input space-y-1">
                  {methods.map((method, i) => (
                    <Listbox.Option
                      key={i}
                      value={method}
                      className={({ active }) =>
                        `relative cursor-pointer select-none flex justify-center p-3 uppercase text-white ${
                          active ? "bg-customGrayHeavy rounded-lg" : null
                        }`
                      }
                    >
                      <p className="">{method}</p>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          <div className="h-10 flex items-center rounded-md px-3 bg-input">
            <p>{process.env.BACKEND_URL}/</p>
            <input
              ref={pathRef}
              type="text"
              placeholder="path"
              className="bg-transparent outline-none"
            />
          </div>
          <Button
            height="h-10"
            width="w-24"
            bgColor="bg-secondary"
            textColor="text-white"
            title="Send"
          />
        </form>
        <div className="relative w-full max-h-[801px] rounded-xl overflow-auto transition-all duration-500 ease-in-out divide-y divide-customGrayHeavy bg-subBackground">
          {queryData ? (
            <pre ref={queryRef} className="p-5">
              {JSON.stringify(queryData, null, 2)}
            </pre>
          ) : (
            <p className="flex justify-center p-10">
              Click Send! to start a request and see the response here!
            </p>
          )}
          <div className="sticky bottom-0 p-5 bg-subBackground">
            <button
              onClick={() => copyData(JSON.stringify(queryData, null, 2))}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
