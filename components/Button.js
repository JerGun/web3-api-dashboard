import React from "react"

export default function Button(props) {
  return (
    <button
      type={props.type || "submit"}
      onClick={props.onClick}
      className={`${props.height || "h-12"} ${
        props.width || "w-full"
      } rounded-md px-5 ${props.bgColor || "bg-primary"} ${
        props.textColor || "text-black"
      }`}
    >
      {props.title}
    </button>
  )
}
