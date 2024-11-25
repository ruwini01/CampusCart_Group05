import React from 'react'
import { icons } from '../constants'

function SearchInput() {
  return (
    <div>
      <TouchableOpacity>
        <Image source={icons.search} className='w-5 h-5' resizeMode='contain'/>
        <p>Hi</p>
        <p>HEllo Ruwini</p>
      </TouchableOpacity>
    </div>
  )
}

export default SearchInput
