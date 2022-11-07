import React, { forwardRef } from "react"

export default forwardRef(function Input(props, ref) {
  return (
    <input
      ref={ref}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      className="h-12 w-full rounded-md px-3 bg-input"
    />
  )
})
