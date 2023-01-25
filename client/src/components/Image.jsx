import React from 'react'

export default function Image({image, handleImageRemove = f => f}) {
  return (
    <img
        src={image.url}
        key={image.public_id}
        alt={image.public_id}
        style={{ height: '100px' }}
        className="float-right"
        onClick={()=>handleImageRemove(image.public_id)}
    />
  )
}
