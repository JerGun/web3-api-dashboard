import React from "react"

export default function Button(props) {
  return (
    <button
      type={props.type || "submit"}
      onClick={props.onClick}
      className={`h-12 w-full rounded-md px-5 ${
        props.bgColor || "bg-primary"
      } ${props.textColor || "text-black"}`}
    >
      {props.title}
    </button>
  )
}
